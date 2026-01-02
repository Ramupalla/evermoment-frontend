// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// /**
//  * Real lifecycle steps
//  */
// const STEPS = [
//   "created",
//   "uploaded",
//   "ready_for_payment",
//   "paid",
//   "delivered",
// ];

// export default function OrderStatusPage() {
  
// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

// if (!API_BASE) {
//   throw new Error("NEXT_PUBLIC_BACKEND_URL missing");
// }

// useEffect(() => {
//   if (!token) return;

//   fetch(`${API_BASE}/api/orders/access/${token}`)
//     .then(async res => {
//       const json = await res.json();
//       if (!res.ok) throw new Error(json.error || "Fetch failed");
//       return json;
//     })
//     .then(setData)
//     .catch(() => setError("Unable to fetch order status"));
// }, [token]);

//   if (error) {
//     return (
//       <div style={page}>
//         <h2>{error}</h2>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div style={page}>
//         <h2>Loading your EverMoment…</h2>
//       </div>
//     );
//   }

//   /* 🔐 Derive visual status safely */
//   const derivedStatus =
//     data.delivery_unlocked
//       ? "delivered"
//       : data.payment_status === "paid"
//       ? "paid"
//       : data.status;

//   const currentIndex = STEPS.indexOf(derivedStatus);

// const uploadFiles = async () => {
//   if (!orderId || selectedFiles.length === 0) return;

//   setUploading(true);

//   try {
//     const uploaded = [];

//     for (const file of selectedFiles) {
//       // 1️⃣ Get presigned URL
//       const presignRes = await fetch('${API_BASE}/api/uploads/presign',
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             orderId, // UUID from DB
//             fileName: file.name,
//             fileType: file.type,
//           }),
//         }
//       );

//       const { uploadUrl, key } = await presignRes.json();

//       // 2️⃣ Upload to S3
//       await fetch(uploadUrl, {
//         method: "PUT",
//         headers: { "Content-Type": file.type },
//         body: file,
//       });

//       uploaded.push({
//         key,
//         type: file.type.startsWith("video") ? "video" : "image",
//         originalName: file.name,
//       });
//     }

//     // 3️⃣ Finalize upload
//     await fetch('${API_BASE}/api/uploads/complete', {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         orderId,
//         files: uploaded,
//       }),
//     });

//     alert("Upload completed successfully!");
//     window.location.reload();
//   } catch (err) {
//     alert("Upload failed. Please try again.");
//   } finally {
//     setUploading(false);
//   }
// };


//   return (
//     <div style={page}>
//       <h1><strong>Your EverMoment</strong></h1>

//       {/* 📦 ORDER SUMMARY */}
//       <div style={summaryBox}>
//         <p><strong>Plan:</strong> {data.plan}: ₹{data.base_amount} </p>

//         <p>
//           <strong>Fast Track:</strong>{" "}
//           {data.fastTrack ? "Yes ⚡" : "No"}
//         </p>

//         {/* {!data.fastTrack || (
//           <p style={{ opacity: 0.85 }}>
//             Add On Fast Track Charge: ₹{data.fast_track_amount}
//           </p>
//         )} */}

//          {data.fastTrack ? (
//             <p>
//               Add On Fast Track Charge: ₹{data.fast_track_amount}
//             </p>
//           ) : (
//             <p>
//               Add On Fast Track Charge: ₹{data.fast_track_amount}
//             </p>
//           )} 


//         <hr style={{ border: "none", borderTop: "1px solid #334155" }} />

//         <p style={{ fontSize: "15px" }}>
//           <strong>Total Amount:</strong> ₹{data.amount}
//         </p>
//       </div>

//       {/* <p style={statusText}>
//         <strong>Status:</strong> Order {humanize(derivedStatus)} Sucessfully!
//       </p> */}
//       <p style={{ ...statusText, ...animateIn }}>
//         <strong>Status:</strong> 🎉 Your order is {humanize(derivedStatus)} successfully!
//       </p>
//       {derivedStatus === "created" && (
//         <p className="text-sm text-white/80 mt-3 animate-fadeUp">
//           You will receive the order confirmation shortly.
//         </p>
//       )}



