"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadRazorpay } from "@/lib/razorpay";

/**
 * Order lifecycle steps
 */
const STEPS = [
  "created",
  "uploaded",
  "ready_for_payment",
  "paid",
  "delivered",
];

export default function PaymentPage() {

  const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://evermoment-frontend-1.onrender.com";

  const { orderId } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);



  useEffect(() => {
    if (!orderId) return;

    fetch(`${API_BASE}/api/orders/access/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setOrder(data);
      })
      .catch(() => setError("Invalid or expired payment link"));
  }, [orderId]);

  // const handlePayment = async () => {
  //   setLoading(true);

  //   const res = await fetch(
  //     "${API_BASE}/api/payments/create-order",
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ orderId }),
  //     }
  //   );

  //   const data = await res.json();
  //   const Razorpay = await loadRazorpay();

  //   const rzp = new Razorpay({
  //     key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
  //     amount: data.amount,
  //     currency: "INR",
  //     name: "EverMoment",
  //     description: "Unlock your memory",
  //     order_id: data.razorpayOrderId,

  //     handler: async (response) => {
  //       await fetch("${API_BASE}/api/payments/verify", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           ...response,
  //           orderId,
  //         }),
  //       });

  //       setSuccess(true);

  //       setTimeout(() => {
  //         router.push(`/order/${orderId}`);
  //       }, 4000);
  //     },
  //   });

  //   rzp.open();
  //   setLoading(false);
  // };

  const handlePayment = async () => {
  setLoading(true);

  const res = await fetch(
    "${API_BASE}/api/payments/create-order",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    }
  );

  const data = await res.json();
  const Razorpay = await loadRazorpay();

  const rzp = new Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    amount: data.amount * 100, // paise
    currency: "INR",
    name: "EverMoment",
    description: "Unlock your memory",
    order_id: data.razorpayOrderId,

    handler: async (response) => {
      try {
        const verifyRes = await fetch(
          "${API_BASE}/api/payments/verify",
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

        if (!verifyRes.ok || !verifyData.success) {
          throw new Error("Payment verification failed");
        }

        setSuccess(true);
        setTimeout(() => {
          router.push(`/order/${orderId}`);
        }, 2000);

      } catch (err) {
        alert("Payment verification failed. No amount was charged.");
      }
    },

    modal: {
      ondismiss: () => {
        // 🚫 CRITICAL: user cancelled
        setLoading(false);
        alert("Payment cancelled. Your order is still safe.");
      },
    },
  });

  rzp.open();
  setLoading(false);
};



  /* ---------------- UI STATES ---------------- */

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
        <p style={{ opacity: 0.7 }}>
          Redirecting to your order…
        </p>
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

  /* 🔐 Derive visual status */
  const derivedStatus =
    order.delivery_unlocked
      ? "delivered"
      : order.payment_status === "paid"
      ? "paid"
      : order.status;

  const currentIndex = STEPS.indexOf(derivedStatus);

  return (
    <div style={page}>
      <h1>Unlock Your EverMoment</h1>

      {/* 📦 ORDER SUMMARY */}
      <div style={summaryBox}>
        <p><strong>Plan:</strong> {order.plan} ₹{order.base_amount} </p>

        <p>
          <strong>Fast Track:</strong>{" "}
          {order.fastTrack ? "Yes ⚡" : "No"}
        </p>

        {order.fastTrack ? (
            <p>
              Add On Fast Track Charge: ₹{order.fast_track_amount}
            </p>
          ) : (
            <p>
              Add On Fast Track Charge: ₹{order.fast_track_amount}
            </p>
          )} 
        
        
         {/* {data.fastTrack && (
          <p style={{ opacity: 0.85 }}>
            Fast Track Charge: ₹{data.fast_track_amount}
          </p>
        )} */}

        <hr style={{ border: "none", borderTop: "1px solid #334155" }} />

        <p style={{ fontSize: "16px" }}>
          <strong>Total Amount:</strong> ₹{order.amount}
        </p>
      </div>

      {/* 🧭 TIMELINE */}
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
                  boxShadow: current
                    ? "0 0 0 6px rgba(34,197,94,0.2)"
                    : "none",
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
                  fontWeight: current ? "600" : "400",
                }}
              >
                {humanize(step)}
              </span>
            </div>
          );
        })}
      </div>

      {/* 💳 PAY BUTTON */}
      {order.status === "ready_for_payment" && (
        <button
          style={btn}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing…" : "Pay & Unlock"}
        </button>
      )}

      <p style={{ fontSize: "12px", opacity: 0.6 }}>
        Secure payment powered by Razorpay
      </p>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const page = {
  minHeight: "100vh",
  background: "#0f172a",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: "18px",
  padding: "20px",
};

const summaryBox = {
  border: "1px solid #334155",
  borderRadius: "12px",
  padding: "14px 16px",
  width: "100%",
  maxWidth: "380px",
  fontSize: "14px",
  background: "#020617",
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
  height: "42px",
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

/* ---------------- HELPERS ---------------- */

function humanize(s) {
  return s.replace(/_/g, " ");
}
