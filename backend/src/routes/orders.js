// import express from "express";
// import pool from "../db.js";
// import { randomUUID, randomBytes } from "crypto";
// import { sendEmail } from "../utils/sendEmail.js";
// import { GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import s3 from "../s3.js";
// import { sendOrderConfirmationEmail } from "../utils/sendOrderConfirmationEmail.js";


// const router = express.Router();

// /* =========================
//    CONFIG
// ========================= */
// const FAST_TRACK_ENABLED = true;

// const PLAN_PRICING = {
//   story: 149,
//   basic: 399,
//   premium: 799,
// };

// const FAST_TRACK_PRICE = 99;

// /* =========================
//    HELPERS
// ========================= */
// function extractS3Key(deliveryUrl) {
//   if (!deliveryUrl) return null;
//   // Works even if bucket is "undefined"
//   return deliveryUrl.replace(/^s3:\/\/[^/]+\//, "");
// }

// /* =========================
//    CREATE ORDER
// ========================= */
// // router.post("/", async (req, res) => {
// //   try {
// //     const {
// //       email,
// //       whatsapp,
// //       momentType,
// //       plan,
// //       fastTrack = false,
// //     } = req.body;

// //     if (!email || !whatsapp || !PLAN_PRICING[plan]) {
// //       return res.status(400).json({ error: "Invalid order data" });
// //     }

// //     const baseAmount = PLAN_PRICING[plan];

// //     const fastTrackAllowed =
// //       FAST_TRACK_ENABLED && fastTrack === true && plan === "story";

// //     const fastTrackAmount = fastTrackAllowed ? FAST_TRACK_PRICE : 0;
// //     const amount = baseAmount + fastTrackAmount;

// //     const orderId = randomUUID();
// //     const accessToken = randomBytes(32).toString("hex");

// //     await pool.query(
// //       `
// //       INSERT INTO orders (
// //         id,
// //         email,
// //         whatsapp,
// //         moment_type,
// //         plan,
// //         fast_track,
// //         base_amount,
// //         fast_track_amount,
// //         amount,
// //         status,
// //         payment_status,
// //         delivery_unlocked,
// //         access_token
// //       )
// //       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'created', 'pending', 0, ?)
// //       `,
// //       [
// //         orderId,
// //         email,
// //         whatsapp,
// //         momentType,
// //         plan,
// //         fastTrackAllowed ? 1 : 0,
// //         baseAmount,
// //         fastTrackAmount,
// //         amount,
// //         accessToken,
// //       ]
// //     );

// //     res.status(201).json({
// //       message: "Order created",
// //       accessToken,
// //       amount,
// //     });
// //   } catch (err) {
// //     console.error("ORDER CREATE ERROR:", err);
// //     res.status(500).json({ error: "Failed to create order" });
// //   }

// //   // 📧 Send order confirmation email (non-blocking)
// // sendOrderConfirmationEmail({
// //   email,
// //   orderId,
// //   plan,
// //   fastTrack: fastTrackAllowed,
// // }).catch(err =>
// //   console.error("ORDER CONFIRMATION EMAIL FAILED:", err.message)
// // );

// // });



// router.post("/", async (req, res) => {
//   try {
//     const {
//       email,
//       whatsapp,
//       momentType,
//       specialBecause,
//       plan,
//       fastTrack = false,
//     } = req.body;


//     if (!email || !whatsapp || !momentType || !PLAN_PRICING[plan]) {
//   return res.status(400).json({ error: "Invalid order data" });
// }



//     const baseAmount = PLAN_PRICING[plan];

//     const fastTrackAllowed =
//       FAST_TRACK_ENABLED && fastTrack === true && plan === "story";

//     const fastTrackAmount = fastTrackAllowed ? FAST_TRACK_PRICE : 0;
//     const amount = baseAmount + fastTrackAmount;

//     const orderId = randomUUID();
//     const accessToken = randomBytes(32).toString("hex");