//       {/* 🧭 TIMELINE */}
//       <div style={timeline}>
//         {STEPS.map((step, idx) => {
//           const completed = idx < currentIndex;
//           const current = idx === currentIndex;

//           return (
//             <div key={step} style={stepRow}>
//               <div
//                 style={{
//                   ...dot,
//                   background: completed || current ? "#22c55e" : "#334155",
//                   boxShadow: current
//                     ? "0 0 0 6px rgba(34,197,94,0.2)"
//                     : "none",
//                 }}
//               />
//               <div
//                 style={{
//                   ...line,
//                   background: idx < currentIndex ? "#22c55e" : "#334155",
//                 }}
//               />
//               <span
//                 style={{
//                   ...label,
//                   opacity: completed || current ? 1 : 0.4,
//                   fontWeight: current ? "600" : "400",
//                 }}
//               >
//                 {humanize(step)}
//               </span>
//             </div>
//           );
//         })}
//       </div>


//       {/* 💳 PAY NOW */}
//       {data.status === "ready_for_payment" && (
//         <button
//           style={primaryBtn}
//           onClick={() => router.push(`/payment/${token}`)}
//         >
//           Pay & Unlock Your Video
//         </button>
//       )}

//       {/* ⏳ PAID BUT DELIVERY NOT READY */}
//       {data.payment_status === "paid" && !data.delivery_unlocked && (
//         <p style={infoText}>
//           ⏳ Payment received.<br />
//           Preparing your delivery…
//         </p>
//       )}

//       {/* 📩 BIG DELIVERY REMINDER */}
//       {data.delivery_unlocked && (
//         <div style={reminderBox}>
//           <h2 style={{ marginBottom: "6px" }}>🎉 Your EverMoment is Ready!</h2>
//           <p style={{ fontSize: "15px", lineHeight: 1.6 }}>
//             <strong>Download link has been sent to your</strong><br />
//             📧 <b>Email</b> 
//           </p>
//           <p style={{ fontSize: "13px", opacity: 0.8 }}>
//             You can download now or check your inbox anytime.
//           </p>
//         </div>
//       )}

//       {/* ⬇️ DOWNLOAD */}
//       {data.delivery_unlocked && (
//         <a
//           href={`${API_BASE}/api/orders/${token}/download`}
//           style={downloadBtn}
//         >
//           ⬇️ Download Your EverMoment
//         </a>
//       )}
//     </div>
//   );
// }

// /* ---------------- STYLES ---------------- */

// const page = {
//   minHeight: "100vh",
//   background: "#0f172a",
//   color: "#ffffff",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   flexDirection: "column",
//   gap: "18px",
//   padding: "20px",
// };

// const summaryBox = {
//   border: "1px solid #334155",
//   borderRadius: "12px",
//   padding: "30px 40px",
//   width: "100%",
//   maxWidth: "380px",
//   fontSize: "14px",
//   background: "#020617",
//   boxShadow: "0 30px 80px rgba(116, 108, 108, 0.45)",

// };

// const statusText = {
//   fontSize: "20px",
//   opacity: 0.9,
// };

// const animateIn = {
//   animation: 'fadeUp 0.6s ease-out both',
// };


// const infoText = {
//   marginTop: "12px",
//   textAlign: "center",
//   fontSize: "14px",
//   opacity: 0.9,
// };

// const timeline = {
//   width: "100%",
//   maxWidth: "160px",
//   marginTop: "10px",
// };

// const stepRow = {
//   display: "flex",
//   alignItems: "center",
//   position: "relative",
//   height: "42px",
// };

// const dot = {
//   width: "12px",
//   height: "12px",
//   borderRadius: "50%",
//   zIndex: 2,
// };

// const line = {
//   position: "absolute",
//   left: "5px",
//   top: "12px",
//   width: "2px",
//   height: "42px",
// };

// const label = {
//   marginLeft: "16px",
//   fontSize: "14px",
//   textTransform: "capitalize",
// };

// const primaryBtn = {
//   marginTop: "16px",
//   padding: "12px 22px",
//   background: "#ffffff",
//   color: "#0f172a",
//   borderRadius: "8px",
//   fontWeight: "600",
//   cursor: "pointer",
//   border: "none",
// };

