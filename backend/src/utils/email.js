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
    subject: "🎉 Your EverMoment is ready to download",
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Your EverMoment is Ready ❤️</h2>

        <p>We’ve completed your video with love and care.</p>

        <a href="${downloadUrl}"
           style="
             display:inline-block;
             margin-top:12px;
             padding:12px 18px;
             background:#000;
             color:#fff;
             text-decoration:none;
             border-radius:6px;
           ">
          ⬇️ Download Your EverMoment
        </a>

        <p style="margin-top:20px">
          Thank you for trusting EverMoment.
        </p>
      </div>
    `,
  });
}