// await pool.query(
//   `
//   INSERT INTO orders (
//     id,
//     email,
//     whatsapp,
//     moment_type,
//     special_because,
//     plan,
//     fast_track,
//     base_amount,
//     fast_track_amount,
//     amount,
//     status,
//     payment_status,
//     delivery_unlocked,
//     access_token
//   )
//   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'created', 'pending', 0, ?)
//   `,
//   [
//     orderId,
//     email,
//     whatsapp,
//     momentType,
//     specialBecause || null, // ✅ FIXED
//     plan,
//     fastTrackAllowed ? 1 : 0,
//     baseAmount,
//     fastTrackAmount,
//     amount,
//     accessToken,
//   ]
// );


//     // 📧 SEND ORDER CONFIRMATION EMAIL (NON-BLOCKING)
//     sendOrderConfirmationEmail({
//   email,
//   orderId,
//   plan,
//   fastTrack: fastTrackAllowed,
//   base_amount: baseAmount,
//   fast_track_amount: fastTrackAmount,
// }).catch(err =>
//       console.error("ORDER CONFIRMATION EMAIL FAILED:", err.message)
//     );

//     // ✅ Respond to client
//     // res.status(201).json({
//     //   message: "Order created",
//     //   accessToken,
//     //   amount,
//     // });
//     res.status(201).json({
//     message: "Order created",
//     accessToken,
//     orderId, // 👈 ADD THIS
//     amount,
//   });

//   } catch (err) {
//     console.error("ORDER CREATE ERROR:", err);
//     res.status(500).json({ error: "Failed to create order" });
//   }
  
// });


// /* =========================
//    ACCESS ORDER (CLIENT)
// ========================= */
// router.get("/access/:token", async (req, res) => {
//   const { token } = req.params;

//   const [rows] = await pool.query(
//     `
//     SELECT
//   id,
//   status,
//   plan,
//   fast_track AS fastTrack,
//   base_amount,
//   fast_track_amount,
//   amount,
//   payment_status,
//   delivery_unlocked,
//   created_at
// FROM orders
// WHERE access_token = ?
//     `,
//     [token]
//   );

//   if (!rows.length) {
//     return res.status(404).json({ error: "Order not found" });
//   }

//   res.json(rows[0]);
// });

// /* =========================
//    SEND FINAL DELIVERY EMAIL
// ========================= */
// router.post("/send-download", async (req, res) => {
//   try {
//     const { token } = req.body;

//     const [[order]] = await pool.query(
//       `
//       SELECT
//         email,
//         payment_status,
//         delivery_unlocked
//       FROM orders
//       WHERE access_token = ?
//       `,
//       [token]
//     );

//     if (!order || order.payment_status !== "paid" || !order.delivery_unlocked) {
//       return res.status(403).json({ error: "Delivery not allowed" });
//     }

//     const downloadLink = `${process.env.BACKEND_URL}/api/orders/${token}/download`;

//     await sendEmail({
//       to: order.email,
//       subject: "🎉 Your EverMoment is ready to download",
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px;">
//           <h2>Your EverMoment is Ready ❤️</h2>
//           <p>Your video has been carefully crafted and is ready for download.</p>
//           <a
//             href="${downloadLink}"
//             target="_blank"
//             style="
//               display:inline-block;
//               margin-top:16px;
//               padding:14px 26px;
//               background:#000;
//               color:#fff;
//               text-decoration:none;
//               border-radius:6px;
//               font-weight:bold;
//             "
//           >
//             ⬇️ Download Your EverMoment
//           </a>
//           <p style="margin-top:24px;color:#666;">
//             This secure link works only after payment.
//           </p>
//         </div>
//       `,
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("SEND DOWNLOAD ERROR:", err);
//     res.status(500).json({ error: "Failed to send download link" });
//   }
// });

// /* =========================
//    SECURE DOWNLOAD GATEWAY
// ========================= */
// router.get("/:token/download", async (req, res) => {
//   try {
//     const { token } = req.params;

