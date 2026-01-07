// // "use client";

// // import { useState, useEffect } from "react";
// // import { useSearchParams, useRouter } from "next/navigation";
// // import { saveFiles } from "@/app/fileStore";

// // import Button from "@/components/Button";



// // const FAST_TRACK_UI_ENABLED = true;

// // const PLANS = [
// //   { id: "story", name: "Story / Status", price: 149, duration: "Up to 1 minute" },
// //   { id: "basic", name: "Beautiful Moments", price: 399, duration: "Up to 3 minutes" },
// //   { id: "premium", name: "Premium Moments", price: 799, duration: "Up to 10 minutes" },
// // ];

// // type UploadedFile = {
// //   file: File;
// //   id: string;
// //   type: "video" | "image";
// // };

// // export default function CreateClient() {
// //   const searchParams = useSearchParams();
// //   const router = useRouter();
// //   const planFromUrl = searchParams.get("plan");

// //   const [selectedPlan, setSelectedPlan] = useState("");
// //   const [fastTrack, setFastTrack] = useState(false);
// //   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
// //   const [submitting, setSubmitting] = useState(false);

// //   const [formData, setFormData] = useState({
// //     momentType: "",
// //     customMomentType: "",
// //     specialBecause: "",
// //     whatsappNumber: "",
// //     email: "",
// //   });

// // const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

// // if (!API_BASE) {
// //   throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
// // }


// //   useEffect(() => {
// //     if (planFromUrl && PLANS.some(p => p.id === planFromUrl)) {
// //       setSelectedPlan(planFromUrl);
// //     }
// //   }, [planFromUrl]);

// //   useEffect(() => {
// //     if (selectedPlan !== "story") setFastTrack(false);
// //   }, [selectedPlan]);



// //  useEffect(() => {
// //   const handler = (e: BeforeUnloadEvent) => {
// //     e.preventDefault();
// //     e.returnValue = "";
// //   };

// //   if (submitting) {
// //     window.addEventListener("beforeunload", handler);
// //   }

// //   return () => {
// //     window.removeEventListener("beforeunload", handler);
// //   };
// // }, [submitting]);


// //   /* =====================
// //      FILE HANDLING (NO DUPES)
// //      ===================== */
// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (!e.target.files) return;

// //     const incoming = Array.from(e.target.files);

// //     setUploadedFiles(prev => {
// //       const existingKeys = new Set(
// //         prev.map(f => `${f.file.name}-${f.file.size}-${f.file.lastModified}`)
// //       );

// //       const unique: UploadedFile[] = [];

// //       for (const file of incoming) {
// //         const key = `${file.name}-${file.size}-${file.lastModified}`;
// //         if (!existingKeys.has(key)) {
// //           unique.push({
// //             file,
// //             id: crypto.randomUUID(),
// //             type: file.type.startsWith("video") ? "video" : "image",
// //           });
// //         }
// //       }

// //       if (unique.length !== incoming.length) {
// //         alert("Duplicate files were ignored.");
// //       }

// //       return [...prev, ...unique];
// //     });

// //     e.target.value = "";
// //   };

// //   const removeFile = (id: string) => {
// //     setUploadedFiles(prev => prev.filter(f => f.id !== id));
// //   };

// //   const finalMomentType =
// //     formData.momentType === "other"
// //       ? formData.customMomentType
// //       : formData.momentType;
// // #------------------------------------------------------------------------------

// //   const handleSubmit = async (e: React.FormEvent) => {
// //   e.preventDefault();

// //   if (!selectedPlan || !finalMomentType) {
// //     alert("Please complete required fields");
// //     return;
// //   }

// //   setSubmitting(true);

// //   try {
// //     // 1️⃣ Create order
// //     const res = await fetch(`${API_BASE}/api/orders`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         email: formData.email,
// //         whatsapp: formData.whatsappNumber,
// //         momentType: finalMomentType,
// //         specialBecause: formData.specialBecause,
// //         plan: selectedPlan,
// //         fastTrack,
// //       }),
// //     });

// //     // const data = await res.json();