// const downloadBtn = {
//   marginTop: "16px",
//   padding: "12px 22px",
//   background: "#22c55e",
//   color: "#022c22",
//   borderRadius: "8px",
//   fontWeight: "600",
//   textDecoration: "none",
// };

// const reminderBox = {
//   border: "1px solid #22c55e",
//   background: "rgba(34,197,94,0.08)",
//   borderRadius: "14px",
//   padding: "20px 22px",
//   textAlign: "center",
//   maxWidth: "420px",
//   boxShadow: "0 0 0 6px rgba(34,197,94,0.12)",
// };

// /* ---------------- HELPERS ---------------- */

// function humanize(s) {
//   if (typeof s !== "string") return "";
//   return s.replace(/_/g, " ");
// }

// ######################################################################## Above code worked well with minor issues 9:20AM 02-01-2026 

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// /* =======================
//    CONFIG (SAFE)
// ======================= */
// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// /* =======================
//    ORDER STEPS
// ======================= */
// const STEPS = [
//   "created",
//   "uploaded",
//   "ready_for_payment",
//   "paid",
//   "delivered",
// ];

// export default function OrderStatusPage() {
//   const params = useParams();
//   const router = useRouter();

//   // ✅ token resolved safely
//   const token = useMemo(() => {
//     if (!params || !params.token) return null;
//     return Array.isArray(params.token)
//       ? params.token[0]
//       : params.token;
//   }, [params]);

//   const [data, setData] = useState(null);
//   const [error, setError] = useState("");

//   /* =======================
//      ENV + TOKEN VALIDATION
//   ======================= */
//   useEffect(() => {
//     if (!API_BASE) {
//       setError("Configuration error. Please contact support.");
//       return;
//     }

//     if (!API_BASE.startsWith("http")) {
//       setError("Invalid backend configuration.");
//       return;
//     }

//     if (!token) return;

//     fetch(`${API_BASE}/api/orders/access/${token}`)
//       .then(async (res) => {
//         const json = await res.json();
//         if (!res.ok) {
//           throw new Error(json?.error || "Failed to fetch order");
//         }
//         return json;
//       })
//       .then(setData)
//       .catch(() => {
//         setError("Unable to fetch order status");
//       });
//   }, [token]);

//   /* =======================
//      STATES
//   ======================= */
//   if (error) {
//     return (
//       <div style={page}>
//         <h2>{error}</h2>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div style={page}>
//         <h2>Loading your EverMoment…</h2>
//       </div>
//     );
//   }

//   const derivedStatus =
//     data.delivery_unlocked
//       ? "delivered"
//       : data.payment_status === "paid"
//       ? "paid"
//       : data.status;

//   const currentIndex = STEPS.indexOf(derivedStatus);

//   /* =======================
//      UI
//   ======================= */
//   return (
//     <div style={page}>
//       <h1><strong>Your EverMoment</strong></h1>

//       <div style={summaryBox}>
//         <p><strong>Plan:</strong> {data.plan}</p>
//         <p><strong>Total Amount:</strong> ₹{data.amount}</p>
//       </div>

//       <p style={{ ...statusText, ...animateIn }}>
//         🎉 Your order is {humanize(derivedStatus)} successfully!
//       </p>

//       <div style={timeline}>
//         {STEPS.map((step, idx) => (
//           <div key={step} style={stepRow}>
//             <div
//               style={{
//                 ...dot,
//                 background: idx <= currentIndex ? "#22c55e" : "#334155",
//               }}
//             />
//             <span style={label}>{humanize(step)}</span>
//           </div>
//         ))}
//       </div>

//       {data.status === "ready_for_payment" && (
//         <button
//           style={primaryBtn}
//           onClick={() => router.push(`/payment/${token}`)}
//         >
//           Pay & Unlock Your Video
//         </button>
//       )}

//       {data.delivery_unlocked && (
//         <a
//           href={`${API_BASE}/api/orders/${token}/download`}
//           style={downloadBtn}
//         >
//           ⬇️ Download Your EverMoment
//         </a>
//       )}
//     </div>
//   );
// }

// /* =======================
//    HELPERS
// ======================= */
// function humanize(s) {
//   return typeof s === "string" ? s.replace(/_/g, " ") : "";
// }