//     const [[order]] = await pool.query(
//       `
//       SELECT
//         delivery_url,
//         payment_status,
//         delivery_unlocked
//       FROM orders
//       WHERE access_token = ?
//       `,
//       [token]
//     );

//     if (!order) {
//       return res.status(404).send("Order not found");
//     }

//     if (order.payment_status !== "paid" || !order.delivery_unlocked) {
//       return res.status(403).send("Download not allowed");
//     }

//     if (!order.delivery_url) {
//       return res.status(404).send("File not available");
//     }

//     const s3Key = extractS3Key(order.delivery_url);

//     const command = new GetObjectCommand({
//       Bucket: process.env.AWS_S3_BUCKET,
//       Key: s3Key,
//       ResponseContentDisposition: "attachment",
//     });

//     const signedUrl = await getSignedUrl(s3, command, {
//       expiresIn: 60 * 10, // 10 minutes
//     });

//     return res.redirect(signedUrl);
//   } catch (err) {
//     console.error("DOWNLOAD ERROR:", err);
//     res.status(500).send("Download failed");
//   }
// });

// export default router;


import express from "express";
import pool from "../db.js";
import { randomUUID, randomBytes } from "crypto";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../s3.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendOrderConfirmationEmail } from "../utils/sendOrderConfirmationEmail.js";

const router = express.Router();

/* =========================
   CONFIG
========================= */
const FAST_TRACK_ENABLED = true;

const PLAN_PRICING = {
  story: 149,
  basic: 399,
  premium: 799,
};

const FAST_TRACK_PRICE = 99;

/* =========================
   HELPERS
========================= */
function extractS3Key(deliveryUrl) {
  if (!deliveryUrl) return null;
  return deliveryUrl.replace(/^s3:\/\/[^/]+\//, "");
}

/* =========================
   CREATE ORDER
========================= */
// router.post("/", async (req, res) => {
//   try {
//     const {
//       email,
//       whatsapp,
//       momentType,
//       specialBecause,
//       plan,
//       fastTrack = false,
//     } = req.body;

//     // 🔒 Validation
//     if (!email || !whatsapp || !momentType || !PLAN_PRICING[plan]) {
//       return res.status(400).json({
//         success: false,
//         error: "Invalid order data",
//       });
//     }

//     const baseAmount = PLAN_PRICING[plan];

//     const fastTrackAllowed =
//       FAST_TRACK_ENABLED && fastTrack === true && plan === "story";

//     const fastTrackAmount = fastTrackAllowed ? FAST_TRACK_PRICE : 0;
//     const amount = baseAmount + fastTrackAmount;

//     const orderId = randomUUID();
//     const accessToken = randomBytes(32).toString("hex");

//     await pool.query(
//       `
//       INSERT INTO orders (
//         id,
//         email,
//         whatsapp,
//         moment_type,
//         special_because,
//         plan,
//         fast_track,
//         base_amount,
//         fast_track_amount,
//         amount,
//         status,
//         payment_status,
//         delivery_unlocked,
//         access_token
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'created', 'pending', 0, ?)
//       `,
//       [
//         orderId,
//         email,
//         whatsapp,
//         momentType,
//         specialBecause || null,
//         plan,
//         fastTrackAllowed ? 1 : 0,
//         baseAmount,
//         fastTrackAmount,
//         amount,
//         accessToken,
//       ]
//     );

//     // 📧 Email (NON-BLOCKING – NEVER break response)
//     sendOrderConfirmationEmail({
//       email,
//       orderId,
//       plan,
//       fastTrack: fastTrackAllowed,
//       base_amount: baseAmount,
//       fast_track_amount: fastTrackAmount,
//     }).catch((err) =>
//       console.error("ORDER CONFIRMATION EMAIL FAILED:", err.message)
//     );

//     // ✅ ALWAYS return JSON
//     return res.status(201).json({
//       success: true,
//       message: "Order created",
//       orderId,
//       accessToken,
//       amount,
//     });
//   } catch (err) {
//     console.error("ORDER CREATE ERROR:", err);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to create order",
//     });
//   }
// });


