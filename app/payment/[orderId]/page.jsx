// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { loadRazorpay } from "@/lib/razorpay";

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

// export default function PaymentPage() {
//   const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
//   if (!API_BASE) {
//     throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
//   }

//   const { orderId } = useParams();
//   const router = useRouter();

//   const [order, setOrder] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   /* =======================
//      FETCH ORDER ACCESS
//   ======================= */
//   useEffect(() => {
//     if (!orderId) return;

//     fetch(`${API_BASE}/api/orders/access/${orderId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data?.error) throw new Error(data.error);
//         setOrder(data);
//       })
//       .catch(() => {
//         setError("Invalid or expired payment link");
//       });
//   }, [orderId, API_BASE]);

//   /* =======================
//      HANDLE PAYMENT
//   ======================= */
//   const handlePayment = async () => {
//     if (loading) return;
//     setLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/api/payment/create-order`,
//   {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ orderId }),
//   }
// );

// if (!res.ok) {
//   throw new Error(`Failed to create payment order (${res.status})`);
// }

// const data = await res.json();


//       const Razorpay = await loadRazorpay();

//       const rzp = new Razorpay({
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
//         amount: data.amount * 100,
//         currency: "INR",
//         name: "EverMoment",
//         description: "Unlock your memory",
//         order_id: data.razorpayOrderId,

//         handler: async (response) => {
//           const verifyRes = await fetch(
//             `${API_BASE}/api/payment/verify`,
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 orderId,
//               }),
//             }
//           );

//           const verifyData = await verifyRes.json();

//           if (!verifyData.success) {
//             throw new Error("Payment verification failed");
//           }

//           setSuccess(true);
//           setTimeout(() => {
//             router.push(`/order/${orderId}`);
//           }, 2000);
//         },

//         modal: {
//           ondismiss: () => {
//             setLoading(false);
//             alert("Payment cancelled. Your order is still safe.");
//           },
//         },
//       });

//       rzp.open();
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       alert(err.message);
//     }
//   };

//   /* =======================
//      UI STATES
//   ======================= */
//   if (error) {
//     return (
//       <div style={page}>
//         <h2>{error}</h2>
//       </div>
//     );
//   }

//   if (success) {
//     return (
//       <div style={page}>
//         <h1>🎉 Payment Successful!</h1>
//         <p>Your EverMoment has been unlocked.</p>
//         <p>
//           📩 <b>Download link has been sent to your email</b>
//         </p>
//         <p style={{ opacity: 0.7 }}>Redirecting to your order…</p>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div style={page}>
//         <h2>Loading payment…</h2>
//       </div>
//     );
//   }

//   /* =======================
//      DERIVED STATUS
//   ======================= */
//   const derivedStatus =
//     order.delivery_unlocked
//       ? "delivered"
//       : order.payment_status === "paid"
//       ? "paid"
//       : order.status;

//   const currentIndex = STEPS.indexOf(derivedStatus);

//   console.log("PAYMENT BUTTON DEBUG:", {
//   status: order.status,
//   payment_status: order.payment_status,
// });


//   return (
//     <div style={page}>
//       <h1><strong>Unlock Your EverMoment</strong></h1>

//       {/* ORDER SUMMARY */}
//       <div style={summaryBox}>
//         <div style={summaryRow}>
//           <span><strong>Plan</strong></span>
//           {humanize(order.plan)}: ₹{order.base_amount}
//         </div>

//         <div style={summaryRow}>
//           <span><strong>Fast Track</strong></span>
//           {order.fastTrack ? "Yes ⚡" : "No"}
//         </div>

//         {order.fastTrack && order.fast_track_amount > 0 && (
//           <div style={summaryRowMuted}>
//             <span>Add-on Fast Track</span>
//             ₹{order.fast_track_amount}
//           </div>
//         )}

//         <div style={divider} />

//         <div style={summaryTotal}>
//           <span>Total Amount</span>
//           ₹{order.amount}
//         </div>
//       </div>

//       {/* TIMELINE */}
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

//       {/* PAY BUTTON */}
//       {/* {order.status === "ready_for_payment" && (
//         <button
//           style={btn}
//           onClick={handlePayment}
//           disabled={loading}
//         >
//           {loading ? "Processing…" : "Pay & Unlock"}
//         </button>
//       )} */}


