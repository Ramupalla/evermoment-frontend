// import { sendEmail } from "./sendEmail.js";
// import { getDeliveryEstimate } from "./deliveryEstimate.js";

// export async function sendOrderConfirmationEmail({
//   email,
//   orderId,
//   plan,
//   fastTrack = false,
//   base_amount = 0,
//   fast_track_amount = 0,
// }) {
//   const { date, day } = getDeliveryEstimate(plan, fastTrack);

//   const safeBase = Number(base_amount) || 0;
//   const safeFastTrack = Number(fast_track_amount) || 0;

//   const planName = plan.toUpperCase();

//   const planLine = fastTrack && safeFastTrack > 0
//     ? `${planName} ₹${safeBase} + ₹${safeFastTrack} (Fast Track)`
//     : `${planName} ₹${safeBase}`;

//   await sendEmail({
//     to: email,
//     subject: "✅ Your EverMoment order is confirmed",
//     html: `
//       <div style="font-family: Arial, sans-serif; padding: 24px; line-height: 1.6;">
//         <h2>Order Confirmed 🎉</h2>

//         <p>
//           Thank you for choosing <strong>EverMoment</strong>.
//           Your order has been successfully created.
//         </p>

//         <hr style="margin: 20px 0;" />

//         <p>
//           <strong>Order ID:</strong><br/>
//           ${orderId}
//         </p>

//         <p>
//           <strong>Selected Plan:</strong><br/>
//           ${planLine}
//         </p>

//         <p>
//           <strong>Estimated Delivery:</strong><br/>
//           ${date}, ${day}
//         </p>

//         <hr style="margin: 20px 0;" />

//         <p style="color:#555;">
//           Please keep your Order ID safe.<br/>
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

  const planLine =
    fastTrack && safeFastTrack > 0
      ? `${planName} ₹${safeBase} + ₹${safeFastTrack} (Fast Track)`
      : `${planName} ₹${safeBase}`;

  // 🔗 Order status link
  const orderStatusUrl = `https://www.evermomentstudio.online/order/${orderId}`;

  await sendEmail({
    to: email,
    subject: "✅ Your EverMoment order is confirmed",
    html: `
      <div style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        padding: 32px;
        background: #ffffff;
        color: #111827;
        line-height: 1.6;
      ">
        <h2 style="margin-bottom: 12px;">
          Order Confirmed 🎉
        </h2>

        <p style="font-size: 15px; color: #374151;">
          Thank you for choosing <strong>EverMoment</strong>.
          Your order has been successfully created.
        </p>

        <hr style="margin: 24px 0;" />

        <p>
          <strong>Order ID</strong><br/>
          <span style="color:#2563eb;">${orderId}</span>
        </p>

        <p>
          <strong>Selected Plan</strong><br/>
          ${planLine}
        </p>

        <p>
          <strong>Estimated Delivery</strong><br/>
          ${date}, ${day}
        </p>

        <hr style="margin: 24px 0;" />

        <!-- CTA -->
        <div style="margin: 28px 0; text-align: center;">
          <a
            href="${orderStatusUrl}"
            target="_blank"
            style="
              display: inline-block;
              padding: 14px 22px;
              background: #111827;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
            "
          >
            View Your Order Status →
          </a>

          <p style="margin-top: 10px; font-size: 13px; color: #6b7280;">
            You can check your order anytime — no login required.
          </p>
        </div>

        <!-- Fallback link -->
        <p style="font-size: 13px; color: #6b7280;">
          If the button doesn’t work, copy and paste this link into your browser:<br/>
          <a href="${orderStatusUrl}" style="color:#2563eb;">
            ${orderStatusUrl}
          </a>
        </p>

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
      ⭐ Tip: Star this email to keep order status link handy for the future.
    </p>
      </div>
    `,
  });
}

