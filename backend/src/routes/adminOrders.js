// import express from "express";
// import pool from "../db.js";
// import { sendEmail } from "../utils/sendEmail.js";


// const router = express.Router();

// /**
//  * =========================
//  * Admin: Get all orders
//  * GET /api/admin/orders
//  * =========================
//  */
// router.get("/", async (req, res) => {
  
//   try {
//     const [rows] = await pool.query(`
//       SELECT
//         id,
//         plan,
//         status,
//         payment_status,
//         delivery_url
//       FROM orders
//       ORDER BY created_at DESC
//     `);

//     res.json(rows);
//   } catch (err) {
//     console.error("FETCH ADMIN ORDERS ERROR:", err);
//     res.status(500).json({ error: "Failed to fetch orders" });
//   }
// });

// /**
//  * =========================
//  * Admin: Upload final video
//  * POST /api/admin/orders/:orderId/upload
//  * =========================
//  */
// router.post("/:orderId/upload", async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { deliveryUrl } = req.body;

//     if (!deliveryUrl) {
//       return res.status(400).json({ error: "deliveryUrl is required" });
//     }

//     const [result] = await pool.query(
//       `
//       UPDATE orders
//       SET
//         delivery_url = ?,
//         status = 'uploaded'
//       WHERE id = ?
//       `,
//       [deliveryUrl, orderId]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     res.json({
//       success: true,
//       message: "Final video uploaded & order marked as uploaded",
//     });
//   } catch (err) {
//     console.error("UPLOAD FINAL VIDEO ERROR:", err);
//     res.status(500).json({ error: "Failed to save delivery URL" });
//   }
// });

// /**
//  * =========================
//  * Admin: Send payment link
//  * POST /api/admin/orders/:orderId/send-payment-link
//  * ⚠️ MUST be before "/:orderId"
//  * =========================
//  */
// router.post("/:orderId/send-payment-link", async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const [rows] = await pool.query(
//       `
//       SELECT
//         id,
//         email,
//         access_token,
//         status,
//         payment_status,
//         delivery_url,
//         payment_link
//       FROM orders
//       WHERE id = ?
//       `,
//       [orderId]
//     );

//     if (!rows.length) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     const order = rows[0];

//     if (!order.delivery_url) {
//       return res.status(400).json({
//         error: "Final video not uploaded yet",
//       });
//     }

//     if (order.payment_status === "paid") {
//       return res.status(400).json({
//         error: "Payment already completed",
//       });
//     }

//     const paymentLink =
//       order.payment_link ||
//       `${process.env.FRONTEND_URL}/payment/${order.access_token}`;

//     if (!order.payment_link || order.status !== "ready_for_payment") {
//       await pool.query(
//         `
//         UPDATE orders
//         SET
//           payment_link = ?,
//           status = 'ready_for_payment'
//         WHERE id = ?
//         `,
//         [paymentLink, order.id]
//       );
//     }

//     if (order.email) {
//       await sendEmail({
//   to: order.email,
//   subject: "🎉 Your EverMoment is Ready — Unlock Your Memory",
//   html: `
//   <div style="
//     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
//     background: #ffffff;
//     color: #111827;
//     padding: 32px;
//     line-height: 1.6;
//   ">
//     <h2 style="margin-bottom: 12px;">
//       Your EverMoment is Ready 🎉
//     </h2>

//     <p style="font-size: 15px; color: #374151;">
//       We’ve carefully crafted your special memory with emotion, detail,
//       and love — it’s now ready for you.
//     </p>

//     <div style="
//       margin: 28px 0;
//       padding: 20px;
//       background: #f9fafb;
//       border: 1px solid #e5e7eb;
//       border-radius: 12px;
//     ">
//       <p style="margin: 0 0 12px 0; font-size: 14px; color: #374151;">
//         🔒 <strong>One final step:</strong> Complete payment to unlock your
//         secure download link.
//       </p>

//       <a
//         href="${paymentLink}"
//         target="_blank"
//         rel="noopener noreferrer"
//         style="
//           display: inline-block;
//           margin-top: 12px;
//           padding: 14px 26px;
//           background: #111827;
//           color: #ffffff;
//           text-decoration: none;
//           border-radius: 8px;
//           font-weight: 600;
//           letter-spacing: 0.2px;
//         "
//       >
//         💳 Pay & Unlock Your EverMoment
//       </a>
//     </div>

//     <p style="font-size: 14px; color: #6b7280;">
//       Once payment is complete, you’ll instantly get access to download
//       your video — no waiting.
//     </p>

//     <hr style="
//       border: none;
//       border-top: 1px solid #e5e7eb;
//       margin: 32px 0;
//     " />

//     <p style="font-size: 15px; color: #374151;">
//       Thank you for trusting <strong>EverMoment</strong> to turn your moments
//       into lasting memories.
//     </p>

//     <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">
//   If you have any questions or need assistance, feel free to
//   <a
//     href="https://www.evermomentstudio.online/contact"
//     target="_blank"
//     rel="noopener noreferrer"
//     style="
//       color: #111827;
//       font-weight: 600;
//       text-decoration: underline;
//     "
//   >
//     send us a message
//   </a>
//   — we’re always happy to help.
// </p>


