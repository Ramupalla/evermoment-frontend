// "use client";
// import { useState } from "react";

// export default function TestMultiUploadPage() {
//   const [files, setFiles] = useState([]);
//   const [progress, setProgress] = useState(0);
//   const [uploading, setUploading] = useState(false);

//   // ✅ ADD THESE HERE (this is the right place)
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [showConfirm, setShowConfirm] = useState(false);

//   // 🔴 Replace with a REAL orderId from DB
//   const ORDER_ID = "279cd8d9-8862-471a-88ad-1e4a8f5b06ab";

//   const uploadFiles = async () => {
//     if (!files.length) {
//       alert("Please select files");
//       return;
//     }

//     setUploading(true);
//     setProgress(0);

//     const uploadedFiles = [];

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];

//       // 1️⃣ Presign
//       const presignRes = await fetch(
//         "${API_BASE}/api/uploads/presign",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             orderId: ORDER_ID,
//             fileName: file.name,
//             fileType: file.type,
//           }),
//         }
//       );

//       const { uploadUrl, key } = await presignRes.json();

//       // 2️⃣ Upload to S3
//       await fetch(uploadUrl, {
//         method: "PUT",
//         headers: {
//           "Content-Type": file.type,
//         },
//         body: file,
//       });

//       uploadedFiles.push({
//         key,
//         originalName: file.name,
//         type: file.type.startsWith("video") ? "video" : "image",
//       });

//       // 3️⃣ Update progress
//       const percent = Math.round(((i + 1) / files.length) * 100);
//       setProgress(percent);
//     }

//     // 4️⃣ Notify backend
//     await fetch("${API_BASE}/api/uploads/complete", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         orderId: ORDER_ID,
//         files: uploadedFiles,
//       }),
//     });

//     setUploading(false);
//     alert("✅ All files uploaded successfully");
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#111",
//         color: "#fff",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: "20px",
//       }}
//     >
//       <h1>Test Multiple File Upload</h1>

//       <input
//         type="file"
//         multiple
//         onChange={(e) => setFiles([...e.target.files])}
//       />

//       <button
//         onClick={uploadFiles}
//         disabled={uploading}
//         style={{
//           padding: "12px 24px",
//           background: uploading ? "#555" : "#2563eb",
//           color: "#fff",
//           borderRadius: "6px",
//           cursor: "pointer",
//         }}
//       >
//         {uploading ? "Uploading..." : "Upload Files"}
//       </button>

//       {/* Progress bar */}
//       {uploading && (
//         <div style={{ width: "300px", background: "#333", borderRadius: "6px" }}>
//           <div
//             style={{
//               width: `${progress}%`,
//               height: "10px",
//               background: "#22c55e",
//               borderRadius: "6px",
//               transition: "width 0.3s",
//             }}
//           />
//         </div>
//       )}

//       <p>{progress}%</p>
//     </div>
//   );
// }


"use client";
import { useState } from "react";

export default function TestMultiUploadPage() {

  /* ✅ CENTRALIZED API BASE */
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
}



  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // ✅ New states for confirmation flow
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  // 🔴 Replace with a REAL orderId from DB
  const ORDER_ID = "279cd8d9-8862-471a-88ad-1e4a8f5b06ab";

  // 1️⃣ Upload files to S3 (NO finalization here)
  const uploadFiles = async () => {
    if (!files.length) {
      alert("Please select files");
      return;
    }

    setUploading(true);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Presign
      const presignRes = await fetch(
        '${API_BASE}/api/uploads/presign',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: ORDER_ID,
            fileName: file.name,
            fileType: file.type,
          }),
        }
      );

      const { uploadUrl, key } = await presignRes.json();

      // Upload to S3
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      // Track uploaded file (frontend only)
      setUploadedFiles((prev) => [
        ...prev,
        {
          key,
          originalName: file.name,
          type: file.type.startsWith("video") ? "video" : "image",
        },
      ]);

      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setUploading(false);
    setShowConfirm(true); // 🔥 Show confirmation modal
  };

  // 2️⃣ Finalize upload (THIS is where backend is notified)
  const finalizeUpload = async () => {
    await fetch('${API_BASE}/api/uploads/complete', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: ORDER_ID,
        files: uploadedFiles,
      }),
    });

    setShowConfirm(false);
    alert("✅ Files finalized successfully");
  };

  return (
    <div style={page}>
      <h1>Test Multiple File Upload</h1>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />

      <button
        onClick={uploadFiles}
        disabled={uploading}
        style={button(uploading)}
      >
        {uploading ? "Uploading..." : "Upload Files"}
      </button>

      {uploading && (
        <>
          <div style={progressBar}>
            <div
              style={{
                ...progressFill,
                width: `${progress}%`,
              }}
            />
          </div>
          <p>{progress}%</p>
        </>
      )}

      {/* ✅ Confirmation Modal */}
      {showConfirm && (
        <div style={overlay}>
          <div style={modal}>
            <h2>Upload complete</h2>
            <p>Did you upload all the files you wanted?</p>

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button onClick={() => setShowConfirm(false)}>
                Upload more
              </button>

              <button onClick={finalizeUpload}>
                Yes, continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- styles ---------------- */

const page = {
  minHeight: "100vh",
  background: "#0f172a",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "20px",
};

const button = (disabled) => ({
  padding: "12px 24px",
  background: disabled ? "#555" : "#2563eb",
  color: "#fff",
  borderRadius: "6px",
  cursor: disabled ? "not-allowed" : "pointer",
});

const progressBar = {
  width: "300px",
  height: "10px",
  background: "#333",
  borderRadius: "6px",
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  background: "#22c55e",
  transition: "width 0.3s",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
};

const modal = {
  background: "#111",
  color: "#fff",
  padding: "24px",
  borderRadius: "10px",
  width: "320px",
  textAlign: "center",
};
