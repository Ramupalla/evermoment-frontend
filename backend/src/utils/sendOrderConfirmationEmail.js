// import { sendEmail } from "./sendEmail.js";
// import { getDeliveryEstimate } from "./deliveryEstimate.js";

// export async function sendOrderConfirmationEmail({
//   email,
//   orderId,
//   total_amount,
//   plan,
//   fastTrack,
//   fast_track_amount = 0,
  
// }) {
//   const { date, day } = getDeliveryEstimate(plan, fastTrack);


//   const safeTotalAmount = Number(total_amount) || 0;
// const safeFastTrackAmount = Number(fast_track_amount) || 0;

// const planLine = fastTrack
//   ? `${plan.toUpperCase()} @ ₹${safeTotalAmount} + ₹${safeFastTrackAmount} (Fast Track)`
//   : `${plan.toUpperCase()} @ ₹${safeTotalAmount}`;

//   // const planLine = fastTrack
//   //   ? `${plan.toUpperCase()} @ ₹${total_amount} + ₹${fast_track_amount} (Fast Track)`
//   //   : `${plan.toUpperCase()} @ ₹${total_amount}`;

//   await sendEmail({
//     to: email,
//     subject: "✅ Your EverMoment order is confirmed",
//     html: `
//       <div style="font-family: Arial, sans-serif; padding: 24px;">
//         <h2>Order Confirmed 🎉</h2>

//         <p>
//           Thank you for choosing <strong>EverMoment</strong>.
//           Your order has been successfully created.
//         </p>

//         <hr style="margin: 20px 0;" />

//         <p><strong>Order ID:</strong><br/>${orderId}</p>
//         <p><strong>Selected Plan:</strong><br/>${planLine}</p>

//         <p>
//           <strong>Estimated Delivery:</strong><br/>
//           ${date}, ${day}
//         </p>

//         <hr style="margin: 20px 0;" />

//         <p style="color:#555;">
//           Please keep your Order ID safe.  
//           You’ll need it for any communication or support.
//         </p>

//         <p style="margin-top: 28px;">
//           — Team EverMoment 🤍
//         </p>
//       </div>
//     `,
//   });
// }


import { sendEmail } from "./sendEmail.js";
import { getDeliveryEstimate } from "./deliveryEstimate.js";

export async function sendOrderConfirmationEmail({
  email,
  orderId,
  plan,
  fastTrack = false,
  base_amount = 0,
  fast_track_amount = 0,
}) {
  const { date, day } = getDeliveryEstimate(plan, fastTrack);

  const safeBase = Number(base_amount) || 0;
  const safeFastTrack = Number(fast_track_amount) || 0;

  const planName = plan.toUpperCase();

  const planLine = fastTrack && safeFastTrack > 0
    ? `${planName} ₹${safeBase} + ₹${safeFastTrack} (Fast Track)`
    : `${planName} ₹${safeBase}`;

  await sendEmail({
    to: email,
    subject: "✅ Your EverMoment order is confirmed",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; line-height: 1.6;">
        <h2>Order Confirmed 🎉</h2>

        <p>
          Thank you for choosing <strong>EverMoment</strong>.
          Your order has been successfully created.
        </p>

        <hr style="margin: 20px 0;" />

        <p>
          <strong>Order ID:</strong><br/>
          ${orderId}
        </p>

        <p>
          <strong>Selected Plan:</strong><br/>
          ${planLine}
        </p>

        <p>
          <strong>Estimated Delivery:</strong><br/>
          ${date}, ${day}
        </p>

        <hr style="margin: 20px 0;" />

        <p style="color:#555;">
          Please keep your Order ID safe.<br/>
          You’ll need it for any communication or support.
        </p>

        <p style="margin-top: 28px;">
          — Team EverMoment 🤍
        </p>
      </div>
    `,
  });
}