//       <p style={{ fontSize: "12px", opacity: 0.6 }}>
//         Secure payment powered by Razorpay
//       </p>
//     </div>
//   );
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
//   gap: "24px",
//   padding: "16px",
// };

// const summaryBox = {
//   border: "1px solid #334155",
//   padding: "24px 28px",
//   borderRadius: "18px",
//   boxShadow: "0 30px 80px rgba(116,108,108,0.45)",
//   width: "100%",
//   maxWidth: "360px",
// };

// const summaryRow = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginBottom: 8,
// };

// const summaryRowMuted = {
//   ...summaryRow,
//   opacity: 0.75,
// };

// const summaryTotal = {
//   display: "flex",
//   justifyContent: "space-between",
//   fontSize: "18px",
//   fontWeight: 600,
// };

// const divider = {
//   height: 1,
//   background: "#334155",
//   margin: "12px 0",
// };

// const timeline = {
//   width: "100%",
//   maxWidth: "160px",
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

// const btn = {
//   marginTop: "12px",
//   padding: "12px 26px",
//   background: "#ffffff",
//   color: "#0f172a",
//   borderRadius: "8px",
//   fontWeight: "600",
//   cursor: "pointer",
//   border: "none",
// };

// /* =======================
//    HELPERS
// ======================= */
// function humanize(s) {
//   return typeof s === "string" ? s.replace(/_/g, " ") : "";
// }

// #--------------------------------------------------- pay button updated 17: 15 03-01-2026

"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadRazorpay } from "@/lib/razorpay";

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

