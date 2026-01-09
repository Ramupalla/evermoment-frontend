import { sendEmail } from "./sendEmail.js";

export async function sendAdminNewOrderEmail({
  orderId,
  plan,
  amount,
  fastTrack,
  email,
  whatsapp,
  createdAt,
}) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not set. Skipping admin notification.");
    return;
  }

  await sendEmail({
    to: adminEmail,
    subject: "🔔 New Order Received | EverMoment",
    html: `
      <h2>New Order Received 🎉</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Customer Email:</strong> ${email}</p>
      <p><strong>Customer Mobile:</strong> ${whatsapp}</p>
      <p><strong>Plan:</strong> ${plan}</p>
      <p><strong>Amount:</strong> ₹${amount}</p>
      <p><strong>Fast Track:</strong> ${fastTrack ? "Yes ⚡" : "No"}</p>
      <p><strong>Created At:</strong> ${new Date(createdAt).toLocaleString("en-IN")}</p>

      <br/>
      <a href="https://www.evermomentstudio.online/admin/orders"
         style="
           display:inline-block;
           padding:12px 18px;
           background:#22c55e;
           color:#022c22;
           border-radius:8px;
           text-decoration:none;
           font-weight:600;
         ">
        View Order in Admin Panel
      </a>
    `,
  });
}
