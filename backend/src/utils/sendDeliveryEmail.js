// import { sendEmail } from "./sendEmail.js";

// export async function sendDeliveryEmail({ email, token }) {
//   console.log("📧 DELIVERY EMAIL TRIGGERED");
//   console.log({ email, token });

//   if (!email || !token) {
//     console.log("❌ Missing email or token");
//     return;
//   }

// // const downloadLink = `${process.env.BACKEND_URL}/api/orders/${token}/download`;
// const downloadUrl = `${process.env.BACKEND_URL}/api/orders/${orders.token}/download`;


//   await sendEmail({
//     to: email,
//     subject: "🎉 Your EverMoment is ready to download",
//     html: `
//       <div style="font-family: Arial; line-height:1.6">
//         <h2>Your EverMoment is Ready ❤️</h2>
//         <p>We’ve completed your video with care.</p>

//         <a href="${downloadUrl}"
//            target="_blank"
//            style="
//              display:inline-block;
//              margin-top:12px;
//              padding:12px 18px;
//              background:#000;
//              color:#fff;
//              text-decoration:none;
//              border-radius:6px;
//              font-weight:600;
//            ">
//           ⬇️ Download Your EverMoment
//         </a>

//         <p style="margin-top:20px">
//           Thank you for trusting EverMoment.
//         </p>

// <p style="margin-top:20px; font-size:13px; opacity:0.7">
//           If the download doesn’t start automatically, please allow popups.
//         </p>

// <p style="margin-top:20px">— EverMoment Team</p>

//       </div>
//     `,
//   });

//   console.log("✅ DELIVERY EMAIL SENT");
  
// }

// import { sendEmail } from "./sendEmail.js";

// export async function sendDeliveryEmail({ email, token }) {
//   if (!email || !token) {
//     throw new Error("Email and token are required");
//   }

// const BASE_URL =
//   process.env.PUBLIC_SITE_URL || process.env.BACKEND_URL;

// if (!BASE_URL) {
//   throw new Error("PUBLIC_SITE_URL is not set");
// }

// const downloadLink = `${BASE_URL}/api/orders/${token}/download`;

//   // const downloadLink = `${process.env.BACKEND_URL}/api/orders/${token}/download`;

//   await sendEmail({
//     to: email,
//     subject: "Your EverMoment is ready 💛",
//     html: `
//       <div style="font-family: Arial, sans-serif; padding: 24px;">
//         <h2>Your EverMoment is Ready 🎉</h2>
//         <p>Your video has been lovingly crafted and is ready to download.</p>

//         <a
//           href="${downloadLink}"
//           target="_blank"
//           style="
//             display:inline-block;
//             margin-top:16px;
//             padding:14px 26px;
//             background:#000;
//             color:#fff;
//             text-decoration:none;
//             border-radius:6px;
//             font-weight:bold;
//           "
//         >
//           ⬇️ Download Your EverMoment
//         </a>

//         <p style="margin-top:24px;color:#666;">
//           This secure link works only after payment.
//         </p>

//         <p style="margin-top:32px;">— Team EverMoment 🤍</p>
//       </div>
//     `,
//   });
// }


import { sendEmail } from "./sendEmail.js";

/**
 * Send final delivery email with secure download link
 * This function MUST throw if email fails
 */
export async function sendDeliveryEmail({ email, token }) {
  /* =========================
     VALIDATION
  ========================= */
  if (!email || typeof email !== "string") {
    throw new Error("Valid email is required");
  }

  if (!token || typeof token !== "string") {
    throw new Error("Valid token is required");
  }

  /* =========================
     BASE URL (PUBLIC ONLY)
  ========================= */
  const BASE_URL =
    process.env.PUBLIC_SITE_URL?.trim() ||
    process.env.BACKEND_URL?.trim();

  if (!BASE_URL) {
    throw new Error(
      "PUBLIC_SITE_URL or BACKEND_URL must be configured"
    );
  }

  /* =========================
     DOWNLOAD LINK
  ========================= */
  const downloadLink = `${BASE_URL}/api/orders/${token}/download`;

  /* =========================
     SEND EMAIL
  ========================= */
  try {
    await sendEmail({
      to: email,
subject: "🎉 Your EverMoment Memory ✨ Is Ready To Relive",
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
      and detail — and they’re now ready to be relived.
    </p>

    <div style="margin: 28px 0;">
      <a
        href="${downloadLink}"
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
        ⬇️ Download Your EverMoment
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280;">
      This is your secure download link.
      You can access it anytime after completing payment.
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

    <p style="font-size: 14px; color: #6b7280;">
      If you have any questions or need assistance, feel free to reply to this email —
      we’re always happy to help.
    </p>

    <p style="margin-top: 28px; font-size: 15px;">
      With warmth,<br />
      <strong>Team EverMoment</strong> 🤍
    </p>

    <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
      ⭐ Tip: Star this email to keep your download link handy for the future.
    </p>
  </div>
`,

    });

    console.log("✅ Delivery email sent successfully:", {
      email,
      downloadLink,
    });
  } catch (err) {
    console.error("❌ DELIVERY EMAIL FAILED:", {
      email,
      token,
      error: err.message,
    });

    // 🔴 VERY IMPORTANT: propagate failure
    throw new Error("Failed to send delivery email");
  }
}
