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

import { sendEmail } from "./sendEmail.js";

export async function sendDeliveryEmail({ email, token }) {
  if (!email || !token) {
    throw new Error("Email and token are required");
  }

  const downloadLink = `${process.env.BACKEND_URL}/api/orders/${token}/download`;

  await sendEmail({
    to: email,
    subject: "Your EverMoment is ready 💛",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px;">
        <h2>Your EverMoment is Ready 🎉</h2>
        <p>Your video has been lovingly crafted and is ready to download.</p>

        <a
          href="${downloadLink}"
          target="_blank"
          style="
            display:inline-block;
            margin-top:16px;
            padding:14px 26px;
            background:#000;
            color:#fff;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;
          "
        >
          ⬇️ Download Your EverMoment
        </a>

        <p style="margin-top:24px;color:#666;">
          This secure link works only after payment.
        </p>

        <p style="margin-top:32px;">— Team EverMoment 🤍</p>
      </div>
    `,
  });
}