// //     if (!res.ok) {
// //   throw new Error(`Payment API failed (${res.status})`);
// // }

// // const data = await res.json();

// //     if (!res.ok) throw new Error(data.error || "Order creation failed");

// //     const { orderId, accessToken } = data;

// //     // 2️⃣ Upload files to S3 (ONLY if files exist)
// //     if (uploadedFiles.length > 0) {
// //       const uploaded = [];

// //       for (const f of uploadedFiles) {
// //         // Get presigned URL
// //         const presignRes = await fetch(`${API_BASE}/api/uploads/presign`, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             orderId,
// //             fileName: f.file.name,
// //             fileType: f.file.type,
// //           }),
// //         });

// //         const presign = await presignRes.json();
// //         if (!presign.uploadUrl || !presign.key) {
// //           throw new Error("Failed to prepare upload");
// //         }

// //         // Upload to S3
// //         await fetch(presign.uploadUrl, {
// //           method: "PUT",
// //           headers: { "Content-Type": f.file.type },
// //           body: f.file,
// //         });

// //         uploaded.push({
// //           key: presign.key,
// //           type: f.type,
// //           originalName: f.file.name,
// //         });
// //       }

// //       // Finalize upload
// //       await fetch(`${API_BASE}/api/uploads/complete`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           orderId,
// //           files: uploaded,
// //         }),
// //       });
// //     }

// //     // 3️⃣ Redirect AFTER everything succeeds
// //     router.push(`/order/${accessToken}`);
// //   } catch (err: any) {
// //     alert(err.message);
// //   } finally {
// //     setSubmitting(false);
// //   }
// // };


// // const handleSubmit = async (e: React.FormEvent) => {
// //   e.preventDefault();

// //   if (!selectedPlan || !finalMomentType) {
// //     alert("Please complete required fields");
// //     return;
// //   }

// //   setSubmitting(true);

// //   try {
// //     // 1️⃣ CREATE ORDER (FAST)
// //     const res = await fetch(`${API_BASE}/api/orders`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         email: formData.email,
// //         whatsapp: formData.whatsappNumber,
// //         momentType: finalMomentType,
// //         specialBecause: formData.specialBecause,
// //         plan: selectedPlan,
// //         fastTrack,
// //       }),
// //     });

// //     if (!res.ok) {
// //       const err = await res.json().catch(() => ({}));
// //       throw new Error(err.error || "Order creation failed");
// //     }

// //     const data = await res.json();
// //     const { orderId, accessToken } = data;

// //     // 2️⃣ STORE FILE METADATA (SAFE)
// //     if (uploadedFiles.length > 0) {
// //       sessionStorage.setItem(
// //         `pendingUploads:${accessToken}`,
// //         JSON.stringify(
// //           uploadedFiles.map(f => ({
// //             name: f.file.name,
// //             size: f.file.size,
// //             type: f.file.type,
// //             lastModified: f.file.lastModified,
// //           }))
// //         )
// //       )}

// // // 2️⃣ SAVE FILES TO INDEXED DB (SAFE ACROSS ROUTES)
// // if (uploadedFiles.length > 0) {
// //   await saveFiles(
// //     accessToken,
// //     uploadedFiles.map(f => f.file)
// //   );
// // }

// //     }

// //     // 3️⃣ INSTANT REDIRECT (NO WAIT)
// //     router.push(`/order/${accessToken}`);

// //   } catch (err: any) {
// //     alert(err.message || "Something went wrong");
// //   } finally {
// //     setSubmitting(false);
// //   }
// // };

// //   /* ================= UI ================= */

// //   return (
// //     <div className="pt-24 pb-20 px-4 bg-soft-white min-h-screen">
// //       <div className="max-w-3xl mx-auto">
// //         <form
// //           onSubmit={handleSubmit}
// //           className="bg-white rounded-2xl shadow-xl p-8 space-y-8"
// //         >
// //           <h1 className="text-3xl font-bold text-center">
// //             Create Your EverMoment
// //           </h1>

