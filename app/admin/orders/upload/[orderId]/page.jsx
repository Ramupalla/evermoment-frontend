// "use client";
// import { useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// /* ✅ CENTRALIZED API BASE */
// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

// if (!API_BASE) {
//   throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
// }


// export default function AdminUploadPage() {
//   const { orderId } = useParams();
//   const router = useRouter();

//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState("");

//   const handleUpload = async () => {
//     if (!file) return;

//     try {
//       setUploading(true);
//       setError("");

//       // 1️⃣ Presign
//       const presignRes = await fetch(
//         '${API_BASE}/api/uploads/presign',
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             orderId,
//             fileName: file.name,
//             fileType: file.type,
//           }),
//         }
//       );

//       const presignData = await presignRes.json();

//       // 2️⃣ Upload to S3
//       await fetch(presignData.uploadUrl, {
//         method: "PUT",
//         headers: { "Content-Type": file.type },
//         body: file,
//       });

//       // 3️⃣ Update order
//       await fetch(
//         `${API_BASE}/api/admin/orders/${orderId}/upload`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET,
//           },
//           body: JSON.stringify({
//             deliveryUrl: `s3://${process.env.NEXT_PUBLIC_S3_BUCKET}/${presignData.key}`,
//           }),
//         }
//       );

//       alert("Final video uploaded successfully ✅");
//       router.push("/admin/orders");
//     } catch (err) {
//       console.error(err);
//       setError("Upload failed. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div style={page}>
//       <div style={card}>
//         <button style={backBtn} onClick={() => router.back()}>
//           ← Back to orders
//         </button>

//         <h1 style={title}>Let's Upload Final Video</h1>

//         <p style={subtitle}>
//           Order ID: <span style={{ opacity: 0.8 }}>{orderId}</span>
//         </p>

//         {/* Upload box */}
//         <label style={uploadBox}>
//           <div style={uploadInner}>
//             <input
//               type="file"
//               accept="video/*"
//               hidden
//               onChange={(e) => setFile(e.target.files[0])}
//             />

//             {!file ? (
//               <>
//                 <p style={{ fontSize: 16, fontWeight: 600 }}>
//                   Click to select final video
//                 </p>
//                 <p style={{ fontSize: 13, opacity: 0.6 }}>
//                   MP4 / MOV recommended
//                 </p>
//               </>
//             ) : (
//               <>
//                 <p style={{ fontWeight: 600 }}>{file.name}</p>
//                 <p style={{ fontSize: 13, opacity: 0.6 }}>
//                   {(file.size / 1024 / 1024).toFixed(2)} MB
//                 </p>
//               </>
//             )}
//           </div>
//         </label>

//         <button
//           style={{
//             ...btn,
//             opacity: !file || uploading ? 0.6 : 1,
//             cursor: !file || uploading ? "not-allowed" : "pointer",
//           }}
//           disabled={!file || uploading}
//           onClick={handleUpload}
//         >
//           {uploading ? "Uploading final video…" : "Upload & Mark Ready"}
//         </button>

//         {error && <p style={errorText}>{error}</p>}
//       </div>
//     </div>
//   );
// }

// /* ---------------- STYLES ---------------- */

// const page = {
//   minHeight: "100vh",
//   background: "#020617",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   padding: "24px",
//   color: "#fff",
// };

// const card = {
//   background: "#0f172a",
//   borderRadius: "18px",
//   padding: "36px",
//   width: "100%",
//   maxWidth: "460px",
//   boxShadow: "0 30px 80px rgba(116, 108, 108, 0.45)",
// };

// const backBtn = {
//   background: "none",
//   border: "none",
//   color: "#93c5fd",
//   cursor: "pointer",
//   marginBottom: "16px",
//   fontSize: "14px",
// };

// const title = {
//   fontSize: "24px",
//   fontWeight: 700,
//   marginBottom: "6px",
// };

// const subtitle = {
//   fontSize: "14px",
//   opacity: 0.7,
//   marginBottom: "24px",
// };

// const uploadBox = {
//   border: "2px dashed #334155",
//   borderRadius: "16px",
//   // padding: "px",
//   textAlign: "center",
//   cursor: "pointer",
//   marginBottom: "24px",
//   background: "rgba(204, 12, 12, 0)",
// };

