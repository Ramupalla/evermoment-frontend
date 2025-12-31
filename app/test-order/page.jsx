"use client";

export default function TestOrderPage() {
  const createOrder = async () => {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@mail.com",
        whatsapp: "9999999999",
        momentType: "birthday",
        deliveryType: "video",
      }),
    });

    const data = await res.json();
    console.log("ORDER RESPONSE:", data);
    alert("Order API called — check console");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#111",
        color: "#fff",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h1 style={{ fontSize: "24px" }}>Test Order Creation</h1>

      <button
        onClick={createOrder}
        style={{
          padding: "12px 24px",
          background: "#2563eb",
          color: "#fff",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Create Order (Test)
      </button>
    </div>
  );
}