// //           {/* PLANS */}
// //           <div className="grid sm:grid-cols-3 gap-4">
// //             {PLANS.map(plan => (
// //               <div
// //                 key={plan.id}
// //                 onClick={() => setSelectedPlan(plan.id)}
// //                 className={`cursor-pointer rounded-xl border-2 p-4 transition
// //                   ${selectedPlan === plan.id
// //                     ? "border-gold bg-gold/5"
// //                     : "border-gray-200 hover:border-gold"}`}
// //               >
// //                 <p className="font-semibold">{plan.name}</p>
// //                 <p className="text-xl">₹{plan.price}</p>
// //                 <p className="text-xs text-gray-500">{plan.duration}</p>
// //               </div>
// //             ))}
// //           </div>
   
// //           {/* FAST TRACK (REFERENCE IMPLEMENTATION) */}
// //           {selectedPlan === "story" && (
// //             <div
// //               className={`rounded-xl border border-gold/40 bg-gold/5 p-4 transition
// //                 ${!FAST_TRACK_UI_ENABLED ? "opacity-40 cursor-not-allowed" : ""}`}
// //             >
// //               <label className="flex gap-3 items-start">
// //                 <input
// //                   type="checkbox"
// //                   checked={fastTrack}
// //                   disabled={!FAST_TRACK_UI_ENABLED}
// //                   onChange={e => setFastTrack(e.target.checked)}
// //                   className="mt-1 accent-gold"
// //                 />
// //                 <div>
// //                   <p className="font-medium">⚡ Fast Track Delivery</p>
// //                   <p className="text-xs text-gray-600">
// //                     Add on +₹99 priority editing delivered within 12hr
// //                   </p>
// //                 </div>
// //               </label>
// //             </div>
// //           )}

// //           {/* MOMENT TYPE */}
// //           <select
// //             required
// //             className="w-full border-2 rounded-xl p-3"
// //             value={formData.momentType}
// //             onChange={e =>
// //               setFormData({
// //                 ...formData,
// //                 momentType: e.target.value,
// //                 customMomentType: "",
// //               })
// //             }
// //           >
// //             <option value="">Choose moment type</option>
// //             <option value="birthday">Birthday</option>
// //             <option value="anniversary">Anniversary</option>
// //             <option value="travel">Travel</option>
// //             <option value="family">Family</option>
// //             <option value="business">Business</option>
// //             <option value="other">Other</option>
// //           </select>

// //           {formData.momentType === "other" && (
// //             <input
// //               required
// //               className="w-full border-2 rounded-xl p-3"
// //               placeholder="Please specify your moment"
// //               value={formData.customMomentType}
// //               onChange={e =>
// //                 setFormData({ ...formData, customMomentType: e.target.value })
// //               }
// //             />
// //           )}

// //           {/* UPLOAD BOX */}
// //           <div>
// //             <label className="block font-semibold mb-3">
// //               Upload your videos and photos
// //             </label>

// //             <div className="relative border-2 border-dashed rounded-xl p-8 text-center">
// //               <input
// //                 type="file"
// //                 multiple
// //                 accept="video/*,image/*"
// //                 onChange={handleFileChange}
// //                 className="absolute inset-0 opacity-0 cursor-pointer"
// //               />
// //               <p className="font-medium">Click or drag files</p>
// //               <p className="text-sm text-gray-500">
// //                 Duplicate files are ignored automatically
// //               </p>
// //             </div>

// //             {uploadedFiles.length > 0 && (
// //               <div className="mt-4 space-y-2">
// //                 {uploadedFiles.map(f => (
// //                   <div
// //                     key={f.id}
// //                     className="flex justify-between items-center border p-3 rounded-lg"
// //                   >
// //                     <div>
// //                       <p className="text-sm font-medium truncate">
// //                         {f.file.name}
// //                       </p>
// //                       <p className="text-xs text-gray-500">
// //                         {(f.file.size / 1024 / 1024).toFixed(2)} MB
// //                       </p>
// //                     </div>
// //                     <button
// //                       type="button"
// //                       onClick={() => removeFile(f.id)}
// //                       className="text-red-500"
// //                     >
// //                       ✕
// //                     </button>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* STORY */}
// //           <textarea
// //             required
// //             className="w-full border-2 rounded-xl p-3"
// //             placeholder="Anything specific you want us to keep in mind? 🎵 Music preference
// // 🎭 Mood
// // ⏱ Pace"
// //             value={formData.specialBecause}
// //             onChange={e =>
// //               setFormData({ ...formData, specialBecause: e.target.value })
// //             }
// //           />

