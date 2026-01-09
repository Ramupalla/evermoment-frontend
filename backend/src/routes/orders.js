// import express from "express";
// import pool from "../db.js";
// import { randomUUID, randomBytes } from "crypto";
// import { GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import s3 from "../s3.js";
// import { sendEmail } from "../utils/sendEmail.js";
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
//   return deliveryUrl.replace(/^s3:\/\/[^/]+\//, "");
// }
// router.post("/", async (req, res) => {
//   try {
//     const {
//       email,
//       whatsapp,
//       momentType,
//       specialBecause,
//       plan,
//       fastTrack
//     } = req.body;

//     if (!email || !whatsapp || !momentType || !plan) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const orderId = randomUUID();
//     const accessToken = randomBytes(32).toString("hex");

//     const baseAmount =
//       plan === "story" ? 149 :
//       plan === "basic" ? 399 :
//       799;

//     const fastTrackAmount = fastTrack ? 99 : 0;
//     const amount = baseAmount + fastTrackAmount;

//     await pool.query(
//       `
//       INSERT INTO orders
//       (id, email, whatsapp, moment_type, special_because, plan,
//        fast_track, base_amount, fast_track_amount, amount, access_token)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `,
//       [
//         orderId,
//         email,
//         whatsapp,
//         momentType,
//         specialBecause || null,
//         plan,
//         fastTrack ? 1 : 0,
//         baseAmount,
//         fastTrackAmount,
//         amount,
//         accessToken
//       ]
//     );

// // 🔔 Send order confirmation email (non-blocking but awaited)
// try {
//   await sendOrderConfirmationEmail({
//     email,
//     orderId,
//     plan,
//     fastTrack,
//     base_amount: baseAmount,
//     fast_track_amount: fastTrackAmount,
//   });
// } catch (err) {
//   console.error("ORDER CONFIRMATION EMAIL FAILED:", err);
//   // ❗ DO NOT throw — order is already created
// }


//     // 🔥 THIS IS CRITICAL
//     return res.status(201).json({
//       orderId,
//       accessToken
//     });

//   } catch (err) {
//     console.error("CREATE ORDER ERROR:", err);
//     return res.status(500).json({ error: "Failed to create order" });
//   }
// });

// /* =========================
//    ACCESS ORDER (CLIENT)
// ========================= */
// router.get("/access/:token", async (req, res) => {
//   try {
//     const { token } = req.params;

//     const [rows] = await pool.query(
//       `
//       SELECT
//         id,
//         status,
//         plan,
//         fast_track AS fastTrack,
//         base_amount,
//         fast_track_amount,
//         amount,
//         payment_status,
//         delivery_unlocked,
//         created_at
//       FROM orders
//       WHERE access_token = ?
//       `,
//       [token]
//     );

//     if (!rows.length) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     // ✅ JUST RETURN DATA — NO EMAILS HERE
//     return res.json(rows[0]);

//   } catch (err) {
//     console.error("ACCESS ORDER ERROR:", err);
//     return res.status(500).json({ error: "Failed to fetch order" });
//   }
// });


// /* =========================
//    SEND FINAL DELIVERY EMAIL
// ========================= */
// router.post("/send-download", async (req, res) => {
//   try {
//     const { token } = req.body;

//     const [[order]] = await pool.query(
//       `
//       SELECT email, payment_status, delivery_unlocked
//       FROM orders
//       WHERE access_token = ?
//       `,
//       [token]
//     );

//     if (!order || order.payment_status !== "paid" || !order.delivery_unlocked) {
//       return res.status(403).json({ error: "Delivery not allowed" });
//     }

//     // const downloadLink = `${process.env.BACKEND_URL}/api/orders/${token}/download`;
// const BASE_URL = process.env.PUBLIC_SITE_URL || process.env.BACKEND_URL;

// if (!BASE_URL) {
//   throw new Error("PUBLIC_SITE_URL is not configured");
// }

// const downloadLink = `${BASE_URL}/api/orders/${token}/download`;


//     await sendEmail({
//       to: order.email,
// subject: "🎉 Your EverMoment Memory ✨ Is Ready",
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

//     <p style="font-size: 14px; color: #6b7280;">
//       If you have any questions or need assistance, feel free to reply to this email —
//       we’re always happy to help.
//     </p>

