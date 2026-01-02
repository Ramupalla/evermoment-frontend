import express from "express";
import pool from "../src/db.js";
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
================================ */router.post("/:orderId/send-payment-link", async (req, res) => {
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

    if (order.status === "ready_for_payment") {
      return res.json({
        success: true,
        payment_link: order.payment_link,
        message: "Payment link already sent",
      });
    }

    const paymentLink = `${FRONTEND_URL}/payment/${order.access_token}`;

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
    console.error("SEND PAYMENT LINK ERROR:", err);
    res.status(500).json({ error: "Failed to send payment link" });
  }
});