// /* =======================
//    STYLES
// ======================= */
// const page = {
//   minHeight: "100vh",
//   background: "#0f172a",
//   color: "#fff",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: "16px",
//   padding: "20px",
// };

// const summaryBox = {
//   border: "1px solid #334155",
//   padding: "20px",
//   borderRadius: "12px",
// };

// const statusText = { fontSize: "18px" };
// const animateIn = { animation: "fadeUp 0.6s ease-out both" };
// const timeline = { display: "flex", flexDirection: "column", gap: "10px" };
// const stepRow = { display: "flex", alignItems: "center", gap: "10px" };
// const dot = { width: "10px", height: "10px", borderRadius: "50%" };
// const label = { textTransform: "capitalize" };
// const primaryBtn = {
//   padding: "12px 22px",
//   borderRadius: "8px",
//   cursor: "pointer",
// };
// const downloadBtn = {
//   padding: "12px 22px",
//   borderRadius: "8px",
//   background: "#22c55e",
//   textDecoration: "none",
// };


// ######################################################################## Above code worked well with minor issues 11:48AM 02-01-2026 


// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// /* =======================
//    CONFIG
// ======================= */
// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
// if (!API_BASE) {
//   throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
// }

// /* =======================
//    ORDER STEPS
// ======================= */
// const STEPS = [
//   "created",
//   "uploaded",
//   "ready_for_payment",
//   "paid",
//   "delivered",
// ];

// export default function OrderStatusPage() {
//   const params = useParams();
//   const token = params?.token; // ✅ SAFE
//   const router = useRouter();

//   const [data, setData] = useState(null);
//   const [error, setError] = useState("");

//   /* =======================
//      FETCH ORDER
//   ======================= */
//   useEffect(() => {
//     if (!token) return;

//     fetch(`${API_BASE}/api/orders/access/${token}`)
//       .then(async (res) => {
//         const json = await res.json();
//         if (!res.ok) throw new Error(json.error || "Fetch failed");
//         return json;
//       })
//       .then(setData)
//       .catch(() => setError("Unable to fetch order status"));
//   }, [token]);

//   /* =======================
//      STATES
//   ======================= */
//   if (error) {
//     return <div style={page}><h2>{error}</h2></div>;
//   }

//   if (!data) {
//     return <div style={page}><h2>Loading your EverMoment…</h2></div>;
//   }

//   const derivedStatus =
//     data.delivery_unlocked
//       ? "delivered"
//       : data.payment_status === "paid"
//       ? "paid"
//       : data.status;

//   const currentIndex = STEPS.indexOf(derivedStatus);

//   /* =======================
//      UI
//   ======================= */
//   return (
//     <div style={page}>
// <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
//   Your EverMoment
// </h1>

//       <p style={statusText}>
//   <strong>
//     🎉 Your order is {humanize(derivedStatus)} successfully!
//   </strong>
// </p>

//       <div style={summaryBox}>
//         <p><strong>Plan:</strong> {data.plan}</p>
//         <p><strong>Total Amount:</strong> ₹{data.amount}</p>
//       </div>

//       {/* <p style={statusText}><strong>
//         🎉 Your order is {humanize(derivedStatus)} successfully! </strong>
//       </p> */}
      

// <p
//   style={{
//     marginTop: 6,
//     fontSize: 14,
//     opacity: 0.65,
//     animation: "softFadeUp 1.2s ease-out forwards",
//   }}
// >
//   You will receive email confirmation shortly…
// </p>

      
// <div style={timeline}>
//   {STEPS.map((step, idx) => {
//     const isActive = idx <= currentIndex;
//     const isLast = idx === STEPS.length - 1;

//     return (
//       <div key={step} style={stepRow}>
//         {/* Dot + Line */}
//         <div style={{ position: "relative" }}>
//           <div
//             style={{
//               ...dot,
//               background: isActive ? "#22c55e" : "#334155",
//             }}
//           />
//           {!isLast && (
//             <div
//               style={{
//                 ...line,
//                 ...(idx < currentIndex ? activeLine : {}),
//               }}
//             />
//           )}
//         </div>