//     <p style="margin-top: 28px; font-size: 15px;">
//       With warmth,<br />
//       <strong>Team EverMoment</strong> 🤍
//     </p>

//     <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
//       ⭐ Tip: Star this email to keep your download link handy for the future.
//     </p>
//   </div>
// `,

//     });

//     return res.json({ success: true });
//   } catch (err) {
//     console.error("SEND DOWNLOAD ERROR:", err);
//     return res.status(500).json({ error: "Failed to send download link" });
//   }
// });

// /* =========================
//    SECURE DOWNLOAD
// ========================= */
// router.get("/:token/download", async (req, res) => {
//   try {
//     const { token } = req.params;

//     const [[order]] = await pool.query(
//       `
//       SELECT delivery_url, payment_status, delivery_unlocked
//       FROM orders
//       WHERE access_token = ?
//       `,
//       [token]
//     );

//     if (!order) return res.status(404).send("Order not found");
//     if (order.payment_status !== "paid" || !order.delivery_unlocked)
//       return res.status(403).send("Download not allowed");
//     if (!order.delivery_url)
//       return res.status(404).send("File not available");

//     const s3Key = extractS3Key(order.delivery_url);

//     const command = new GetObjectCommand({
//       Bucket: process.env.AWS_S3_BUCKET,
//       Key: s3Key,
//       ResponseContentDisposition: "attachment",
//     });

//     const signedUrl = await getSignedUrl(s3, command, { expiresIn: 600 });
//     return res.redirect(signedUrl);
//   } catch (err) {
//     console.error("DOWNLOAD ERROR:", err);
//     return res.status(500).send("Download failed");
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
import { sendAdminNewOrderEmail } from "../utils/sendAdminNewOrderEmail.js";


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

const OFFERS_ENABLED = true;

const OFFER_DISCOUNT_PERCENT = 50; // Flat 50% OFF


/* =========================
   HELPERS
========================= */
function applyOffer(amount) {
  if (!OFFERS_ENABLED) return amount;

  const discounted = Math.round(amount * (1 - OFFER_DISCOUNT_PERCENT / 100));

  // Prevent ₹0 edge case
  return Math.max(discounted, 1);
}



