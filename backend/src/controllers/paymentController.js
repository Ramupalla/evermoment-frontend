// import Razorpay from "razorpay";
// import pool from "../db.js";
// import crypto from "crypto";
// import { sendDeliveryEmail } from "../utils/sendDeliveryEmail.js";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// /**
//  * ============================
//  * Create Razorpay Order
//  * ============================
//  * 🔒 Uses FINAL amount from DB
//  */
// export const createOrder = async (req, res) => {
//   try {
//     const { orderId } = req.body; // access_token

//     if (!orderId) {
//       return res.status(400).json({ error: "orderId is required" });
//     }

//     const [[order]] = await pool.query(
//       `
//       SELECT amount
//       FROM orders
//       WHERE access_token = ?
//       `,
//       [orderId]
//     );

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     const razorpayOrder = await razorpay.orders.create({
//       amount: order.amount * 100, // paise
//       currency: "INR",
//       receipt: `ord_${orderId.slice(0, 8)}`,
//     });

//     res.json({
//       razorpayOrderId: razorpayOrder.id,
//       amount: order.amount, // rupees
//     });
//   } catch (err) {
//     console.error("CREATE ORDER ERROR:", err);
//     res.status(500).json({ error: "Failed to create payment order" });
//   }
// };

// /**
//  * ============================
//  * Verify Razorpay Payment
//  * ============================
//  * 🔐 ONLY unlocks on valid signature
//  * 🚫 Cancel / dismiss does nothing
//  */
// export const verifyPayment = async (req, res) => {
//   const connection = await pool.getConnection();

//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       orderId, // access_token
//     } = req.body;

//     /* ❌ Cancel / dismiss case */
//     if (
//       !razorpay_order_id ||
//       !razorpay_payment_id ||
//       !razorpay_signature ||
//       !orderId
//     ) {
//       return res.status(400).json({
//         error: "Payment not completed",
//       });
//     }

//     /* 🔐 Verify Razorpay signature */
//     const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(payload)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({
//         error: "Invalid payment signature",
//       });
//     }

//     await connection.beginTransaction();

//     /* 🔒 Lock order row */
//     const [[order]] = await connection.query(
//       `
//       SELECT
//         id,
//         email,
//         payment_status,
//         delivery_url
//       FROM orders
//       WHERE access_token = ?
//       FOR UPDATE
//       `,
//       [orderId]
//     );

//     if (!order) {
//       await connection.rollback();
//       return res.status(404).json({ error: "Order not found" });
//     }

//     /* 🔁 Idempotency guard */
//     if (order.payment_status === "paid") {
//       await connection.rollback();
//       return res.json({ success: true });
//     }

//     /* ❌ Video not uploaded yet */
//     if (!order.delivery_url) {
//       await connection.rollback();
//       return res.status(400).json({
//         error: "Video not uploaded yet",
//       });
//     }

//     /* ✅ Mark paid & unlock */
//     await connection.query(
//       `
//       UPDATE orders
//       SET
//         payment_status = 'paid',
//         payment_completed_at = NOW(),
//         delivery_unlocked = 1,
//         status = 'delivered'
//       WHERE id = ?
//       `,
//       [order.id]
//     );

//     await connection.commit();

//     /* 📩 Send FINAL delivery email (REAL DOWNLOAD LINK) */
//    await connection.commit();

// /* 📩 Send FINAL delivery email */
// try {
//   await sendDeliveryEmail({
//     email: order.email,
//     token: orderId,
//   });
// } catch (err) {
//   console.error("❌ DELIVERY EMAIL FAILED:", err);
// }

//     res.json({ success: true });
//   } catch (err) {
//     await connection.rollback();
//     console.error("VERIFY PAYMENT ERROR:", err);
//     res.status(500).json({ error: "Payment verification failed" });
//   } finally {
//     connection.release();
//   }
// };
// ----------------------------------------------------

import Razorpay from "razorpay";
import pool from "../db.js";
import crypto from "crypto";
import { sendDeliveryEmail } from "../utils/sendDeliveryEmail.js";

/* =========================
   RAZORPAY INSTANCE
========================= */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

/* =========================
   CREATE RAZORPAY ORDER
========================= */
export const createOrder = async (req, res) => {
  try {
    const { orderId } = req.body; // access_token

    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }

    const [[order]] = await pool.query(
      `
      SELECT amount
      FROM orders
      WHERE access_token = ?
      `,
      [orderId]
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.amount * 100, // paise
      currency: "INR",
      receipt: `ord_${orderId.slice(0, 8)}`,
    });

    return res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: order.amount, // rupees
    });
  } catch (err) {
    console.error("❌ CREATE ORDER ERROR:", err);
    return res.status(500).json({ error: "Failed to create payment order" });
  }
};

/* =========================
   VERIFY PAYMENT
========================= */
export const verifyPayment = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId, // access_token
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({ error: "Payment not completed" });
    }

    /* 🔐 Verify signature */
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(payload)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    await connection.beginTransaction();

    const [[order]] = await connection.query(
      `
      SELECT id, email, payment_status, delivery_url
      FROM orders
      WHERE access_token = ?
      FOR UPDATE
      `,
      [orderId]
    );

    if (!order) {
      await connection.rollback();
      return res.status(404).json({ error: "Order not found" });
    }

    /* ✅ Idempotent success */
    if (order.payment_status === "paid") {
      await connection.rollback();
      return res.json({ success: true });
    }

    if (!order.delivery_url) {
      await connection.rollback();
      return res.status(400).json({ error: "Video not uploaded yet" });
    }

    /* ✅ Mark paid */
    await connection.query(
      `
      UPDATE orders
      SET
        payment_status = 'paid',
        payment_completed_at = NOW(),
        delivery_unlocked = 1,
        status = 'delivered'
      WHERE id = ?
      `,
      [order.id]
    );

    await connection.commit();

    /* 📩 Send delivery email (non-blocking) */
    try {
      await sendDeliveryEmail({
        email: order.email,
        token: orderId,
      });
    } catch (emailErr) {
      console.error("⚠️ DELIVERY EMAIL FAILED:", emailErr);
    }

    return res.json({ success: true });
  } catch (err) {
    await connection.rollback();
    console.error("❌ VERIFY PAYMENT ERROR:", err);
    return res.status(500).json({ error: "Payment verification failed" });
  } finally {
    connection.release();
  }
};

