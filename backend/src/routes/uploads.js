import express from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import s3 from "../s3.js";
import pool from "../db.js";

const router = express.Router();

/**
 * 1️⃣ Generate presigned URL
 */
router.post("/presign", async (req, res) => {
  try {
    const { orderId, fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({
        error: "fileName and fileType are required",
      });
    }

    const safeOrderId = orderId || randomUUID();
    const key = `raw/${safeOrderId}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5,
    });

    return res.json({
      uploadUrl,
      key,
      orderId: safeOrderId,
    });
  } catch (err) {
    console.error("PRESIGN ERROR:", err);
    return res.status(500).json({
      error: "Failed to generate upload URL",
    });
  }
});

/**
 * 2️⃣ Save uploaded files info to DB (MULTI-FILE)
 */
router.post("/complete", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { orderId, files } = req.body;

    if (!orderId || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        error: "orderId and files array are required",
      });
    }

    await connection.beginTransaction();

    const insertQuery = `
      INSERT INTO media_files
      (id, order_id, s3_key, file_type, original_name, status)
      VALUES (?, ?, ?, ?, ?, 'uploaded')
    `;

    for (const file of files) {
      const { key, type, originalName } = file;
      if (!key) continue;

      router.post("/complete", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { orderId, files } = req.body;

    if (!orderId || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        error: "orderId and files array are required",
      });
    }

    await connection.beginTransaction();

    const insertQuery = `
      INSERT INTO media_files
      (id, order_id, s3_key, file_type, original_name, status)
      VALUES (?, ?, ?, ?, ?, 'uploaded')
    `;

    for (const file of files) {
      const { key, type, originalName } = file;
      if (!key) continue;

      await connection.query(insertQuery, [
        randomUUID(),
        orderId,
        key,
        type || "video",
        originalName || null,
      ]);
    }

    // ✅ DO NOT TOUCH orders.status here
    await connection.commit();

    res.status(201).json({
      message: "Raw client files uploaded successfully",
    });
  } catch (err) {
    await connection.rollback();
    console.error("UPLOAD COMPLETE ERROR:", err);

    res.status(500).json({
      error: "Failed to finalize uploads",
    });
  } finally {
    connection.release();
  }
});

    }

    // ✅ Finalize upload → move order to uploaded
  // ✅ ONLY save raw files
await connection.commit();

res.status(201).json({
  message: "Raw files uploaded successfully",
});


    // await connection.commit();

    // res.status(201).json({
    //   message: "All uploads finalized successfully",
    // });
  } catch (err) {
    await connection.rollback();
    console.error("UPLOAD COMPLETE ERROR:", err);

    res.status(500).json({
      error: "Failed to finalize uploads",
    });
  } finally {
    connection.release();
  }
});


export default router;

