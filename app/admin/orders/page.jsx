"use client";

import { useEffect, useState, useCallback } from "react";

/* =====================
   CONFIG
===================== */
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
}

/* =====================
   PAGE
===================== */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     FETCH ORDERS
  ===================== */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: {
          "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET,
        },
        cache: "no-store",
      });

      // 🚫 Unauthorized
      if (res.status === 401) {
        console.error("Admin unauthorized");
        setOrders([]);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      // const data = await res.json();
      if (!res.ok) {
  throw new Error(`Payment API failed (${res.status})`);
}

const data = await res.json();

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);


  //     setOrders(Array.isArray(data) ? data : []);
  //   } catch (err) {
  //     console.error("ADMIN FETCH ERROR:", err);
  //     setOrders([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  /* =====================
     AUTO REFRESH
  ===================== */
  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  /* =====================
     UI STATES
  ===================== */
  if (loading) {
    return (
      <div style={page}>
        <h2>Loading orders…</h2>
      </div>
    );
  }

  return (
    <div style={page}>
      <h1>
        <span style={{ color: "#60a5fa" }}>Admin</span> Orders
      </h1>

      <div style={table}>
        <div style={rowHeader}>
          <Cell>Order ID</Cell>
          <Cell>Plan</Cell>
          <Cell>Status</Cell>
          <Cell>Payment</Cell>
          <Cell>Actions</Cell>
        </div>

        {orders.length === 0 && (
          <div style={{ padding: "20px", opacity: 0.7 }}>
            No orders yet
          </div>
        )}

        {orders.map((o) => (
          <div key={o.id} style={row}>
            <Cell>
              <a
                href={`/admin/orders/${o.id}`}
                style={{ color: "#93c5fd", textDecoration: "underline" }}
              >
                {o.id}
              </a>
            </Cell>

            <Cell>{o.plan}</Cell>
            <Cell>{o.status}</Cell>
            <Cell>{o.payment_status}</Cell>

            <Cell>
              <Actions order={o} onActionComplete={fetchOrders} />
            </Cell>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================
   ACTIONS
===================== */
function Actions({ order, onActionComplete }) {
  const canUpload =
    !["uploaded", "ready_for_payment", "paid", "delivered"].includes(
      order.status
    );

  const canSendPayment =
    order.status === "uploaded" && order.payment_status !== "paid";

  const sendPaymentLink = async (orderId) => {
  try {
    const res = await fetch(
      `${API_BASE}/api/admin/orders/${orderId}/send-payment-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // const data = await res.json();
    if (!res.ok) {
  throw new Error(`Payment API failed (${res.status})`);
}

const data = await res.json();


    if (!res.ok) {
      throw new Error(data.error || "Failed to send payment link");
    }

    alert("Payment link sent");
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div style={actions}>
      <button
        style={{
          ...btn,
          opacity: canUpload ? 1 : 0.4,
          cursor: canUpload ? "pointer" : "not-allowed",
        }}
        disabled={!canUpload}
        onClick={() =>
          (window.location.href = `/admin/orders/upload/${order.id}`)
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
        onClick={() => sendPaymentLink(order.id)}
      >
        Send Payment Link
      </button>
    </div>
  );
}

/* =====================
   STYLES
===================== */
const page = {
  minHeight: "100vh",
  background: "#020617",
  color: "#fff",
  padding: "40px",
};

const table = {
  marginTop: "24px",
  border: "1px solid #334155",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 30px 80px rgba(116, 108, 108, 0.45)",
};

const rowHeader = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 2fr",
  background: "#020617",
  borderBottom: "1px solid #334155",
  fontWeight: "600",
};

const row = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 2fr",
  borderBottom: "1px solid #334155",
};

const Cell = ({ children }) => (
  <div style={{ padding: "12px", fontSize: "14px" }}>{children}</div>
);

const actions = {
  display: "flex",
  gap: "10px",
};

const btn = {
  padding: "6px 10px",
  background: "#fff",
  color: "#020617",
  borderRadius: "6px",
  fontSize: "12px",
  border: "none",
};


// #====================================================================

// // here is the responsible code admin/page.jsx:
// "use client";
// import { useEffect, useState, useCallback } from "react";

// /* ✅ CENTRALIZED API BASE */



// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

// if (!API_BASE) {
//   throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
// }


//   /* =====================
//      FETCH ORDERS
//      ===================== */
//  useEffect(() => {
//   const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
//   const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET;

//   if (!API_BASE || !ADMIN_SECRET) {
//     console.error("Admin env vars missing");
//     return;
//   }

//   fetch(`${API_BASE}/api/admin/orders`, {
//     headers: {
//       "x-admin-secret": ADMIN_SECRET,
//     },
//   })
//     .then((res) => {
//       if (!res.ok) throw new Error("Unauthorized");
//       return res.json();
//     })
//     .then((data) => {
//       if (Array.isArray(data)) {
//         setOrders(data);
//       } else {
//         console.error("Unexpected response", data);
//       }
//     })
//     .catch((err) => {
//       console.error("Admin fetch failed:", err.message);
//     });
// }, []);

// const fetchOrders = useCallback(async () => {
//   try {
//     setLoading(true);

//     const res = await fetch(`${API_BASE}/api/admin/orders`, {
//       headers: {
//         "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET,
//       },
//       cache: "no-store",
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.error || "Failed to fetch orders");
//     }

//     setOrders(Array.isArray(data) ? data : []);
//   } catch (err) {
//     console.error("ADMIN FETCH ERROR:", err);
//     setOrders([]);
//   } finally {
//     setLoading(false);
//   }
// }, []);


//   useEffect(() => {
//     fetchOrders(); // initial load

//     const interval = setInterval(() => {
//       fetchOrders();
//     }, 10000); // 🔁 every 10 seconds

//     return () => clearInterval(interval); // cleanup
//   }, [fetchOrders]);

//   if (loading) {
//     return (
//       <div style={page}>
//         <h2>Loading orders…</h2>
//       </div>
//     );
//   }

//   return (
//     <div style={page}>
//       <h1>
//         <span style={{ color: "#1803ccff" }}>Admin</span>
//       </h1>

//       <div style={table}>
//         <div style={rowHeader}>
//           <Cell>Order ID</Cell>
//           <Cell>Plan</Cell>
//           <Cell>Status</Cell>
//           <Cell>Payment</Cell>
//           <Cell>Actions</Cell>
//         </div>

//         {Array.isArray(orders) &&
//           orders.map((o) => (
//             <div key={o.id} style={row}>
//               <Cell>
//                 <a
//                   href={`/admin/orders/${o.id}`}
//                   style={{
//                     color: "#93c5fd",
//                     textDecoration: "underline",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {o.id}
//                 </a>
//               </Cell>

//               <Cell>{o.plan}</Cell>
//               <Cell>{o.status}</Cell>
//               <Cell>{o.payment_status}</Cell>

//               <Cell>
//                 <Actions order={o} onActionComplete={fetchOrders} />
//               </Cell>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }

// /* =====================
//    ACTIONS
//    ===================== */

// function Actions({ order, onActionComplete }) {
//   const canUpload =
//     order.status !== "uploaded" &&
//     order.status !== "ready_for_payment" &&
//     order.status !== "paid" &&
//     order.status !== "delivered";

//   const canSendPayment =
//     order.status === "uploaded" && order.payment_status !== "paid";

//   const sendPaymentLink = async () => {
//     await fetch(
//       `${API_BASE}/api/admin/orders/${order.id}/send-payment-link`,
//       {
//         method: "POST",
//         headers: {
//           "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET,
//         },
//       }
//     );

//     alert("Payment link sent");

//     // 🔁 refresh immediately
//     onActionComplete();
//   };

//   return (
//     <div style={actions}>
//       <button
//         style={{
//           ...btn,
//           opacity: canUpload ? 1 : 0.4,
//           cursor: canUpload ? "pointer" : "not-allowed",
//         }}
//         disabled={!canUpload}
//         onClick={() =>
//           (window.location.href = `/admin/orders/upload/${order.id}`)
//         }
//       >
//         Upload Video
//       </button>

//       <button
//         style={{
//           ...btn,
//           opacity: canSendPayment ? 1 : 0.4,
//           cursor: canSendPayment ? "pointer" : "not-allowed",
//         }}
//         disabled={!canSendPayment}
//         onClick={sendPaymentLink}
//       >
//         Send Payment Link
//       </button>
//     </div>
//   );
// }

// /* =====================
//    STYLES
//    ===================== */

// const page = {
//   minHeight: "100vh",
//   background: "#020617",
//   color: "#fff",
//   padding: "40px",
// };

// const table = {
//   marginTop: "24px",
//   border: "1px solid #334155",
//   borderRadius: "10px",
//   overflow: "hidden",
//   boxShadow: "0 30px 80px rgba(116, 108, 108, 0.45)",
// };

// const rowHeader = {
//   display: "grid",
//   gridTemplateColumns: "1fr 1fr 1fr 1fr 2fr",
//   background: "#020617",
//   borderBottom: "1px solid #334155",
//   fontWeight: "600",
// };

// const row = {
//   display: "grid",
//   gridTemplateColumns: "1fr 1fr 1fr 1fr 2fr",
//   borderBottom: "1px solid #334155",
// };

// const Cell = ({ children }) => (
//   <div style={{ padding: "12px", fontSize: "14px" }}>{children}</div>
// );

// const actions = {
//   display: "flex",
//   gap: "10px",
// };

// const btn = {
//   padding: "6px 10px",
//   background: "#fff",
//   color: "#020617",
//   borderRadius: "6px",
//   fontSize: "12px",
//   border: "none",
// };



// "use client";
// import { useEffect, useState, useCallback } from "react";

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* =====================
//      FETCH ORDERS
//      ===================== */
//   const fetchOrders = useCallback(() => {
//     fetch("${API_BASE}/api/admin/orders", {
//       headers: {
//         "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) {
//           setOrders(data);
//         } else {
//           console.error("Admin API error:", data);
//           setOrders([]);
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Fetch failed:", err);
//         setOrders([]);
//         setLoading(false);
//       });
//   }, []);

//   /* =====================
//      AUTO REFRESH
//      ===================== */
//   useEffect(() => {
//     fetchOrders(); // initial load

//     const interval = setInterval(() => {
//       fetchOrders();
//     }, 10000); // 🔁 every 10 seconds

//     return () => clearInterval(interval); // cleanup
//   }, [fetchOrders]);

//   if (loading) {
//     return (
//       <div style={page}>
//         <h2>Loading orders…</h2>
//       </div>
//     );
//   }

//   return (
//     <div style={page}>
//       <h1>
//         <span style={{ color: "#1803ccff" }}>Admin</span>
//       </h1>

//       <div style={table}>
//         <div style={rowHeader}>
//           <Cell>Order ID</Cell>
//           <Cell>Plan</Cell>
//           <Cell>Status</Cell>
//           <Cell>Payment</Cell>
//           <Cell>Actions</Cell>
//         </div>

//         {Array.isArray(orders) &&
//           orders.map((o) => (
//             <div key={o.id} style={row}>
//               <Cell>
//                 <a
//                   href={`/admin/orders/${o.id}`}
//                   style={{
//                     color: "#93c5fd",
//                     textDecoration: "underline",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {o.id}
//                 </a>
//               </Cell>

//               <Cell>{o.plan}</Cell>
//               <Cell>{o.status}</Cell>
//               <Cell>{o.payment_status}</Cell>

//               <Cell>
//                 <Actions order={o} onActionComplete={fetchOrders} />
//               </Cell>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }

// /* =====================
//    ACTIONS
//    ===================== */

// function Actions({ order, onActionComplete }) {
//   const canUpload =
//     order.status !== "uploaded" &&
//     order.status !== "ready_for_payment" &&
//     order.status !== "paid" &&
//     order.status !== "delivered";

//   const canSendPayment =
//     order.status === "uploaded" && order.payment_status !== "paid";

//   const sendPaymentLink = async () => {
//     await fetch(
//       `${API_BASE}/api/admin/orders/${order.id}/send-payment-link`,
//       {
//         method: "POST",
//         headers: {
//           "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET,
//         },
//       }
//     );

//     alert("Payment link sent");

//     // 🔁 refresh immediately
//     onActionComplete();
//   };

//   return (
//     <div style={actions}>
//       <button
//         style={{
//           ...btn,
//           opacity: canUpload ? 1 : 0.4,
//           cursor: canUpload ? "pointer" : "not-allowed",
//         }}
//         disabled={!canUpload}
//         onClick={() =>
//           (window.location.href = `/admin/orders/upload/${order.id}`)
//         }
//       >
//         Upload Video
//       </button>

//       <button
//         style={{
//           ...btn,
//           opacity: canSendPayment ? 1 : 0.4,
//           cursor: canSendPayment ? "pointer" : "not-allowed",
//         }}
//         disabled={!canSendPayment}
//         onClick={sendPaymentLink}
//       >
//         Send Payment Link
//       </button>
//     </div>
//   );
// }

// /* =====================
//    STYLES
//    ===================== */

// const page = {
//   minHeight: "100vh",
//   background: "#020617",
//   color: "#fff",
//   padding: "40px",
// };

// const table = {
//   marginTop: "24px",
//   border: "1px solid #334155",
//   borderRadius: "10px",
//   overflow: "hidden",
//   boxShadow: "0 30px 80px rgba(116, 108, 108, 0.45)",
// };

// const rowHeader = {
//   display: "grid",
//   gridTemplateColumns: "1fr 1fr 1fr 1fr 2fr",
//   background: "#020617",
//   borderBottom: "1px solid #334155",
//   fontWeight: "600",
// };

// const row = {
//   display: "grid",
//   gridTemplateColumns: "1fr 1fr 1fr 1fr 2fr",
//   borderBottom: "1px solid #334155",
// };

// const Cell = ({ children }) => (
//   <div style={{ padding: "12px", fontSize: "14px" }}>{children}</div>
// );

// const actions = {
//   display: "flex",
//   gap: "10px",
// };

// const btn = {
//   padding: "6px 10px",
//   background: "#fff",
//   color: "#020617",
//   borderRadius: "6px",
//   fontSize: "12px",
//   border: "none",
// };