// const uploadInner = {
//   padding: "40px",
//   borderRadius: "24px",
//   background: "rgba(2,6,23,0.6)",
// };

// const btn = {
//   width: "100%",
//   padding: "14px",
//   background: "#22c55e",
//   color: "#022c22",
//   borderRadius: "10px",
//   fontWeight: 700,
//   border: "none",
// };

// const errorText = {
//   marginTop: "14px",
//   color: "#fca5a5",
//   fontSize: "14px",
// };


"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
}

export default function AdminUploadPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      /* 1️⃣ PRESIGN */
      const presignRes = await fetch(
        `${API_BASE}/api/uploads/presign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            fileName: file.name,
            fileType: file.type,
            uploadType: "final", // 🔥 THIS LINE FIXES IT
          }),
        }
      );

      if (!presignRes.ok) {
        const text = await presignRes.text();
        throw new Error(`Presign failed: ${text}`);
      }

      const presignData = await presignRes.json();

      /* 2️⃣ UPLOAD TO S3 */
      const uploadRes = await fetch(presignData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("S3 upload failed");
      }

      /* 3️⃣ UPDATE ORDER */
      const updateRes = await fetch(
        `${API_BASE}/api/admin/orders/${orderId}/upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET,
          },
          body: JSON.stringify({
            deliveryUrl: `s3://${process.env.NEXT_PUBLIC_S3_BUCKET}/${presignData.key}`,
          }),
        }
      );

      if (!updateRes.ok) {
        const text = await updateRes.text();
        throw new Error(`Order update failed: ${text}`);
      }

      alert("Final video uploaded successfully ✅");
      router.push("/admin/orders");
    } catch (err) {
      console.error(err);
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <button style={backBtn} onClick={() => router.back()}>
          ← Back to orders
        </button>

        <h1 style={title}>Let's Upload Final Video</h1>

        <p style={subtitle}>
          Order ID: <span style={{ opacity: 0.8 }}>{orderId}</span>
        </p>

        <label style={uploadBox}>
          <div style={uploadInner}>
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />

            {!file ? (
              <>
                <p style={{ fontSize: 16, fontWeight: 600 }}>
                  Click to select final video
                </p>
                <p style={{ fontSize: 13, opacity: 0.6 }}>
                  MP4 / MOV recommended
                </p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: 600 }}>{file.name}</p>
                <p style={{ fontSize: 13, opacity: 0.6 }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            )}
          </div>
        </label>

        <button
          style={{
            ...btn,
            opacity: !file || uploading ? 0.6 : 1,
            cursor: !file || uploading ? "not-allowed" : "pointer",
          }}
          disabled={!file || uploading}
          onClick={handleUpload}
        >
          {uploading ? "Uploading final video…" : "Upload & Mark Ready"}
        </button>

        {error && <p style={errorText}>{error}</p>}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const page = {
  minHeight: "100vh",
  background: "#020617",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  color: "#fff",
};

const card = {
  background: "#0f172a",
  borderRadius: "18px",
  padding: "36px",
  width: "100%",
  maxWidth: "460px",
  boxShadow: "0 30px 80px rgba(116, 108, 108, 0.45)",
};

const backBtn = {
  background: "none",
  border: "none",
  color: "#93c5fd",
  cursor: "pointer",
  marginBottom: "16px",
  fontSize: "14px",
};

const title = {
  fontSize: "24px",
  fontWeight: 700,
  marginBottom: "6px",
};

const subtitle = {
  fontSize: "14px",
  opacity: 0.7,
  marginBottom: "24px",
};

const uploadBox = {
  border: "2px dashed #334155",
  borderRadius: "16px",
  textAlign: "center",
  cursor: "pointer",
  marginBottom: "24px",
};

const uploadInner = {
  padding: "40px",
  borderRadius: "24px",
  background: "rgba(2,6,23,0.6)",
};

const btn = {
  width: "100%",
  padding: "14px",
  background: "#22c55e",
  color: "#022c22",
  borderRadius: "10px",
  fontWeight: 700,
  border: "none",
};

const errorText = {
  marginTop: "14px",
  color: "#fca5a5",
  fontSize: "14px",
};
