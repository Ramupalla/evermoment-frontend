"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/**
 * Real lifecycle steps
 */
const STEPS = [
  "created",
  "uploaded",
  "ready_for_payment",
  "paid",
  "delivered",
];

export default function OrderStatusPage() {
  

  const { token } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
// -----------
  // const [orderId, setOrderId] = useState(null);
  // const [selectedFiles, setSelectedFiles] = useState([]);
  // const [uploading, setUploading] = useState(false);
// -----------
  // useEffect(() => {
  //   if (!token) return;

  //   fetch(`http://localhost:5000/api/orders/access/${token}`)
  //     .then((res) => res.json())
  //     .then((d) => {
  //       if (d?.error) setError(d.error);
  //       else setData(d);
  //     })
  //     .catch(() => setError("Unable to fetch order status"));
  // }, [token]);


//   useEffect(() => {
//   if (!token) return;

//   fetch(`http://localhost:5000/api/orders/access/${token}`)
//     .then((res) => res.json()) // ✅ THIS LINE WAS MISSING
//     .then((d) => {
//       if (d?.error) {
//         setError(d.error);
//       } else {
//         setData(d);
//         setOrderId(d.id); // UUID from DB
//       }
//     })
//     .catch(() => setError("Unable to fetch order status"));
// }, [token]);

useEffect(() => {
  if (!token) return;

  fetch(`http://localhost:5000/api/orders/access/${token}`)
    .then(async (res) => {
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Fetch failed");
      return json;
    })
    .then((order) => {
      setData(order);
    })
    .catch(() => {
      setError("Unable to fetch order status");
    });
}, [token]);

  if (error) {
    return (
      <div style={page}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={page}>
        <h2>Loading your EverMoment…</h2>
      </div>
    );
  }

  /* 🔐 Derive visual status safely */
  const derivedStatus =
    data.delivery_unlocked
      ? "delivered"
      : data.payment_status === "paid"
      ? "paid"
      : data.status;

  const currentIndex = STEPS.indexOf(derivedStatus);

const uploadFiles = async () => {
  if (!orderId || selectedFiles.length === 0) return;

  setUploading(true);

  try {
    const uploaded = [];

    for (const file of selectedFiles) {
      // 1️⃣ Get presigned URL
      const presignRes = await fetch(
        "http://localhost:5000/api/uploads/presign",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId, // UUID from DB
            fileName: file.name,
            fileType: file.type,
          }),
        }
      );

      const { uploadUrl, key } = await presignRes.json();

      // 2️⃣ Upload to S3
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      uploaded.push({
        key,
        type: file.type.startsWith("video") ? "video" : "image",
        originalName: file.name,
      });
    }

    // 3️⃣ Finalize upload
    await fetch("http://localhost:5000/api/uploads/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        files: uploaded,
      }),
    });

    alert("Upload completed successfully!");
    window.location.reload();
  } catch (err) {
    alert("Upload failed. Please try again.");
  } finally {
    setUploading(false);
  }
};


  return (
    <div style={page}>
      <h1><strong>Your EverMoment</strong></h1>

      {/* 📦 ORDER SUMMARY */}
      <div style={summaryBox}>
        <p><strong>Plan:</strong> {data.plan}: ₹{data.base_amount} </p>

        <p>
          <strong>Fast Track:</strong>{" "}
          {data.fastTrack ? "Yes ⚡" : "No"}
        </p>

        {/* {!data.fastTrack || (
          <p style={{ opacity: 0.85 }}>
            Add On Fast Track Charge: ₹{data.fast_track_amount}
          </p>
        )} */}

         {data.fastTrack ? (
            <p>
              Add On Fast Track Charge: ₹{data.fast_track_amount}
            </p>
          ) : (
            <p>
              Add On Fast Track Charge: ₹{data.fast_track_amount}
            </p>
          )} 


        <hr style={{ border: "none", borderTop: "1px solid #334155" }} />

        <p style={{ fontSize: "15px" }}>
          <strong>Total Amount:</strong> ₹{data.amount}
        </p>
      </div>

      {/* <p style={statusText}>
        <strong>Status:</strong> Order {humanize(derivedStatus)} Sucessfully!
      </p> */}
      <p style={{ ...statusText, ...animateIn }}>
        <strong>Status:</strong> 🎉 Your order is {humanize(derivedStatus)} successfully!
      </p>
      {derivedStatus === "created" && (
        <p className="text-sm text-white/80 mt-3 animate-fadeUp">
          You will receive the order confirmation shortly.
        </p>
      )}



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


      {/* 💳 PAY NOW */}
      {data.status === "ready_for_payment" && (
        <button
          style={primaryBtn}
          onClick={() => router.push(`/payment/${token}`)}
        >
          Pay & Unlock Your Video
        </button>
      )}

      {/* ⏳ PAID BUT DELIVERY NOT READY */}
      {data.payment_status === "paid" && !data.delivery_unlocked && (
        <p style={infoText}>
          ⏳ Payment received.<br />
          Preparing your delivery…
        </p>
      )}

      {/* 📩 BIG DELIVERY REMINDER */}
      {data.delivery_unlocked && (
        <div style={reminderBox}>
          <h2 style={{ marginBottom: "6px" }}>🎉 Your EverMoment is Ready!</h2>
          <p style={{ fontSize: "15px", lineHeight: 1.6 }}>
            <strong>Download link has been sent to your</strong><br />
            📧 <b>Email</b> 
          </p>
          <p style={{ fontSize: "13px", opacity: 0.8 }}>
            You can download now or check your inbox anytime.
          </p>
        </div>
      )}

      {/* ⬇️ DOWNLOAD */}
      {data.delivery_unlocked && (
        <a
          href={`http://localhost:5000/api/orders/${token}/download`}
          style={downloadBtn}
        >
          ⬇️ Download Your EverMoment
        </a>
      )}
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
  padding: "30px 40px",
  width: "100%",
  maxWidth: "380px",
  fontSize: "14px",
  background: "#020617",
  boxShadow: "0 30px 80px rgba(116, 108, 108, 0.45)",

};

const statusText = {
  fontSize: "20px",
  opacity: 0.9,
};

const animateIn = {
  animation: 'fadeUp 0.6s ease-out both',
};


const infoText = {
  marginTop: "12px",
  textAlign: "center",
  fontSize: "14px",
  opacity: 0.9,
};

const timeline = {
  width: "100%",
  maxWidth: "160px",
  marginTop: "10px",
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

const primaryBtn = {
  marginTop: "16px",
  padding: "12px 22px",
  background: "#ffffff",
  color: "#0f172a",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
  border: "none",
};

const downloadBtn = {
  marginTop: "16px",
  padding: "12px 22px",
  background: "#22c55e",
  color: "#022c22",
  borderRadius: "8px",
  fontWeight: "600",
  textDecoration: "none",
};

const reminderBox = {
  border: "1px solid #22c55e",
  background: "rgba(34,197,94,0.08)",
  borderRadius: "14px",
  padding: "20px 22px",
  textAlign: "center",
  maxWidth: "420px",
  boxShadow: "0 0 0 6px rgba(34,197,94,0.12)",
};

/* ---------------- HELPERS ---------------- */

function humanize(s) {
  if (typeof s !== "string") return "";
  return s.replace(/_/g, " ");
}