//         {/* Label */}
//         <span
//           style={{
//             ...label,
//             opacity: isActive ? 1 : 0.6,
//             fontWeight: isActive ? 500 : 400,
//           }}
//         >
//           {humanize(step)}
//         </span>
//       </div>
//     );
//   })}
// </div>




//       {data.status === "ready_for_payment" && (
//         <button
//           style={primaryBtn}
//           onClick={() => router.push(`/payment/${token}`)}
//         >
//           Pay & Unlock Your Video
//         </button>
//       )}

//       {data.delivery_unlocked && (
//         <a
//           href={`${API_BASE}/api/orders/${token}/download`}
//           style={downloadBtn}
//         >
//           ⬇️ Download Your EverMoment
//         </a>
//       )}
//     </div>
//   );
// }

// /* =======================
//    HELPERS
// ======================= */
// function humanize(s) {
//   return typeof s === "string" ? s.replace(/_/g, " ") : "";
// }

// /* =======================
//    STYLES
// ======================= */

// const page = {
//   minHeight: "100vh",
//   background: "#0f172a",
//   color: "#fff",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: "clamp(20px, 4vw, 28px)", // responsive spacing
//   padding: "16px", // ✅ prevents edge cut on mobile
// };

// const summaryBox = {
//   border: "1px solid #334155",
//   padding: "clamp(20px, 5vw, 36px) clamp(18px, 6vw, 42px)", // responsive padding
//   borderRadius: "18px",
//   boxShadow: "0 30px 80px rgba(116, 108, 108, 0.45)",
//   width: "100%",               // ✅ mobile-friendly
//   maxWidth: "300px",           // desktop stays premium
//   textAlign: "center",
//   animation: "softScaleIn 0.5s ease-out",
// };

// const statusText = {
//   fontSize: "clamp(18px, 4.5vw, 22px)", // responsive headline
//   lineHeight: 1.3,
// };


// // Time Line

// const timeline = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "clamp(14px, 3vw, 20px)",
//   marginTop: "clamp(24px, 5vw, 32px)",
//   position: "relative",
// };

// const stepRow = {
//   display: "flex",
//   alignItems: "center",
//   gap: 16,
//   position: "relative",
// };

// const dot = {
//   width: 12,
//   height: 12,
//   borderRadius: "50%",
//   flexShrink: 0,
//   transition: "background 0.3s ease",
// };

// const line = {
//   position: "absolute",
//   left: 5,
//   top: 14,
//   bottom: "-60px", // ⬅ shorter line for mobile
//   width: 2,
//   background: "#334155",
// };

// const activeLine = {
//   background: "#22c55e",
// };

// const label = {
//   fontSize: "clamp(13px, 3.5vw, 14px)", // readable on mobile
//   color: "#e5e7eb",
// };

// // Buttons (touch-friendly on mobile)

// const primaryBtn = {
//   padding: "14px 24px", // ⬆ better touch area
//   borderRadius: "10px",
// };

// const downloadBtn = {
//   padding: "14px 24px",
//   borderRadius: "10px",
//   background: "#22c55e",
//   textDecoration: "none",
// };


// ######################################3# The above code worked perfect


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/* =======================
   CONFIG
======================= */
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
}

/* =======================
   ORDER STEPS
======================= */
const STEPS = [
  "created",
  "uploaded",
  "ready_for_payment",
  "paid",
  "delivered",
];

