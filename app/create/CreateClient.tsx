// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Button from "@/components/Button";

// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

// const PLANS = [
//   {
//     id: "story",
//     name: "Story / Status",
//     price: 149,
//     duration: "Up to 1 minute",
//     description: "Perfect for short stories and status updates.",
//   },
//   {
//     id: "basic",
//     name: "Beautiful Moments",
//     price: 399,
//     duration: "Up to 3 minutes",
//     description: "Ideal for birthdays and beautiful celebrations.",
//   },
//   {
//     id: "premium",
//     name: "Premium Moments",
//     price: 799,
//     duration: "Up to 10 minutes",
//     description: "For full memories that deserve time and emotion.",
//   },
// ];

// type UploadedFile = {
//   file: File;
//   id: string;
//   type: "video" | "image";
// };

// export default function CreateClient() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const planFromUrl = searchParams.get("plan");

//   const [selectedPlan, setSelectedPlan] = useState("");
//   const [fastTrack, setFastTrack] = useState(false);
//   const FAST_TRACK_UI_ENABLED = true;

//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const [submitting, setSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     momentType: "",
//     customMomentType: "",
//     specialBecause: "",
//     whatsappNumber: "",
//     email: "",
//   });

//   /* 🔒 Auto-select plan from URL */
//   useEffect(() => {
//     if (planFromUrl && PLANS.some(p => p.id === planFromUrl)) {
//       setSelectedPlan(planFromUrl);
//     }
//   }, [planFromUrl]);

//   /* 🔁 Reset fast-track when switching plans */
//   useEffect(() => {
//     if (selectedPlan !== "story") setFastTrack(false);
//   }, [selectedPlan]);

//   /* =====================
//      FILE HANDLING (NO DUPES)
//      ===================== */
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;

//     const incomingFiles = Array.from(e.target.files);

//     setUploadedFiles(prev => {
//       const existingKeys = new Set(
//         prev.map(f => `${f.file.name}-${f.file.size}-${f.file.lastModified}`)
//       );

//       const uniqueFiles: UploadedFile[] = [];

//       for (const file of incomingFiles) {
//         const key = `${file.name}-${file.size}-${file.lastModified}`;
//         if (!existingKeys.has(key)) {
//           uniqueFiles.push({
//             file,
//             id: crypto.randomUUID(),
//             type: file.type.startsWith("video") ? "video" : "image",
//           });
//         }
//       }

//       return [...prev, ...uniqueFiles];
//     });

//     e.target.value = "";
//   };

//   const removeFile = (id: string) => {
//     setUploadedFiles(prev => prev.filter(f => f.id !== id));
//   };

//   const finalMomentType =
//     formData.momentType === "other"
//       ? formData.customMomentType
//       : formData.momentType;

//   /* =====================
//      SUBMIT FLOW
//      ===================== */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!selectedPlan || !formData.momentType) return;

//     setSubmitting(true);

//     try {
//       const res = await fetch(`${API_BASE}/api/orders`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: formData.email,
//           whatsapp: formData.whatsappNumber,
//           momentType: finalMomentType,
//           specialBecause: formData.specialBecause,
//           plan: selectedPlan,
//           fastTrack,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);

//       const { accessToken, orderId } = data;

//       if (uploadedFiles.length) {
//         const uploaded = [];

//         for (const f of uploadedFiles) {
//           const presign = await fetch(`${API_BASE}/api/uploads/presign`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               orderId,
//               fileName: f.file.name,
//               fileType: f.file.type,
//             }),
//           });

//           const { uploadUrl, key } = await presign.json();

//           await fetch(uploadUrl, {
//             method: "PUT",
//             headers: { "Content-Type": f.file.type },
//             body: f.file,
//           });

//           uploaded.push({ key, type: f.type, originalName: f.file.name });
//         }

//         await fetch(`${API_BASE}/api/uploads/complete`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ orderId, files: uploaded }),
//         });
//       }

//       router.push(`/order/${accessToken}`);
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* =====================
//      UI (UNCHANGED)
//      ===================== */
// //   return (
// //     <div className="pt-24 pb-20 px-4 bg-soft-white min-h-screen">
// //       <div className="max-w-3xl mx-auto">
// //         <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-10">
// //           {/* UI CONTENT — unchanged */}
// //           <Button type="submit" size="lg" className="w-full" disabled={submitting}>
// //             {submitting ? "Creating…" : "Submit My Moment"}
// //           </Button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// return (
//   <div className="pt-24 pb-20 px-4 bg-soft-white min-h-screen">
//     <div className="max-w-3xl mx-auto">
//       <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-10">
//         {/* UI CONTENT — unchanged */}
//         <Button type="submit" size="lg" className="w-full" disabled={submitting}>
//           {submitting ? "Creating…" : "Submit My Moment"}
//         </Button>
//       </form>
//     </div>
//   </div>
// );

// }

"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/Button";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

