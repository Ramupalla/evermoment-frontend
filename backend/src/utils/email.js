// export const sendOrderEmail = async (email, link) => {
//   console.log(`📧 Email would be sent to ${email}`);
//   console.log(`🔗 Link: ${link}`);
// };

import { sendEmail } from "./utils/sendEmail.js";

/* ============================
   PAYMENT LINK EMAIL
============================ */
export async function sendReadyForPaymentEmail({ email, orderId, link }) {
  if (!email || !link) return;

  await sendEmail({
    to: email,
    subject: "Your EverMoment is ready 💛",
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Your EverMoment is ready ❤️</h2>
        <p>Please complete payment to unlock your download.</p>

        <a href="${link}"
           style="
             display:inline-block;
             margin-top:12px;
             padding:12px 18px;
             background:#000;
             color:#fff;
             text-decoration:none;
             border-radius:6px;
           ">
          👉 Pay & Unlock Your Video
        </a>

        <p style="margin-top:20px">— EverMoment Team</p>
      </div>
    `,
  });
}

/* ============================
   FINAL DELIVERY EMAIL
============================ */
export async function sendDeliveryEmail({ email, downloadUrl }) {
  if (!email || !downloadUrl) return;

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
      moments into memories that last forever.
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
      ⭐ Tip: Star this email to keep your download link handy for the future.
    </p>
  </div>
`,
  });
}
