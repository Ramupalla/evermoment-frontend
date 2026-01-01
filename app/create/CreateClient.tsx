"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/Button";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
}
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const incoming = Array.from(e.target.files);
    setUploadedFiles(prev => {
      const keys = new Set(prev.map(f => `${f.file.name}-${f.file.size}`));
      const unique: UploadedFile[] = [];

      for (const file of incoming) {
        const key = `${file.name}-${file.size}`;
        if (!keys.has(key)) {
          unique.push({
            file,
            id: crypto.randomUUID(),
            type: file.type.startsWith("video") ? "video" : "image",
          });
        }
      }
      return [...prev, ...unique];
    });

    e.target.value = "";
  };

  const finalMomentType =
    formData.momentType === "other"
      ? formData.customMomentType
      : formData.momentType;

  /* =====================
     SAFE SUBMIT FLOW
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

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok || !data?.accessToken || !data?.orderId) {
        throw new Error(data?.error || "Order creation failed");
      }

      const { orderId, accessToken } = data;

      /* Upload files */
      if (uploadedFiles.length) {
        const uploaded = [];

        for (const f of uploadedFiles) {
          const presignRes = await fetch(`${API_BASE}/api/uploads/presign`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              fileName: f.file.name,
              fileType: f.file.type,
            }),
          });

          const presignText = await presignRes.text();
          const presign = presignText ? JSON.parse(presignText) : null;

          if (!presign?.uploadUrl || !presign?.key) {
            throw new Error("Upload preparation failed");
          }

          await fetch(presign.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": f.file.type },
            body: f.file,
          });

          uploaded.push({
            key: presign.key,
            type: f.type,
            originalName: f.file.name,
          });
        }

        await fetch(`${API_BASE}/api/uploads/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, files: uploaded }),
        });
      }

      router.push(`/order/${accessToken}`);
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="pt-24 pb-20 px-4 bg-soft-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <h1 className="text-3xl font-bold text-center">Create Your EverMoment</h1>

          <div className="grid sm:grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`cursor-pointer border-2 rounded-xl p-4 ${
                  selectedPlan === plan.id ? "border-gold" : "border-gray-200"
                }`}
              >
                <p className="font-semibold">{plan.name}</p>
                <p className="text-xl">₹{plan.price}</p>
                <p className="text-xs text-gray-500">{plan.duration}</p>
              </div>
            ))}
          </div>

          <select
            required
            className="w-full border-2 rounded-xl p-3"
            value={formData.momentType}
            onChange={e => setFormData({ ...formData, momentType: e.target.value })}
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
              placeholder="Custom moment"
              value={formData.customMomentType}
              onChange={e =>
                setFormData({ ...formData, customMomentType: e.target.value })
              }
            />
          )}

          <input
            type="file"
            multiple
            accept="video/*,image/*"
            onChange={handleFileChange}
          />

          <textarea
            required
            className="w-full border-2 rounded-xl p-3"
            placeholder="Tell us about this moment"
            value={formData.specialBecause}
            onChange={e =>
              setFormData({ ...formData, specialBecause: e.target.value })
            }
          />

          <input
            required
            className="w-full border-2 rounded-xl p-3"
            placeholder="Mobile number"
            value={formData.whatsappNumber}
            onChange={e =>
              setFormData({ ...formData, whatsappNumber: e.target.value.replace(/\D/g, "") })
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
