import express from "express";
import pool from "../db.js";
import { sendReadyForPaymentEmail } from "../utils/email.js";
import { sendReadyForPaymentWhatsApp } from "../utils/whatsapp.js";


const router = express.Router();

// Allowed admin transitions
const allowedTransitions = {
  uploaded: ["processing"],
  processing: ["ready_for_payment"],
};

router.patch("/orders/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "New status is required" });
    }

    // 1️⃣ Get current status
    const [rows] = await pool.query(
      "SELECT status FROM orders WHERE id = ?",
      [orderId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    const currentStatus = rows[0].status;

    // 2️⃣ Validate transition
    const allowedNext = allowedTransitions[currentStatus] || [];

    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        error: `Invalid status transition: ${currentStatus} → ${status}`,
      });
    }

    // 3️⃣ Update status
    await pool.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, orderId]
    );

        // 🔔 Notify client ONLY when ready_for_payment
    if (status === "ready_for_payment") {
    const [orderRows] = await pool.query(
        "SELECT email, whatsapp, access_token FROM orders WHERE id = ?",
        [orderId]
    );

    if (orderRows.length) {
        const { email, whatsapp, access_token } = orderRows[0];
        const link = `http://localhost:3000/order/${access_token}`;

        // Fire-and-forget (do NOT block response)
        sendReadyForPaymentEmail({ email, orderId, link });
        sendReadyForPaymentWhatsApp({ phone: whatsapp, orderId, link });
    }
    }

    res.json({
      message: "Order status updated",
      from: currentStatus,
      to: status,
    });
  } catch (err) {
    console.error("ADMIN STATUS ERROR:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

export default router;
