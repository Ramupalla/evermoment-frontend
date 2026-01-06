// import express from "express";
// import pool from "../db.js";
// import { sendEmail } from "../utils/sendEmail.js";

// const router = express.Router();

// router.post("/contact", async (req, res) => {
//   try {
//     const { name, email, orderId, message } = req.body;

//     if (!name || !email || !orderId || !message) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // ✅ Validate Order ID
//     const [orders] = await pool.query(
//       "SELECT id FROM orders WHERE id = ? LIMIT 1",
//       [orderId]
//     );

//     if (orders.length === 0) {
//       return res.status(404).json({
//         error: "Invalid Order ID. Please check and try again.",
//       });
//     }

//     // Continue with email / DB logic
//     await sendContactEmail({ name, email, orderId, message });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("CONTACT ERROR:", err);
//     res.status(500).json({ error: "Something went wrong" });
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

    // ✅ Validate Order ID
    const [orders] = await pool.query(
      "SELECT id FROM orders WHERE id = ? LIMIT 1",
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        error: "Invalid Order ID. Please check and try again.",
      });
    }

    // 📩 Send email to support
    await sendEmail({
      to: "evermomentstudio912@gmail.com",
      replyTo: email,
      subject: `New Message from client 📩`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px;">
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("CONTACT ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
