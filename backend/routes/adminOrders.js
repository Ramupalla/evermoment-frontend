import express from "express";
import pool from "../db.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

/* ===============================
   GET ALL ORDERS
================================ */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        plan,
        status,
        payment_status,
        special_because,
        delivery_url
      FROM orders
      ORDER BY created_at DESC
      `
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/* ===============================
   UPLOAD FINAL VIDEO (CRITICAL)
================================ */
router.post("/:orderId/upload", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryUrl } = req.body;

    if (!deliveryUrl) {
      return res.status(400).json({ error: "deliveryUrl required" });
    }

    await pool.query(
      `
      UPDATE orders
      SET
        delivery_url = ?,
        status = 'uploaded'
      WHERE id = ?
      `,
      [deliveryUrl, orderId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("UPLOAD FINAL VIDEO ERROR:", err);
    res.status(500).json({ error: "Failed to save final video" });
  }
});

/* ===============================
   SEND PAYMENT LINK
================================ */
router.post("/:orderId/send-payment-link", async (req, res) => {
  try {
    const { orderId } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        email,
        access_token,
        status,
        payment_status,
        delivery_url,
        payment_link
      FROM orders
      WHERE id = ?
      `,
      [orderId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = rows[0];

    if (!order.delivery_url) {
      return res.status(400).json({ error: "Final video not uploaded yet" });
    }

    if (order.payment_status === "paid") {
      return res.status(400).json({ error: "Already paid" });
    }

   const FRONTEND_URL = process.env.FRONTEND_URL;

if (!FRONTEND_URL) {
  throw new Error("FRONTEND_URL not configured");
}

const paymentLink =
  order.payment_link ||
  `${FRONTEND_URL}/payment/${order.access_token}`;

    await pool.query(
      `
      UPDATE orders
      SET status = 'ready_for_payment', payment_link = ?
      WHERE id = ?
      `,
      [paymentLink, orderId]
    );

    if (order.email) {
      await sendEmail({
        to: order.email,
        subject: "Your EverMoment is ready 💛",
        html: `
          <p>Your EverMoment video is ready.</p>
          <p><a href="${paymentLink}">Pay & Unlock Your Video</a></p>
        `,
      });
    }

    res.json({ success: true, payment_link: paymentLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send payment link" });
  }

});

function extractS3Key(deliveryUrl) {
  if (!deliveryUrl) return null;
  return deliveryUrl.replace(/^s3:\/\/[^/]+\//, "");
}


export default router;