export default function PaymentPage() {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
  }

  const params = useParams();
  const router = useRouter();

  const orderId = useMemo(() => {
    if (!params?.orderId) return null;
    return Array.isArray(params.orderId)
      ? params.orderId[0]
      : params.orderId;
  }, [params]);

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* =======================
     FETCH ORDER
  ======================= */
  useEffect(() => {
    if (!orderId) return;

    fetch(`${API_BASE}/api/orders/access/${orderId}`, {
      cache: "no-store",
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || data?.error) {
          throw new Error(data?.error || "Invalid payment link");
        }
        setOrder(data);
      })
      .catch(() => {
        setError("Invalid or expired payment link");
      });
  }, [orderId, API_BASE]);

  /* =======================
     NORMALIZED FLAGS (KEY FIX)
  ======================= */
  const paymentPaid = order
    ? order.payment_status === "paid" ||
      order.payment_status === 1 ||
      order.payment_status === true
    : false;

  const deliveryUnlocked = order
    ? order.delivery_unlocked === true ||
      order.delivery_unlocked === 1
    : false;

  /* =======================
     HANDLE PAYMENT
  ======================= */
  const handlePayment = async () => {
    if (loading || paymentPaid) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create payment order (${res.status})`);
      }

      const data = await res.json();

      const Razorpay = await loadRazorpay();

      const rzp = new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: data.amount * 100,
        currency: "INR",
        name: "EverMoment",
        description: "Unlock your memory",
        order_id: data.razorpayOrderId,

        handler: async (response) => {
          const verifyRes = await fetch(
            `${API_BASE}/api/payment/verify`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
              }),
            }
          );

          const verifyData = await verifyRes.json();

          if (!verifyData.success) {
            throw new Error("Payment verification failed");
          }

          setSuccess(true);
          setTimeout(() => {
            router.push(`/order/${orderId}`);
          }, 2000);
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            alert("Payment cancelled. Your order is still safe.");
          },
        },
      });

      rzp.open();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert(err.message || "Payment failed");
    }
  };

  /* =======================
     UI STATES
  ======================= */
  if (error) {
    return (
      <div style={page}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (success) {
    return (
      <div style={page}>
        <h1>🎉 Payment Successful!</h1>
        <p>Your EverMoment has been unlocked.</p>
        <p>
          📩 <b>Download link has been sent to your email</b>
        </p>
        <p style={{ opacity: 0.7 }}>Redirecting to your order…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={page}>
        <h2>Loading payment…</h2>
      </div>
    );
  }

  /* =======================
     DERIVED STATUS
  ======================= */
  const derivedStatus = deliveryUnlocked
    ? "delivered"
    : paymentPaid
    ? "paid"
    : order.status;

  const currentIndex = STEPS.indexOf(derivedStatus);

  /* =======================
     UI
  ======================= */
  return (
    <div style={page}>
      

      {derivedStatus === "ready_for_payment" && (
        <h1 style={{ fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 700, textAlign: "center" }}>
        Unlock Your EverMoment🔒
      </h1>
      )}

      {derivedStatus === "delivered" && (
        <h1 style={{ fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 700, textAlign: "center" }}>
        You've Successfully Unlocked EverMoment🔓
      </h1>
      )}

      {/* ORDER SUMMARY */}
      <div style={summaryBox}>
        <div style={summaryRow}>
          <span><strong>Plan</strong></span>
          <span>{humanize(order.plan)} — ₹{order.base_amount}</span>
        </div>

        <div style={summaryRow}>
          <span><strong>Fast Track</strong></span>
          <span>{order.fastTrack ? "Yes ⚡" : "No"}</span>
        </div>

        {/* {order.fastTrack && order.fast_track_amount > 0 && (
          <div style={summaryRowMuted}>
            <span>Add-on Fast Track</span>
            <span>₹{order.fast_track_amount}</span>
          </div>
        )} */}
        <div style={summaryRowMuted}>
  <span>Add-on Fast Track Charges</span>
  <span>
    ₹{order.fastTrack ? order.fast_track_amount : 0}
  </span>
</div>


    <div style={divider} />

        <div style={summaryTotal}>
          <span>Total Amount</span>
          <span>₹{order.amount}</span>
        </div>
      </div>

      {/* TIMELINE */}
      <div style={timeline}>
        {STEPS.map((step, idx) => {
          const completed = idx < currentIndex;
          const current = idx === currentIndex;

          return (
            <div key={step} style={stepRow}>
              <div
                style={{
                  ...dot,
                  background: completed || current ? "#22c55e" : "#334155",
                }}
              />
              <div
                style={{
                  ...line,
                  background: idx < currentIndex ? "#22c55e" : "#334155",
                }}
              />
              <span
                style={{
                  ...label,
                  opacity: completed || current ? 1 : 0.4,
                }}
              >
                {humanize(step)}
              </span>
            </div>
          );
        })}
      </div>

      {/* ✅ PAY BUTTON (FINAL FIX) */}
      {!paymentPaid && !deliveryUnlocked && (
        <button
          style={btn}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing…" : "Pay & Unlock Your Memory"}
        </button>
      )}

        {paymentPaid && (
          <div style={thankYouBox}>
      <p style={thankYouTitle}>
        ✅ Payment successfully completed
      </p>
      <p style={thankYouText}>
        Thank you for your trust.  
        We’re delivering your EverMoment.
      </p>
      </div>
      )}

      <p style={{ fontSize: "12px", opacity: 0.6 }}>
        Secure payment powered by Razorpay
      </p>
    </div>
  );
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
  gap: "24px",
  padding: "16px",
};

const summaryBox = {
  border: "1px solid #334155",
  padding: "24px 28px",
  borderRadius: "18px",
  boxShadow: "0 30px 80px rgba(116,108,108,0.45)",
  width: "100%",
  maxWidth: "360px",
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

const timeline = {
  width: "100%",
  maxWidth: "160px",
  
};

const stepRow = {
  display: "flex",
  alignItems: "center",
  position: "relative",
  height: "42px",
};

const dot = {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  zIndex: 2,
};

const line = {
  position: "absolute",
  left: "5px",
  top: "12px",
  width: "2px",
  height: "50px",
};

const label = {
  marginLeft: "16px",
  fontSize: "14px",
  textTransform: "capitalize",
};

const btn = {
  marginTop: "12px",
  padding: "12px 26px",
  background: "#ffffff",
  color: "#0f172a",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
  border: "none",
};


const thankYouBox = {
  marginTop: "1px",
  background: "rgba(189, 211, 197, 0.12)",
  border: "3px solid rgba(39, 218, 101, 0.8)",
  borderRadius: "14px",
  padding: "20px 22px",
  textAlign: "center",
  maxWidth: "420px",
  boxShadow: "0 0 0 6px rgba(10, 221, 88, 0.12)",

};

const thankYouTitle = {
  fontSize: "15px",
  fontWeight: 600,
  marginBottom: "6px",
  color: "#ecfdf5",
};

const thankYouText = {
  fontSize: "13px",
  opacity: 0.85,
  lineHeight: 1.5,
};


/* =======================
   HELPERS
======================= */
function humanize(s) {
  return typeof s === "string" ? s.replace(/_/g, " ") : "";
}