// //           {/* CONTACT */}
// //           {/* <input
// //             required
// //             className="w-full border-2 rounded-xl p-3"
// //             placeholder="Mobile number"
// //             value={formData.whatsappNumber}
// //             onChange={e =>
// //               setFormData({
// //                 ...formData,
// //                 whatsappNumber: e.target.value.replace(/\D/g, ""),
// //               })
// //             }
// //           /> */}

// // <input
// //   required
// //   type="tel"
// //   inputMode="numeric"
// //   pattern="[6-9][0-9]{9}"
// //   maxLength={10}
// //   className="w-full border-2 rounded-xl p-3"
// //   placeholder="Mobile number (10 digits)"
// //   value={formData.whatsappNumber}
// //   onChange={(e) => {
// //     const value = e.target.value.replace(/\D/g, "");
// //     setFormData({
// //       ...formData,
// //       whatsappNumber: value.slice(0, 10),
// //     });
// //   }}
// // />

// //           <input
// //             required
// //             type="email"
// //             className="w-full border-2 rounded-xl p-3"
// //             placeholder="Email address"
// //             value={formData.email}
// //             onChange={e =>
// //               setFormData({ ...formData, email: e.target.value })
// //             }
// //           />

// // <Button type="submit" className="w-full" disabled={submitting}>
// //   <span className="flex items-center justify-center gap-2">
// //     {submitting && (
// //       <span
// //         className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"
// //         aria-hidden="true"
// //       />
// //     )}
// //       {submitting ? "Creating your order… Uploading files securely" : "Submit My Moment"}
// //       </span>
// // </Button>

// //       {submitting && (
// //   <p style={{fontSize: "14px", opacity: 0.7, marginTop: "6px", textAlign: "center" }}>
// //     Please don’t refresh or close this page.
// //   </p>
  
// // )} 


// // {/* <Button type="submit" className="w-full" disabled={submitting}>
// //     <span className="flex items-center justify-center gap-2">
// //       {submitting && (
// //         <span
// //           className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"
// //           aria-hidden="true"
// //         />
// //       )}
// //       {submitting
// //         ? "Creating your order… Uploading files securely"
// //         : "Submit My Moment"}
// //     </span>
// //   </Button>

// //   {submitting && (
// //     <p className="mt-2 text-center text-sm text-white/80 font-medium">
// //       Please don’t refresh or close this page.
// //     </p>
// //   )} 
   
// // */}

// //         </form>
// //       </div>
// //     </div>
// //   );

// // }


// // The above code has perfect UI, this below code didn't have the all feilds properly, make appropriate chnages in the below code and generate the final production ready code.
// // #------------------------------------------------

// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { saveFiles } from "@/app/fileStore";
// import Button from "@/components/Button";

// const FAST_TRACK_UI_ENABLED = true;

