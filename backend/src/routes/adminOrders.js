import express from "express";
import pool from "../db.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

/**
 * =========================
 * Admin: Get all orders
 * GET /api/admin/orders
 * =========================
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        plan,
        status,
        payment_status,
        delivery_url
      FROM orders
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("FETCH ADMIN ORDERS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/**
 * =========================
 * Admin: Upload final video
 * POST /api/admin/orders/:orderId/upload
 * =========================
 */
router.post("/:orderId/upload", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryUrl } = req.body;

    if (!deliveryUrl) {
      return res.status(400).json({ error: "deliveryUrl is required" });
    }

    const [result] = await pool.query(
      `
      UPDATE orders
      SET
        delivery_url = ?,
        status = 'uploaded'
      WHERE id = ?
      `,
      [deliveryUrl, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      success: true,
      message: "Final video uploaded & order marked as uploaded",
    });
  } catch (err) {
    console.error("UPLOAD FINAL VIDEO ERROR:", err);
    res.status(500).json({ error: "Failed to save delivery URL" });
  }
});

/**
 * =========================
 * Admin: Send payment link
 * POST /api/admin/orders/:orderId/send-payment-link
 * ⚠️ MUST be before "/:orderId"
 * =========================
 */
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
      return res.status(400).json({
        error: "Final video not uploaded yet",
      });
    }

    if (order.payment_status === "paid") {
      return res.status(400).json({
        error: "Payment already completed",
      });
    }

    const paymentLink =
      order.payment_link ||
      `${process.env.FRONTEND_URL}/payment/${order.access_token}`;

    if (!order.payment_link || order.status !== "ready_for_payment") {
      await pool.query(
        `
        UPDATE orders
        SET
          payment_link = ?,
          status = 'ready_for_payment'
        WHERE id = ?
        `,
        [paymentLink, order.id]
      );
    }

    if (order.email) {
      await sendEmail({
        to: order.email,
        subject: "Your EverMoment is ready 💛",
        html: `
          <p>Your EverMoment video is ready.</p>
          <p>Please complete payment to unlock your download.</p>
          <p>
            <a href="${paymentLink}">
              👉 Pay & Unlock Your Video
            </a>
          </p>
        `,
      });
    }

    res.json({
      success: true,
      payment_link: paymentLink,
      message: "Payment link sent successfully",
    });
  } catch (err) {
    console.error("SEND PAYMENT LINK ERROR:", err);
    res.status(500).json({ error: "Failed to send payment link" });
  }
});

/**
 * =========================
 * Admin: Resend delivery link
 * POST /api/admin/orders/:orderId/resend
 * =========================
 */
router.post("/:orderId/resend", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { channel } = req.body; // "email" | "whatsapp" | "both"

    const [[order]] = await pool.query(
      `
      SELECT
        email,
        whatsapp,
        delivery_url,
        payment_status,
        delivery_unlocked
      FROM orders
      WHERE id = ?
      `,
      [orderId]
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.payment_status !== "paid" || !order.delivery_unlocked) {
      return res.status(400).json({
        error: "Order not paid or delivery not unlocked",
      });
    }

    if (!order.delivery_url) {
      return res.status(400).json({
        error: "Delivery URL missing",
      });
    }

    /* 📧 Email resend */
    if ((channel === "email" || channel === "both") && order.email) {
      await sendEmail({
        to: order.email,
        subject: "🎉 Your EverMoment Download Link",
        html: `
          <h2>Your EverMoment is Ready ❤️</h2>
          <p>You can download your video using the link below:</p>
          <a href="${order.delivery_url}" target="_blank">
            Download EverMoment
          </a>
        `,
      });
    }

    /* 📲 WhatsApp placeholder */
    if (channel === "whatsapp" || channel === "both") {
      console.log(
        `WhatsApp resend queued for ${order.whatsapp}: ${order.delivery_url}`
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("ADMIN RESEND ERROR:", err);
    res.status(500).json({ error: "Failed to resend delivery" });
  }
});

/**
 * =========================
 * Admin: Get single order
 * GET /api/admin/orders/:orderId
 * ⚠️ MUST be last
 * =========================
 */
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const [rows] = await pool.query(
      `SELECT * FROM orders WHERE id = ?`,
      [orderId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("FETCH ORDER DETAILS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

export default router;