//     <p style="margin-top: 28px; font-size: 15px;">
//       With warmth,<br />
//       <strong>Team EverMoment</strong> 🤍
//     </p>

//     <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
//       💡 Tip: Star this email so you can easily find your payment link later.
//     </p>
//   </div>
//   `,
// });

//     }

//     res.json({
//       success: true,
//       payment_link: paymentLink,
//       message: "Payment link sent successfully",
//     });
//   } catch (err) {
//     console.error("SEND PAYMENT LINK ERROR:", err);
//     res.status(500).json({ error: "Failed to send payment link" });
//   }
// });

// /**
//  * =========================
//  * Admin: Resend delivery link
//  * POST /api/admin/orders/:orderId/resend
//  * =========================
//  */
// router.post("/:orderId/resend", async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { channel } = req.body; // "email" | "whatsapp" | "both"

//     const [[order]] = await pool.query(
//       `
//       SELECT
//         email,
//         whatsapp,
//         delivery_url,
//         payment_status,
//         delivery_unlocked
//       FROM orders
//       WHERE id = ?
//       `,
//       [orderId]
//     );

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     if (order.payment_status !== "paid" || !order.delivery_unlocked) {
//       return res.status(400).json({
//         error: "Order not paid or delivery not unlocked",
//       });
//     }

//     if (!order.delivery_url) {
//       return res.status(400).json({
//         error: "Delivery URL missing",
//       });
//     }

//     /* 📧 Email resend */
//     if ((channel === "email" || channel === "both") && order.email) {
//       await sendEmail({
//         to: order.email,
// subject: "🎉 Your EverMoment Memory ✨ Is Ready To Relive",
// html: `
//   <div style="
//     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
//     padding: 32px;
//     background: #ffffff;
//     color: #111827;
//     line-height: 1.6;
//   ">
//     <h2 style="margin-bottom: 12px;">
//       Your EverMoment is Ready 🎉
//     </h2>

//     <p style="font-size: 15px; color: #374151;">
//       Your memories have been carefully crafted with attention, emotion,
//       and detail — and they’re now ready to be relived.
//     </p>

//     <div style="margin: 28px 0;">
//       <a
//         href="${downloadLink}"
//         target="_blank"
//         rel="noopener noreferrer"
//         style="
//           display: inline-block;
//           padding: 14px 28px;
//           background: #111827;
//           color: #ffffff;
//           text-decoration: none;
//           border-radius: 8px;
//           font-weight: 600;
//           letter-spacing: 0.2px;
//         "
//       >
//         ⬇️ Download Your EverMoment
//       </a>
//     </div>

//     <p style="font-size: 14px; color: #6b7280;">
//       This is your secure download link.
//       You can access it anytime after completing payment.
//     </p>

//     <hr style="
//       border: none;
//       border-top: 1px solid #e5e7eb;
//       margin: 32px 0;
//     " />

//     <p style="font-size: 15px; color: #374151;">
//       Thank you for trusting <strong>EverMoment</strong> to turn your
//       moments into memories that last.
//     </p>

//     <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">
//   If you have any questions or need assistance, feel free to
//   <a
//     href="https://www.evermomentstudio.online/contact"
//     target="_blank"
//     rel="noopener noreferrer"
//     style="
//       color: #111827;
//       font-weight: 600;
//       text-decoration: underline;
//     "
//   >
//      send us a message
//   </a>
//   — we’re always happy to help.
// </p>


//     <p style="margin-top: 28px; font-size: 15px;">
//       With warmth,<br />
//       <strong>Team EverMoment</strong> 🤍
//     </p>

//     <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
//       ⭐ Tip: Star this email to keep your download link handy for the future.
//     </p>
//   </div>
// `,

//       });
//     }

//     /* 📲 WhatsApp placeholder */
//     if (channel === "whatsapp" || channel === "both") {
//       console.log(
//         `WhatsApp resend queued for ${order.whatsapp}: ${order.delivery_url}`
//       );
//     }

//     res.json({ success: true });
//   } catch (err) {
//     console.error("ADMIN RESEND ERROR:", err);
//     res.status(500).json({ error: "Failed to resend delivery" });
//   }
// });

// /**
//  * =========================
//  * Admin: Get single order
//  * GET /api/admin/orders/:orderId
//  * ⚠️ MUST be last
//  * =========================
//  */
// router.get("/:orderId", async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const [rows] = await pool.query(
//       `SELECT * FROM orders WHERE id = ?`,
//       [orderId]
//     );

//     if (!rows.length) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     res.json(rows[0]);
//   } catch (err) {
//     console.error("FETCH ORDER DETAILS ERROR:", err);
//     res.status(500).json({ error: "Failed to fetch order details" });
//   }
// });

// export default router;


// #----------------------------------------------------------------------


import express from "express";
import pool from "../db.js";
import { sendEmail } from "../utils/sendEmail.js";
import { tagOrderFilesAsDelivered } from "../s3.js";

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
        delivery_url,
        created_at
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
      message: "Final video uploaded successfully",
    });
  } catch (err) {
    console.error("UPLOAD FINAL VIDEO ERROR:", err);
    res.status(500).json({ error: "Failed to upload final video" });
  }
});

