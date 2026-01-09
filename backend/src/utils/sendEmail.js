// import nodemailer from "nodemailer";

// /* =========================
//    SMTP TRANSPORT (GMAIL)
// ========================= */
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || "smtp.gmail.com",
//   port: 465,              // ✅ SSL port (most reliable)
//   secure: true,           // ✅ MUST be true for 465
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS, // App password
//   },

//    pool: true,
//   maxConnections: 1,
//   maxMessages: 50,
//   rateLimit: true,
// });

// /* =========================
//    VERIFY ON STARTUP
// ========================= */
// transporter.verify((err) => {
//   if (err) {
//     console.error("❌ SMTP VERIFY FAILED:", err.message);
//   } else {
//     console.log("✅ SMTP SERVER READY");
//   }
// });

// /* =========================
//    SEND EMAIL
// ========================= */
// export async function sendEmail({ to, subject, html }) {
//   console.log("📨 sendEmail() CALLED");
//   console.log({ to, subject });

//   try {
//     const info = await transporter.sendMail({
//       from: `"EverMoment 💛" <${process.env.SMTP_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log("✅ EMAIL SENT:", info.messageId);
//     return info;
//   } catch (err) {
//     console.error("❌ EMAIL SEND FAILED:", err.message);
//     throw err;
//   }
// }

// #---------------------------------------------------------

// import { Resend } from "resend";

// /* =========================
//    RESEND CLIENT
// ========================= */
// const resend = new Resend(process.env.RESEND_API_KEY);

// /* =========================
//    SEND EMAIL
// ========================= */
// export async function sendEmail({ to, subject, html }) {
//   console.log("📨 sendEmail() CALLED");
//   console.log({ to, subject });

//   try {
//     const result = await resend.emails.send({
//       from: process.env.EMAIL_FROM || "EverMoment <onboarding@resend.dev>",
//       to,
//       subject,
//       html,
//     });

//     console.log("✅ EMAIL SENT:", result.id);
//     return result;
//   } catch (err) {
//     console.error("❌ EMAIL SEND FAILED:", err);
//     throw err;
//   }
// }

// -------------------------------------------------------------------

// import { Resend } from "resend";

// /* =========================
//    RESEND CLIENT
// ========================= */
// const resend = new Resend(process.env.RESEND_API_KEY);

// /* =========================
//    SEND EMAIL (NON-BLOCKING)
// ========================= */
// export async function sendEmail({ to, subject, html }) {
//   console.log("📨 sendEmail() CALLED");
//   console.log({ to, subject });

//   try {
//     const result = await resend.emails.send({
//       from: process.env.EMAIL_FROM || "EverMoment <no-reply@evermomentstudio.online>",
//       to,
//       subject,
//       html,
//     });

//     // console.log("✅ EMAIL SENT:", result.id);
//     console.log("✅ EMAIL SENT:", result?.id || result?.data?.id || "OK");


//     return {
//       success: true,
//       id: result.id,
//     };
//   } catch (err) {
//     console.error("❌ EMAIL SEND FAILED (NON-BLOCKING):", err?.message || err);

//     // 🔥 IMPORTANT: DO NOT THROW
//     return {
//       success: false,
//       error: err?.message || "Email failed",
//     };
//   }
// }

// -----------------------------------------------------------------------

import { Resend } from "resend";

/* =========================
   RESEND CLIENT
========================= */
const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================
   SEND EMAIL (NON-BLOCKING)
========================= */
export async function sendEmail({ to, subject, html }) {
  console.log("📨 sendEmail() CALLED");
  console.log({ to, subject });

  try {
    const result = await resend.emails.send({
      from:
        process.env.EMAIL_FROM ||
        "EverMoment <no-reply@evermomentstudio.online>",
      to,
      subject,
      html,
    });

    /* 🔎 CRITICAL CHECK */
    if (result.error) {
      console.error("❌ RESEND ERROR:", result.error);
      return {
        success: false,
        error: result.error.message,
      };
    }

    console.log("✅ EMAIL QUEUED IN RESEND:", result.data.id);

    return {
      success: true,
      id: result.data.id,
    };
  } catch (err) {
    console.error(
      "❌ EMAIL SEND FAILED (EXCEPTION):",
      err?.message || err
    );

    return {
      success: false,
      error: err?.message || "Email failed",
    };
  }
}
