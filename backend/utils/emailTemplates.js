// export function paymentSuccessEmail({ name, token }) {
//   return {
//     subject: "Your EverMoment payment was successful ❤️",
//     html: `
//       <div style="font-family: Arial; line-height:1.6">
//         <h2>Thank you, ${name || "there"}!</h2>
//         <p>Your payment was successful.</p>
//         <p>Your memory is being prepared with care ✨</p>
//         <a href="http://localhost:3000/order/${token}"
//            style="display:inline-block;margin-top:12px;
//            padding:10px 16px;background:#000;color:#fff;
//            text-decoration:none;border-radius:6px">
//           View Your Order
//         </a>
//         <p style="margin-top:20px">— EverMoment Team</p>
//       </div>
//     `,
//   };
// }

// export function deliveryEmail({ name, token }) {
//   return {
//     subject: "Your EverMoment is ready to download 🎉",
//     html: `
//       <div style="font-family: Arial; line-height:1.6">
//         <h2>Your EverMoment is ready ❤️</h2>
//         <p>We’ve completed your video with love and care.</p>
//         <a href="http://localhost:3000/order/${token}"
//            style="display:inline-block;margin-top:12px;
//            padding:10px 16px;background:#000;color:#fff;
//            text-decoration:none;border-radius:6px">
//           Download Your Memory
//         </a>
//         <p style="margin-top:20px">Thank you for trusting EverMoment.</p>
//       </div>
//     `,
//   };
// }


// export function deliveryEmail({ name, token }) {
//   const downloadLink = `${process.env.BACKEND_URL}/api/orders/${token}/download`;

//   return {
//     subject: "Your EverMoment is ready to download 🎉",
//     html: `
//       <div style="font-family: Arial; line-height:1.6">
//         <h2>Your EverMoment is ready ❤️</h2>
//         <p>We’ve completed your video with love and care.</p>

//         <a href="${downloadLink}"
//            style="
//              display:inline-block;
//              margin-top:12px;
//              padding:12px 18px;
//              background:#000;
//              color:#fff;
//              text-decoration:none;
//              border-radius:6px;
//              font-weight:600
//            ">
//           ⬇️ Download Your EverMoment
//         </a>

//         <p style="margin-top:16px;font-size:13px;color:#555">
//           If the download doesn’t start, copy and paste this link into your browser:<br/>
//           ${downloadLink}
//         </p>

//         <p style="margin-top:20px">
//           Thank you for trusting EverMoment.<br/>
//           — EverMoment Team ✨
//         </p>
//       </div>
//     `,
//   };
// }

export async function sendEmail({ to, subject, downloadUrl }) {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; line-height: 1.6;">
      <h2>Your EverMoment is Ready 🎉</h2>

      <p>
        Your video has been carefully crafted and is now ready for download.
      </p>

      <a
        href="${downloadUrl}"
        target="_blank"
        style="
          display: inline-block;
          margin-top: 20px;
          padding: 14px 28px;
          background-color: #000000;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: bold;
        "
      >
        Download Your Video
      </a>

      <p style="margin-top: 24px; color: #666;">
        This secure link works only after payment and is intended just for you.
      </p>

      <p style="margin-top: 32px;">
        — Team EverMoment 🤍
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}
