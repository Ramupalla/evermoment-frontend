// import express from "express";
// import pool from "../db.js";
// import { sendEmail } from "../utils/sendEmail.js";

// const router = express.Router();

// /* =========================
//    CONTACT FORM (ORDER-LOCKED)
// ========================= */
// router.post("/", async (req, res) => {
//   try {
//     const { name, email, orderId, message } = req.body;

//     if (!name || !email || !orderId || !message) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // 🔒 Validate order ID
//     const [[order]] = await pool.query(
//       `
//       SELECT id, email
//       FROM orders
//       WHERE access_token = ?
//       `,
//       [orderId]
//     );

//     if (!order) {
//       return res.status(403).json({
//         error: "Invalid Order ID. Please check and try again.",
//       });
//     }

//     // 📧 Notify admin (or store later)
//     await sendEmail({
//       to: process.env.ADMIN_EMAIL,
//       subject: "📩 New EverMoment Contact Message",
//       html: `
//         <h3>New Message from Client</h3>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Order ID:</strong> ${orderId}</p>
//         <p><strong>Message:</strong></p>
//         <p>${message}</p>
//       `,
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("CONTACT FORM ERROR:", err);
//     res.status(500).json({ error: "Failed to send message" });
//   }
// });

// export default router;


import express from "express";
import pool from "../db.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, orderId, message } = req.body;

    if (!name || !email || !orderId || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [[order]] = await pool.query(
      "SELECT id FROM orders WHERE id = ?",
      [orderId]
    );

    if (!order) {
      return res.status(403).json({
        error: "Invalid Order ID. Please check and try again.",
      });
    }

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "📩 New EverMoment Contact Message",
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("CONTACT ERROR:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