router.post("/", async (req, res) => {
  try {
    const {
      email,
      whatsapp,
      momentType,
      specialBecause,
      plan,
      fastTrack
    } = req.body;

    if (!email || !whatsapp || !momentType || !plan) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const orderId = randomUUID();
    const accessToken = randomBytes(32).toString("hex");

    const baseAmount =
      plan === "story" ? 149 :
      plan === "basic" ? 399 :
      799;

    const fastTrackAmount = fastTrack ? 99 : 0;
    const amount = baseAmount + fastTrackAmount;

    await pool.query(
      `
      INSERT INTO orders
      (id, email, whatsapp, moment_type, special_because, plan,
       fast_track, base_amount, fast_track_amount, amount, access_token)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        orderId,
        email,
        whatsapp,
        momentType,
        specialBecause || null,
        plan,
        fastTrack ? 1 : 0,
        baseAmount,
        fastTrackAmount,
        amount,
        accessToken
      ]
    );

    // 🔥 THIS IS CRITICAL
    return res.status(201).json({
      orderId,
      accessToken
    });

  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return res.status(500).json({ error: "Failed to create order" });
  }
});


/* =========================
   ACCESS ORDER (CLIENT)
========================= */
router.get("/access/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        status,
        plan,
        fast_track AS fastTrack,
        base_amount,
        fast_track_amount,
        amount,
        payment_status,
        delivery_unlocked,
        created_at
      FROM orders
      WHERE access_token = ?
      `,
      [token]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }
    // 📧 Email (NON-BLOCKING – NEVER break response)
    sendOrderConfirmationEmail({
      email,
      orderId,
      plan,
      fastTrack: fastTrackAllowed,
      base_amount: baseAmount,
      fast_track_amount: fastTrackAmount,
    }).catch((err) =>
      console.error("ORDER CONFIRMATION EMAIL FAILED:", err.message)
    );

    return res.json(rows[0]);
  } catch (err) {
    console.error("ACCESS ORDER ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch order" });
  }
});

/* =========================
   SEND FINAL DELIVERY EMAIL
========================= */
router.post("/send-download", async (req, res) => {
  try {
    const { token } = req.body;

    const [[order]] = await pool.query(
      `
      SELECT email, payment_status, delivery_unlocked
      FROM orders
      WHERE access_token = ?
      `,
      [token]
    );

    if (!order || order.payment_status !== "paid" || !order.delivery_unlocked) {
      return res.status(403).json({ error: "Delivery not allowed" });
    }

    const downloadLink = `${process.env.BACKEND_URL}/api/orders/${token}/download`;

    await sendEmail({
      to: order.email,
      subject: "🎉 Your EverMoment is ready",
      html: `
        <h2>Your EverMoment is Ready ❤️</h2>
        <p>Your video is ready for download.</p>
        <a href="${downloadLink}">⬇️ Download</a>
      `,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("SEND DOWNLOAD ERROR:", err);
    return res.status(500).json({ error: "Failed to send download link" });
  }
});

/* =========================
   SECURE DOWNLOAD
========================= */
router.get("/:token/download", async (req, res) => {
  try {
    const { token } = req.params;

    const [[order]] = await pool.query(
      `
      SELECT delivery_url, payment_status, delivery_unlocked
      FROM orders
      WHERE access_token = ?
      `,
      [token]
    );

    if (!order) return res.status(404).send("Order not found");
    if (order.payment_status !== "paid" || !order.delivery_unlocked)
      return res.status(403).send("Download not allowed");
    if (!order.delivery_url)
      return res.status(404).send("File not available");

    const s3Key = extractS3Key(order.delivery_url);

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
      ResponseContentDisposition: "attachment",
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 600 });
    return res.redirect(signedUrl);
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    return res.status(500).send("Download failed");
  }
});

export default router;
