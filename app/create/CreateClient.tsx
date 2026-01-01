"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/Button";

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://evermoment-frontend-1.onrender.com";

const FAST_TRACK_UI_ENABLED = true;

const PLANS = [
  { id: "story", name: "Story / Status", price: 149, duration: "Up to 1 minute" },
  { id: "basic", name: "Beautiful Moments", price: 399, duration: "Up to 3 minutes" },
  { id: "premium", name: "Premium Moments", price: 799, duration: "Up to 10 minutes" },
];

type UploadedFile = {
  file: File;
  id: string;
  type: "video" | "image";
};

export default function CreateClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planFromUrl = searchParams.get("plan");

  const [selectedPlan, setSelectedPlan] = useState("");
  const [fastTrack, setFastTrack] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    momentType: "",
    customMomentType: "",
    specialBecause: "",
    whatsappNumber: "",
    email: "",
  });

  useEffect(() => {
    if (planFromUrl && PLANS.some(p => p.id === planFromUrl)) {
      setSelectedPlan(planFromUrl);
    }
  }, [planFromUrl]);

  useEffect(() => {
    if (selectedPlan !== "story") setFastTrack(false);
  }, [selectedPlan]);

  /* =====================
     FILE HANDLING (NO DUPES)
     ===================== */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const incoming = Array.from(e.target.files);

    setUploadedFiles(prev => {
      const existingKeys = new Set(
        prev.map(f => `${f.file.name}-${f.file.size}-${f.file.lastModified}`)
      );

      const unique: UploadedFile[] = [];

      for (const file of incoming) {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (!existingKeys.has(key)) {
          unique.push({
            file,
            id: crypto.randomUUID(),
            type: file.type.startsWith("video") ? "video" : "image",
          });
        }
      }

      if (unique.length !== incoming.length) {
        alert("Duplicate files were ignored.");
      }

      return [...prev, ...unique];
    });

    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const finalMomentType =
    formData.momentType === "other"
      ? formData.customMomentType
      : formData.momentType;

  /* =====================
     SUBMIT
     ===================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan || !finalMomentType) {
      alert("Please complete required fields");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          whatsapp: formData.whatsappNumber,
          momentType: finalMomentType,
          specialBecause: formData.specialBecause,
          plan: selectedPlan,
          fastTrack,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed");

      router.push(`/order/${data.accessToken}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="pt-24 pb-20 px-4 bg-soft-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-8"
        >
          <h1 className="text-3xl font-bold text-center">
            Create Your EverMoment
          </h1>

          {/* PLANS */}
          <div className="grid sm:grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`cursor-pointer rounded-xl border-2 p-4 transition
                  ${selectedPlan === plan.id
                    ? "border-gold bg-gold/5"
                    : "border-gray-200 hover:border-gold"}`}
              >
                <p className="font-semibold">{plan.name}</p>
                <p className="text-xl">₹{plan.price}</p>
                <p className="text-xs text-gray-500">{plan.duration}</p>
              </div>
            ))}
          </div>

          {/* FAST TRACK (REFERENCE IMPLEMENTATION) */}
          {selectedPlan === "story" && (
            <div
              className={`rounded-xl border border-gold/40 bg-gold/5 p-4 transition
                ${!FAST_TRACK_UI_ENABLED ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <label className="flex gap-3 items-start">
                <input
                  type="checkbox"
                  checked={fastTrack}
                  disabled={!FAST_TRACK_UI_ENABLED}
                  onChange={e => setFastTrack(e.target.checked)}
                  className="mt-1 accent-gold"
                />
                <div>
                  <p className="font-medium">⚡ Fast Track Delivery</p>
                  <p className="text-xs text-gray-600">
                    Add on +₹99 priority editing delivered within 12hr
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* MOMENT TYPE */}
          <select
            required
            className="w-full border-2 rounded-xl p-3"
            value={formData.momentType}
            onChange={e =>
              setFormData({
                ...formData,
                momentType: e.target.value,
                customMomentType: "",
              })
            }
          >
            <option value="">Choose moment type</option>
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="travel">Travel</option>
            <option value="family">Family</option>
            <option value="business">Business</option>
            <option value="other">Other</option>
          </select>

          {formData.momentType === "other" && (
            <input
              required
              className="w-full border-2 rounded-xl p-3"
              placeholder="Please specify your moment"
              value={formData.customMomentType}
              onChange={e =>
                setFormData({ ...formData, customMomentType: e.target.value })
              }
            />
          )}

          {/* UPLOAD BOX */}
          <div>
            <label className="block font-semibold mb-3">
              Upload your videos and photos
            </label>

            <div className="relative border-2 border-dashed rounded-xl p-8 text-center">
              <input
                type="file"
                multiple
                accept="video/*,image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <p className="font-medium">Click or drag files</p>
              <p className="text-sm text-gray-500">
                Duplicate files are ignored automatically
              </p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map(f => (
                  <div
                    key={f.id}
                    className="flex justify-between items-center border p-3 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium truncate">
                        {f.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(f.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STORY */}
          <textarea
            required
            className="w-full border-2 rounded-xl p-3"
            placeholder="Tell us about this moment"
            value={formData.specialBecause}
            onChange={e =>
              setFormData({ ...formData, specialBecause: e.target.value })
            }
          />

          {/* CONTACT */}
          <input
            required
            className="w-full border-2 rounded-xl p-3"
            placeholder="Mobile number"
            value={formData.whatsappNumber}
            onChange={e =>
              setFormData({
                ...formData,
                whatsappNumber: e.target.value.replace(/\D/g, ""),
              })
            }
          />

          <input
            required
            type="email"
            className="w-full border-2 rounded-xl p-3"
            placeholder="Email address"
            value={formData.email}
            onChange={e =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating…" : "Submit My Moment"}
          </Button>
        </form>
      </div>
    </div>
  );
}
