import nodemailer from "nodemailer";

/* =========================
   SMTP TRANSPORT (GMAIL)
========================= */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: 465,              // ✅ SSL port (most reliable)
  secure: true,           // ✅ MUST be true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // App password
  },

   pool: true,
  maxConnections: 1,
  maxMessages: 50,
  rateLimit: true,
});

/* =========================
   VERIFY ON STARTUP
========================= */
transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP VERIFY FAILED:", err.message);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});

/* =========================
   SEND EMAIL
========================= */
export async function sendEmail({ to, subject, html }) {
  console.log("📨 sendEmail() CALLED");
  console.log({ to, subject });

  try {
    const info = await transporter.sendMail({
      from: `"EverMoment 💛" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ EMAIL SENT:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ EMAIL SEND FAILED:", err.message);
    throw err;
  }
}