/**
 * =========================
 * Admin: Send payment link
 * POST /api/admin/orders/:orderId/send-payment-link
 * =========================
 */
router.post("/:orderId/send-payment-link", async (req, res) => {
  try {
    const { orderId } = req.params;

    const [[order]] = await pool.query(
      `
      SELECT
        id,
        email,
        access_token,
        payment_status,
        delivery_url,
        payment_link
      FROM orders
      WHERE id = ?
      `,
      [orderId]
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (!order.delivery_url) {
      return res.status(400).json({ error: "Final video not uploaded yet" });
    }

    if (order.payment_status === "paid") {
      return res.status(400).json({ error: "Payment already completed" });
    }

    const paymentLink =
      order.payment_link ||
      `${process.env.FRONTEND_URL}/payment/${order.access_token}`;

    await pool.query(
      `
      UPDATE orders
      SET
        payment_link = ?,
        status = 'ready_for_payment'
      WHERE id = ?
      `,
      [paymentLink, orderId]
    );

    if (order.email) {
      // await sendEmail({
      //   to: order.email,
      //   subject: "🎉 Your EverMoment is Ready — Unlock Your Memory",
      //   html: `
      //     <p>Your EverMoment is ready.</p>
      //     <p><a href="${paymentLink}">Pay & Unlock Your Video</a></p>
      //   `,
      // });
      await sendEmail({
  to: order.email,
  subject: "🎉 Your EverMoment Memory ✨ Is Ready to Unlock",
  html: `
    <div style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      padding: 32px;
      background: #ffffff;
      color: #111827;
      line-height: 1.6;
    ">
      <h2 style="margin-bottom: 12px;">
        Your EverMoment is Ready 🎉
      </h2>

      <p style="font-size: 15px; color: #374151;">
        Your memories have been carefully crafted with attention, emotion,
        and detail. Your video is ready — just one final step to unlock it.
      </p>

      <div style="margin: 28px 0;">
        <a
          href="${paymentLink}"
          target="_blank"
          rel="noopener noreferrer"
          style="
            display: inline-block;
            padding: 14px 28px;
            background: #111827;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            letter-spacing: 0.2px;
          "
        >
          🔓 Pay & Unlock Your EverMoment
        </a>
      </div>

      <p style="font-size: 14px; color: #6b7280;">
        This is a secure payment link. Once payment is completed,
        your download will be unlocked instantly.
      </p>

      <hr style="
        border: none;
        border-top: 1px solid #e5e7eb;
        margin: 32px 0;
      " />

      <p style="font-size: 15px; color: #374151;">
        Thank you for trusting <strong>EverMoment</strong> to turn your
        moments into memories that last.
      </p>

      <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">
        If you have any questions or need assistance, feel free to
        <a
          href="https://www.evermomentstudio.online/contact"
          target="_blank"
          rel="noopener noreferrer"
          style="
            color: #111827;
            font-weight: 600;
            text-decoration: underline;
          "
        >
          send us a message
        </a>
        — we’re always happy to help.
      </p>

      <p style="margin-top: 28px; font-size: 15px;">
        With warmth,<br />
        <strong>Team EverMoment</strong> 🤍
      </p>

      <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
        🔒 Your payment is safe & secure. Access is granted immediately after completion.
      </p>
    </div>
  `,
});

    }

    res.json({ success: true, payment_link: paymentLink });
  } catch (err) {
    console.error("SEND PAYMENT LINK ERROR:", err);
    res.status(500).json({ error: "Failed to send payment link" });
  }
});

/**
 * =========================
 * Admin: Mark order as delivered (CRITICAL)
 * POST /api/admin/orders/:orderId/mark-delivered
 * =========================
 */
router.post("/:orderId/mark-delivered", async (req, res) => {
  try {
    const { orderId } = req.params;

    const [[order]] = await pool.query(
      `
      SELECT
        payment_status,
        delivery_url
      FROM orders
      WHERE id = ?
      `,
      [orderId]
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    if (!order.delivery_url) {
      return res.status(400).json({ error: "Delivery URL missing" });
    }

    // ✅ Mark delivered in DB
    await pool.query(
      `
      UPDATE orders
      SET
        status = 'delivered',
        delivery_unlocked = 1,
        delivered_at = NOW()
      WHERE id = ?
      `,
      [orderId]
    );

    // 🧹 TAG RAW FILES AS DELIVERED (for S3 lifecycle cleanup)
    await tagOrderFilesAsDelivered(orderId);

    res.json({
      success: true,
      message: "Order marked as delivered and raw files tagged",
    });
  } catch (err) {
    console.error("MARK DELIVERED ERROR:", err);
    res.status(500).json({ error: "Failed to mark order as delivered" });
  }
});

/**
 * =========================
 * Admin: Get single order
 * GET /api/admin/orders/:orderId
 * =========================
 */
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const [[order]] = await pool.query(
      `SELECT * FROM orders WHERE id = ?`,
      [orderId]
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("FETCH ORDER DETAILS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

export default router;