function extractS3Key(deliveryUrl) {
  if (!deliveryUrl) return null;
  return deliveryUrl.replace(/^s3:\/\/[^/]+\//, "");
}

function getPublicBaseUrl() {
  const base =
    process.env.PUBLIC_SITE_URL || process.env.BACKEND_URL;

  if (!base) {
    throw new Error("PUBLIC_SITE_URL or BACKEND_URL must be configured");
  }
  return base;
}

/* =========================
   CREATE ORDER
========================= */
router.post("/", async (req, res) => {
  try {
    const {
      email,
      whatsapp,
      momentType,
      specialBecause,
      plan,
      fastTrack,
    } = req.body;

    /* ---- Validation ---- */
    if (!email || !whatsapp || !momentType || !plan) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!PLAN_PRICING[plan]) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    /* ---- Safe pricing ---- */
    const safeFastTrack =
      FAST_TRACK_ENABLED && plan === "story" && fastTrack === true;

//     // const baseAmount = PLAN_PRICING[plan];
//     // const fastTrackAmount = safeFastTrack ? FAST_TRACK_PRICE : 0;
//     // const amount = baseAmount + fastTrackAmount;

// const originalBaseAmount = PLAN_PRICING[plan];
// const fastTrackAmount = safeFastTrack ? FAST_TRACK_PRICE : 0;

// // 🎁 Apply offer only on base plan
// const discountedBaseAmount = applyOffer(originalBaseAmount);

// // Final payable amount
// const amount = discountedBaseAmount + fastTrackAmount;

const originalBaseAmount = PLAN_PRICING[plan];
const fastTrackAmount = safeFastTrack ? FAST_TRACK_PRICE : 0;

// 🎁 Apply offer only on base plan
const discountedBaseAmount = applyOffer(originalBaseAmount);

// Final payable amount
const amount = discountedBaseAmount + fastTrackAmount;



    const orderId = randomUUID();
    const accessToken = randomBytes(32).toString("hex");

    /* ---- Insert order ---- */
    // await pool.query(
    //   `
    //   INSERT INTO orders
    //   (
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
    //     access_token
    //   )
    //   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    //   `,
    //   [
    //     orderId,
    //     email,
    //     whatsapp,
    //     momentType,
    //     specialBecause || null,
    //     plan,
    //     safeFastTrack ? 1 : 0,
    //     baseAmount,
    //     fastTrackAmount,
    //     amount,
    //     accessToken,
    //   ]
    // );

    await pool.query(
  `
  INSERT INTO orders
  (
    id, email, whatsapp, moment_type, special_because, plan,
    fast_track,
    original_base_amount,
    discounted_base_amount,
    base_amount,
    fast_track_amount,
    amount,
    access_token
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  [
    orderId,
    email,
    whatsapp,
    momentType,
    specialBecause || null,
    plan,
    safeFastTrack ? 1 : 0,

    originalBaseAmount,     // ✅ 149 / 399 / 799
    discountedBaseAmount,   // ✅ 79 / 199 / 399

    discountedBaseAmount,   // base_amount = payable base
    fastTrackAmount,
    amount,
    accessToken,
  ]
);


    /* ---- Send confirmation email (non-blocking) ---- */
    try {
    await sendAdminNewOrderEmail({
        orderId,
        plan,
        amount,
        fastTrack,
        email,
        whatsapp,
        createdAt: new Date(),
      });
      } catch (err) {
    console.error("Admin email failed:", err);
    }

// Client notification
    // try {
    //   await sendOrderConfirmationEmail({
    //     email,
    //     orderId,
    //     plan,
    //     fastTrack: safeFastTrack,
    //     base_amount: baseAmount,
    //     fast_track_amount: fastTrackAmount,
    //   });
    // } catch (err) {
    //   console.error("ORDER CONFIRMATION EMAIL FAILED:", err);
    // }

    // Client notification
try {
  await sendOrderConfirmationEmail({
    email,
    orderId,
    access_token: accessToken, // 🔥 REQUIRED FIX
    plan,
    fastTrack: safeFastTrack,
    // base_amount: baseAmount,
    base_amount: discountedBaseAmount,
    fast_track_amount: fastTrackAmount,
  });
} catch (err) {
  console.error("ORDER CONFIRMATION EMAIL FAILED:", err);
}


    return res.status(201).json({
      orderId,
      accessToken,
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
      SELECT
        email,
        payment_status,
        delivery_unlocked,
        delivery_email_sent
      FROM orders
      WHERE access_token = ?
      `,
      [token]
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.payment_status !== "paid" || !order.delivery_unlocked) {
      return res.status(403).json({ error: "Delivery not allowed" });
    }

    if (order.delivery_email_sent) {
      return res.json({ success: true, alreadySent: true });
    }

    const BASE_URL = getPublicBaseUrl();
    const downloadLink = `${BASE_URL}/api/orders/${token}/download`;

    await sendEmail({
      to: order.email,
      subject: "🎉 Final Delivery – Your EverMoment Memory Is Ready",
      headers: {
        "X-Entity-Ref-ID": `evermoment-delivery-${token}`,
      },
      html: `
        <div style="font-family: Arial, sans-serif; padding: 32px;">
          <h2>Your EverMoment is Ready 🎉</h2>
          <p>Your memory has been carefully crafted and is ready to download.</p>

          <a href="${downloadLink}" target="_blank"
             style="display:inline-block;margin-top:20px;
             padding:14px 28px;background:#111827;color:#fff;
             border-radius:8px;text-decoration:none;font-weight:600;">
            ⬇️ Download Your EverMoment
          </a>

          <p style="margin-top:24px;color:#555;">
            Please save this email for future access.
          </p>

          <p style="margin-top:32px;">— Team EverMoment 🤍</p>
        </div>
      `,
    });

    await pool.query(
      `UPDATE orders SET delivery_email_sent = 1 WHERE access_token = ?`,
      [token]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("SEND DOWNLOAD ERROR:", err);
    return res.status(500).json({ error: "Failed to send delivery email" });
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

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 600,
    });

    return res.redirect(signedUrl);
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    return res.status(500).send("Download failed");
  }
});

export default router;