// const PLANS = [
//   { id: "story", name: "Story / Status", price: 149, duration: "Up to 1 minute" },
//   { id: "basic", name: "Beautiful Moments", price: 399, duration: "Up to 3 minutes" },
//   { id: "premium", name: "Premium Moments", price: 799, duration: "Up to 10 minutes" },
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
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const [submitting, setSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     momentType: "",
//     customMomentType: "",
//     specialBecause: "",
//     whatsappNumber: "",
//     email: "",
//   });

//   const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
//   if (!API_BASE) {
//     throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
//   }

//   /* =====================
//      INIT
//   ===================== */
//   useEffect(() => {
//     if (planFromUrl && PLANS.some(p => p.id === planFromUrl)) {
//       setSelectedPlan(planFromUrl);
//     }
//   }, [planFromUrl]);

//   useEffect(() => {
//     if (selectedPlan !== "story") setFastTrack(false);
//   }, [selectedPlan]);

//   useEffect(() => {
//     const handler = (e: BeforeUnloadEvent) => {
//       e.preventDefault();
//       e.returnValue = "";
//     };

//     if (submitting) {
//       window.addEventListener("beforeunload", handler);
//     }

//     return () => {
//       window.removeEventListener("beforeunload", handler);
//     };
//   }, [submitting]);

//   /* =====================
//      FILE HANDLING (NO DUPES)
//   ===================== */
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;

//     const incoming = Array.from(e.target.files);

//     setUploadedFiles(prev => {
//       const existingKeys = new Set(
//         prev.map(f => `${f.file.name}-${f.file.size}-${f.file.lastModified}`)
//       );

//       const unique: UploadedFile[] = [];

//       for (const file of incoming) {
//         const key = `${file.name}-${file.size}-${file.lastModified}`;
//         if (!existingKeys.has(key)) {
//           unique.push({
//             file,
//             id: crypto.randomUUID(),
//             type: file.type.startsWith("video") ? "video" : "image",
//           });
//         }
//       }

//       if (unique.length !== incoming.length) {
//         alert("Duplicate files were ignored.");
//       }

//       return [...prev, ...unique];
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
//      SUBMIT (FAST + SAFE)
//   ===================== */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!selectedPlan || !finalMomentType) {
//       alert("Please complete required fields");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       // 1️⃣ Create order
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

//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.error || "Order creation failed");
//       }

//       const { accessToken } = await res.json();

//       // 2️⃣ Save files to IndexedDB
//       if (uploadedFiles.length > 0) {
//         await saveFiles(
//           accessToken,
//           uploadedFiles.map(f => f.file)
//         );
//       }

//       // 3️⃣ Redirect immediately
//       router.push(`/order/${accessToken}`);
//     } catch (err: any) {
//       alert(err.message || "Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="pt-24 pb-20 px-4 bg-soft-white min-h-screen">
//       <div className="max-w-3xl mx-auto">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white rounded-2xl shadow-xl p-8 space-y-8"
//         >
//           <h1 className="text-3xl font-bold text-center">
//             Create Your EverMoment
//           </h1>

//           {/* PLANS */}
//           <div className="grid sm:grid-cols-3 gap-4">
//             {PLANS.map(plan => (
//               <div
//                 key={plan.id}
//                 onClick={() => setSelectedPlan(plan.id)}
//                 className={`cursor-pointer rounded-xl border-2 p-4 transition
//                   ${selectedPlan === plan.id
//                     ? "border-gold bg-gold/5"
//                     : "border-gray-200 hover:border-gold"}`}
//               >
//                 <p className="font-semibold">{plan.name}</p>
//                 <p className="text-xl">₹{plan.price}</p>
//                 <p className="text-xs text-gray-500">{plan.duration}</p>
//               </div>
//             ))}
//           </div>

//           {/* FAST TRACK */}
//           {selectedPlan === "story" && (
//             <div className="rounded-xl border border-gold/40 bg-gold/5 p-4">
//               <label className="flex gap-3 items-start">
//                 <input
//                   type="checkbox"
//                   checked={fastTrack}
//                   disabled={!FAST_TRACK_UI_ENABLED}
//                   onChange={e => setFastTrack(e.target.checked)}
//                   className="mt-1 accent-gold"
//                 />
//                 <div>
//                   <p className="font-medium">⚡ Fast Track Delivery</p>
//                   <p className="text-xs text-gray-600">
//                     Add on +₹99 priority editing delivered within 12hr
//                   </p>
//                 </div>
//               </label>
//             </div>
//           )}

//           {/* MOMENT TYPE */}
//           <select
//             required
//             className="w-full border-2 rounded-xl p-3"
//             value={formData.momentType}
//             onChange={e =>
//               setFormData({
//                 ...formData,
//                 momentType: e.target.value,
//                 customMomentType: "",
//               })
//             }
//           >
//             <option value="">Choose moment type</option>
//             <option value="birthday">Birthday</option>
//             <option value="anniversary">Anniversary</option>
//             <option value="travel">Travel</option>
//             <option value="family">Family</option>
//             <option value="business">Business</option>
//             <option value="other">Other</option>
//           </select>

//           {formData.momentType === "other" && (
//             <input
//               required
//               className="w-full border-2 rounded-xl p-3"
//               placeholder="Please specify your moment"
//               value={formData.customMomentType}
//               onChange={e =>
//                 setFormData({ ...formData, customMomentType: e.target.value })
//               }
//             />
//           )}

//           {/* UPLOAD */}
//           <div>
//             <label className="block font-semibold mb-3">
//               Upload your videos and photos
//             </label>

//             <div className="relative border-2 border-dashed rounded-xl p-8 text-center">
//               <input
//                 type="file"
//                 multiple
//                 accept="video/*,image/*"
//                 onChange={handleFileChange}
//                 className="absolute inset-0 opacity-0 cursor-pointer"
//               />
//               <p className="font-medium">Click or drag files</p>
//               <p className="text-sm text-gray-500">
//                 Duplicate files are ignored automatically
//               </p>
//             </div>

//             {uploadedFiles.length > 0 && (
//               <div className="mt-4 space-y-2">
//                 {uploadedFiles.map(f => (
//                   <div
//                     key={f.id}
//                     className="flex justify-between items-center border p-3 rounded-lg"
//                   >
//                     <div>
//                       <p className="text-sm font-medium truncate">
//                         {f.file.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {(f.file.size / 1024 / 1024).toFixed(2)} MB
//                       </p>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeFile(f.id)}
//                       className="text-red-500"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* STORY */}
//           <textarea
//             required
//             className="w-full border-2 rounded-xl p-3"
//             placeholder="Anything specific you want us to keep in mind? 🎵 Music preference
// 🎭 Mood
// ⏱ Pace"
//             value={formData.specialBecause}
//             onChange={e =>
//               setFormData({ ...formData, specialBecause: e.target.value })
//             }
//           />

//           {/* CONTACT */}
//           <input
//             required
//             type="tel"
//             inputMode="numeric"
//             pattern="[6-9][0-9]{9}"
//             maxLength={10}
//             className="w-full border-2 rounded-xl p-3"
//             placeholder="Mobile number (10 digits)"
//             value={formData.whatsappNumber}
//             onChange={e => {
//               const value = e.target.value.replace(/\D/g, "");
//               setFormData({
//                 ...formData,
//                 whatsappNumber: value.slice(0, 10),
//               });
//             }}
//           />

//           <input
//             required
//             type="email"
//             className="w-full border-2 rounded-xl p-3"
//             placeholder="Email address"
//             value={formData.email}
//             onChange={e =>
//               setFormData({ ...formData, email: e.target.value })
//             }
//           />

//           <Button type="submit" className="w-full" disabled={submitting}>
//             <span className="flex items-center justify-center gap-2">
//               {submitting && (
//                 <span
//                   className=" h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"
//                   aria-hidden="true"
//                 />
//               )}
//               {submitting
//                 ? "Creating your order… Uploading files securely"
//                 : "Submit My Moment"}
//             </span>
//           </Button>

//           {/* {submitting && (
//             <p className="text-center text-sm opacity-70">
//               Please don’t refresh or close this page.
//             </p>
//           )} */}
//         </form>
//       </div>
//     </div>
//   );
// }


// #------------------------------------------
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { saveFiles } from "@/app/fileStore";
import Button from "@/components/Button";

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

type Errors = {
  plan?: string;
  momentType?: string;
  customMomentType?: string;
  files?: string;
  specialBecause?: string;
  whatsappNumber?: string;
  email?: string;
};

export default function CreateClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planFromUrl = searchParams.get("plan");

  const [selectedPlan, setSelectedPlan] = useState("");
  const [fastTrack, setFastTrack] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [formData, setFormData] = useState({
    momentType: "",
    customMomentType: "",
    specialBecause: "",
    whatsappNumber: "",
    email: "",
  });

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!API_BASE) throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");

  /* =====================
     INIT
  ===================== */
  useEffect(() => {
    if (planFromUrl && PLANS.some(p => p.id === planFromUrl)) {
      setSelectedPlan(planFromUrl);
    }
  }, [planFromUrl]);

  useEffect(() => {
    if (selectedPlan !== "story") setFastTrack(false);
  }, [selectedPlan]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    if (submitting) window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [submitting]);

  /* =====================
     FILE HANDLING (NO DUPES + PREVIEW)
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

  /* =====================
     VALIDATION
  ===================== */
  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!selectedPlan) newErrors.plan = "Please select a plan";
    if (!formData.momentType) newErrors.momentType = "Please choose a moment type";

    if (formData.momentType === "other" && !formData.customMomentType.trim()) {
      newErrors.customMomentType = "Please specify your moment";
    }

    if (uploadedFiles.length === 0) {
      newErrors.files = "Please upload at least one photo or video";
    }

    if (!formData.specialBecause.trim()) {
      newErrors.specialBecause = "Please tell us about your moment";
    }

    if (!/^[6-9][0-9]{9}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = "Enter a valid 10-digit mobile number";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          whatsapp: formData.whatsappNumber,
          momentType:
            formData.momentType === "other"
              ? formData.customMomentType
              : formData.momentType,
          specialBecause: formData.specialBecause,
          plan: selectedPlan,
          fastTrack,
        }),
      });

      if (!res.ok) throw new Error("Order creation failed");

      const { accessToken } = await res.json();

      if (uploadedFiles.length > 0) {
        await saveFiles(accessToken, uploadedFiles.map(f => f.file));
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
          {errors.plan && <p className="text-sm text-red-500">{errors.plan}</p>}

          {/* FAST TRACK */}
          {selectedPlan === "story" && (
            <div className="rounded-xl border border-gold/40 bg-gold/5 p-4">
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
              setFormData({ ...formData, momentType: e.target.value, customMomentType: "" })
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
          {errors.momentType && <p className="text-sm text-red-500">{errors.momentType}</p>}

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
                      <p className="text-sm font-medium truncate">{f.file.name}</p>
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
            {errors.files && <p className="text-sm text-red-500">{errors.files}</p>}
          </div>

          {/* STORY */}
          <textarea
            required
            className="w-full border-2 rounded-xl p-3"
            placeholder={`Anything specific you want us to keep in mind?
🎵 Music preference
🎭 Mood
⏱ Pace`}
            value={formData.specialBecause}
            onChange={e =>
              setFormData({ ...formData, specialBecause: e.target.value })
            }
          />
          {errors.specialBecause && (
            <p className="text-sm text-red-500">{errors.specialBecause}</p>
          )}

          {/* CONTACT */}
          <input
            required
            type="tel"
            inputMode="numeric"
            pattern="[6-9][0-9]{9}"
            maxLength={10}
            className="w-full border-2 rounded-xl p-3"
            placeholder="Mobile number (10 digits)"
            value={formData.whatsappNumber}
            onChange={e =>
              setFormData({
                ...formData,
                whatsappNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
              })
            }
          />
          {errors.whatsappNumber && (
            <p className="text-sm text-red-500">{errors.whatsappNumber}</p>
          )}

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
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

          {/* PRE-SUBMIT INFO */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            <p className="font-medium">You’re about to place a real EverMoment order</p>
            <p className="mt-1">
              Clicking <strong>“Submit My Moment”</strong> will create your order
              and securely upload your files.
            </p>
            <p className="mt-1">
              💳 <strong>No payment is required right now.</strong> You’ll be asked
              to pay only after we prepare your video.
            </p>
          </div>

          {/* SUBMIT BUTTON — SAME UI */}
          <Button type="submit" className="w-full" disabled={submitting}>
            <span className="flex items-center justify-center gap-2">
              {submitting && (
                <span
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
              )}
              {submitting
                ? "Creating your order… Uploading files securely"
                : "Submit My Moment"}
            </span>
          </Button>

          <p className="mt-2 text-center text-xs text-gray-500">
            Your files are encrypted and handled only for creating your EverMoment.
          </p>
        </form>
      </div>
    </div>
  );
}
