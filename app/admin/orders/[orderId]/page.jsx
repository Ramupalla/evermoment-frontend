
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/* ✅ CENTRALIZED API BASE */



export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
}


  useEffect(() => {
    fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
      headers: {
        "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.error) setError(data.error);
        else setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load order");
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <div style={page}>
        <h2>Loading order…</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={page}>
        <h2>{error}</h2>
      </div>
    );
  }

  const canUpload =
    order.status !== "uploaded" &&
    order.status !== "ready_for_payment" &&
    order.status !== "paid" &&
    order.status !== "delivered";

  const canSendPayment =
    order.status === "uploaded" && order.payment_status !== "paid";

  const sendPaymentLink = async () => {
    await fetch(
      `${API_BASE}/api/admin/orders/${order.id}/send-payment-link`,
      {
        method: "POST",
        headers: {
          "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET,
        },
      }
    );
    alert("Payment link sent");
    router.refresh();
  };

  return (
    <div style={page}>
      {/* Back */}
      <button style={backBtn} onClick={() => router.back()}>
        ← Back to Orders
      </button>

      <h1>Order Details</h1>

      {/* INFO */}
      <Section title="Order Info">
        <Row label="Order ID" value={order.id} />
        <Row label="Plan" value={order.plan} />
        <Row label="Amount" value={`₹${order.amount}`} />
        <Row label="Access Token" value={order.access_token} mono />
        <Row
        label="Created At"
        value={new Date(order.created_at).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      />

      </Section>

      {/* STATUS */}
      <Section title="Status">
        <Row label="Order Status" value={order.status} />
        <Row label="Payment Status" value={order.payment_status} />
        <Row
          label="Delivery Unlocked"
          value={order.delivery_unlocked ? "Yes" : "No"}
        />
      </Section>

      {/* DELIVERY */}
      <Section title="Delivery">
        <Row
          label="Final Video"
          value={order.delivery_url ? "Uploaded" : "Not uploaded"}
        />
        {order.delivery_url && (
          <Row label="Delivery URL" value="Stored securely (hidden)" />
        )}
      </Section>

      {/* ACTIONS */}
      <Section title="Actions">
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={{
              ...btn,
              opacity: canUpload ? 1 : 0.4,
              cursor: canUpload ? "pointer" : "not-allowed",
            }}
            disabled={!canUpload}
            onClick={() =>
              router.push(`/admin/orders/upload/${order.id}`)
            }
          >
            Upload Video
          </button>

          <button
            style={{
              ...btn,
              opacity: canSendPayment ? 1 : 0.4,
              cursor: canSendPayment ? "pointer" : "not-allowed",
            }}
            disabled={!canSendPayment}
            onClick={sendPaymentLink}
          >
            Send Payment Link
          </button>
        </div>
      </Section>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Section({ title, children }) {
  return (
    <div style={section}>
      <h3 style={{ marginBottom: "12px" }}>{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div style={row}>
      <span style={rowLabel}>{label}</span>
      <span
        style={{ ...rowValue, fontFamily: mono ? "monospace" : "inherit" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const page = {
  minHeight: "100vh",
  background: "#020617",
  color: "#fff",
  padding: "40px",
};

const backBtn = {
  marginBottom: "20px",
  background: "transparent",
  color: "#93c5fd",
  border: "none",
  fontSize: "14px",
  cursor: "pointer",
};

const section = {
  border: "1px solid #334155",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "20px",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "14px",
  padding: "6px 0",
};

const rowLabel = {
  opacity: 0.7,
};

const rowValue = {
  maxWidth: "60%",
  textAlign: "right",
  wordBreak: "break-all",
};

const btn = {
  padding: "10px 18px",
  background: "#fff",
  color: "#020617",
  borderRadius: "8px",
  border: "none",
  fontWeight: "600",
};