export default function OrderStatusPage() {
  const params = useParams();
  const token = params?.token;
  const router = useRouter();

const [data, setData] = useState(null);
  const [error, setError] = useState("");

  /* =======================
     FETCH ORDER
  ======================= */
  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/api/orders/access/${token}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Fetch failed");
        return json;
      })
      .then(setData)
      .catch(() => setError("Unable to fetch order status"));
  }, [token]);

  if (error) {
    return <div style={page}><h2>{error}</h2></div>;
  }

  if (!data) {
    return <div style={page}><h2>Loading your EverMoment…</h2></div>;
  }

  const derivedStatus =
    data.delivery_unlocked
      ? "delivered"
      : data.payment_status === "paid"
      ? "paid"
      : data.status;

  const currentIndex = STEPS.indexOf(derivedStatus);

  /* =======================
     UI
  ======================= */
  return (
    <div style={page}>
      <h1 style={{ fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 700 }}>
        Your EverMoment
      </h1>

      <p style={statusText}>
        <strong>
          🎉 Your order is {humanize(derivedStatus)} successfully!
        </strong>
      </p>

      {/* ✅ PREMIUM SUMMARY BOX */}
      <div style={summaryBox}>
        <div style={summaryRow}>
          <span><strong>Plan</strong></span>
          {humanize(data.plan)}: ₹{data.base_amount}
        </div>

        <div style={summaryRow}>
          <span><strong>Fast Track</strong></span>
          {data.fast_track ? "Yes ⚡" : "No"}
        </div>

        {data.fast_track && data.fast_track_amount > 0 && (
          <div style={summaryRowMuted}>
            <span>Add-on Fast Track</span>
            ₹{data.fast_track_amount}
          </div>
        )}
        

        <div style={divider} />

        <div style={summaryTotal}>
          <span>Total Amount</span>
          ₹{data.amount}
        </div>
      </div>

      <p
        style={{
          marginTop: 6,
          fontSize: 14,
          opacity: 0.65,
          animation: "softFadeUp 1.2s ease-out forwards",
        }}
      >
        You will receive email confirmation shortly…
      </p>

      {/* TIMELINE */}
      <div style={timeline}>
        {STEPS.map((step, idx) => {
          const isActive = idx <= currentIndex;
          const isLast = idx === STEPS.length - 1;

          return (
            <div key={step} style={stepRow}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    ...dot,
                    background: isActive ? "#22c55e" : "#334155",
                  }}
                />
                {!isLast && (
                  <div
                    style={{
                      ...line,
                      ...(idx < currentIndex ? activeLine : {}),
                    }}
                  />
                )}
              </div>

              <span
                style={{
                  ...label,
                  opacity: isActive ? 1 : 0.6,
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {humanize(step)}
              </span>
            </div>
          );
        })}
      </div>

      {data.status === "ready_for_payment" && (
        <button
          style={primaryBtn}
          onClick={() => router.push(`/payment/${token}`)}
        >
          Pay & Unlock Your Video
        </button>
      )}

      {data.delivery_unlocked && (
        <a
          href={`${API_BASE}/api/orders/${token}/download`}
          style={downloadBtn}
        >
          ⬇️ Download Your EverMoment
        </a>
      )}
    </div>
  );
}

/* =======================
   HELPERS
======================= */
function humanize(s) {
  return typeof s === "string" ? s.replace(/_/g, " ") : "";
}

/* =======================
   STYLES
======================= */

const page = {
  minHeight: "100vh",
  background: "#0f172a",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(20px, 4vw, 28px)",
  padding: "16px",
};

const summaryBox = {
  border: "1px solid #334155",
  padding: "24px 28px",
  borderRadius: "18px",
  boxShadow: "0 30px 80px rgba(116,108,108,0.45)",
  width: "100%",
  maxWidth: "360px",
  animation: "softScaleIn 0.5s ease-out",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 8,
};

const summaryRowMuted = {
  ...summaryRow,
  opacity: 0.75,
};

const summaryTotal = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "18px",
  fontWeight: 600,
};

const divider = {
  height: 1,
  background: "#334155",
  margin: "12px 0",
};

const statusText = {
  fontSize: "clamp(18px, 4.5vw, 22px)",
  lineHeight: 1.3,
};

/* Timeline */

const timeline = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  marginTop: 24,
};

const stepRow = {
  display: "flex",
  alignItems: "center",
  gap: 16,
};

const dot = {
  width: 12,
  height: 12,
  borderRadius: "50%",
};

const line = {
  position: "absolute",
  left: 5,
  top: 14,
  bottom: "-60px",
  width: 2,
  background: "#334155",
};

const activeLine = {
  background: "#22c55e",
};

const label = {
  fontSize: 14,
  color: "#e5e7eb",
};

/* Buttons */

const primaryBtn = {
  padding: "14px 24px",
  borderRadius: "10px",
};

const downloadBtn = {
  padding: "14px 24px",
  borderRadius: "10px",
  background: "#22c55e",
  textDecoration: "none",
};