const PLANS = [
  {
    id: "story",
    name: "Story / Status",
    price: 149,
    duration: "Up to 1 minute",
    description: "Perfect for short stories and status updates.",
  },
  {
    id: "basic",
    name: "Beautiful Moments",
    price: 399,
    duration: "Up to 3 minutes",
    description: "Ideal for birthdays and beautiful celebrations.",
  },
  {
    id: "premium",
    name: "Premium Moments",
    price: 799,
    duration: "Up to 10 minutes",
    description: "For full memories that deserve time and emotion.",
  },
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
  const FAST_TRACK_UI_ENABLED = true;

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    momentType: "",
    customMomentType: "",
    specialBecause: "",
    whatsappNumber: "",
    email: "",
  });

  /* Auto-select plan from URL */
  useEffect(() => {
    if (planFromUrl && PLANS.some(p => p.id === planFromUrl)) {
      setSelectedPlan(planFromUrl);
    }
  }, [planFromUrl]);

  /* Reset fast-track when switching plans */
  useEffect(() => {
    if (selectedPlan !== "story") setFastTrack(false);
  }, [selectedPlan]);

  /* File handling (no duplicates) */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const incomingFiles = Array.from(e.target.files);

    setUploadedFiles(prev => {
      const existingKeys = new Set(
        prev.map(f => `${f.file.name}-${f.file.size}-${f.file.lastModified}`)
      );

      const uniqueFiles: UploadedFile[] = [];

      for (const file of incomingFiles) {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (!existingKeys.has(key)) {
          uniqueFiles.push({
            file,
            id: crypto.randomUUID(),
            type: file.type.startsWith("video") ? "video" : "image",
          });
        }
      }

      return [...prev, ...uniqueFiles];
    });

    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const finalMomentType =
    formData.momentType === "other"
      ? formData.customMomentType
      : formData.momentType;

  /* Submit flow */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan || !formData.momentType) {
      alert("Please complete required fields.");
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
      if (!res.ok) throw new Error(data.error || "Order failed");

      const { accessToken, orderId } = data;

      if (uploadedFiles.length) {
        const uploaded = [];

        for (const f of uploadedFiles) {
          const presign = await fetch(`${API_BASE}/api/uploads/presign`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              fileName: f.file.name,
              fileType: f.file.type,
            }),
          });

          const { uploadUrl, key } = await presign.json();

          await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": f.file.type },
            body: f.file,
          });

          uploaded.push({ key, type: f.type, originalName: f.file.name });
        }

        await fetch(`${API_BASE}/api/uploads/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, files: uploaded }),
        });
      }

      router.push(`/order/${accessToken}`);
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal mb-4">
            Create Your EverMoment
          </h1>
          <p className="text-gray-600">
            Choose your plan, share your moment, and we’ll craft the memory.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-10"
        >
          {/* PLAN SELECTION */}
          <div>
            <label className="block font-semibold mb-4">Select your plan</label>
            <div className="grid sm:grid-cols-3 gap-4">
              {PLANS.map(plan => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition
                    ${
                      selectedPlan === plan.id
                        ? "border-gold bg-gold/5"
                        : "border-light-grey hover:border-gold"
                    }`}
                >
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold">₹{plan.price}</p>
                  <p className="text-xs text-gray-600">{plan.duration}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {plan.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAST TRACK */}
          {selectedPlan === "story" && (
            <div
              className={`rounded-xl border border-gold/40 bg-gold/5 p-4
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
                    Add on +₹99 priority editing, delivered within 12hr
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* MOMENT TYPE */}
          <select
            required
            value={formData.momentType}
            onChange={e =>
              setFormData({ ...formData, momentType: e.target.value })
            }
            className="w-full border-2 rounded-xl p-3"
          >
            <option value="" disabled>
              Choose moment type…
            </option>
            <option value="Story">Story</option>
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
              type="text"
              placeholder="Please specify your moment"
              value={formData.customMomentType}
              onChange={e =>
                setFormData({
                  ...formData,
                  customMomentType: e.target.value,
                })
              }
              className="w-full border-2 rounded-xl p-3"
            />
          )}

          {/* UPLOAD */}
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
                        {formatFileSize(f.file.size)}
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
            rows={4}
            placeholder="Mention details…"
            value={formData.specialBecause}
            onChange={e =>
              setFormData({ ...formData, specialBecause: e.target.value })
            }
            className="w-full border-2 rounded-xl p-3"
          />

          {/* CONTACT */}
          <input
            required
            type="tel"
            placeholder="Mobile number"
            value={formData.whatsappNumber}
            onChange={e =>
              setFormData({
                ...formData,
                whatsappNumber: e.target.value.replace(/\D/g, ""),
              })
            }
            pattern="[6-9][0-9]{9}"
            maxLength={10}
            className="w-full border-2 rounded-xl p-3"
          />

          <input
            required
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={e =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full border-2 rounded-xl p-3"
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Creating…" : "Submit My Moment"}
          </Button>
        </form>
      </div>
    </div>
  );
}
