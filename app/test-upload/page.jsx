"use client";
import { useState } from "react";

export default function TestUploadPage() {


const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://evermoment-frontend-1.onrender.com";

  const [file, setFile] = useState(null);

  // 🔴 IMPORTANT: paste a REAL orderId from your DB
  const ORDER_ID = "279cd8d9-8862-471a-88ad-1e4a8f5b06ab";

  const uploadOneFile = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    console.log("Selected file:", file.name);

    // 1️⃣ Get presigned URL
    const presignRes = await fetch("${API_BASE}/api/uploads/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: ORDER_ID,
        fileName: file.name,
        fileType: file.type,
      }),
    });

    const presignData = await presignRes.json();
    console.log("Presign response:", presignData);

    const { uploadUrl, key } = presignData;

    // 2️⃣ Upload file directly to S3
    const s3Res = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    console.log("S3 upload status:", s3Res.status);

    // 3️⃣ Notify backend upload is complete
    const completeRes = await fetch(
      "${API_BASE}/api/uploads/complete",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: ORDER_ID,
          files: [
            {
              key,
              originalName: file.name,
              type: file.type.startsWith("video") ? "video" : "image",
            },
          ],
        }),
      }
    );

    const completeData = await completeRes.json();
    console.log("Upload complete response:", completeData);

    alert("✅ File upload test completed");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
        background: "#111",
        color: "#fff",
      }}
    >
      <h1>Test One File Upload</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={uploadOneFile}
        style={{
          padding: "12px 24px",
          background: "#2563eb",
          color: "#fff",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Upload File (Test)
      </button>
    </div>
  );
}
