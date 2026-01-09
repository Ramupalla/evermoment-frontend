import express from "express";
import crypto from "crypto";

const router = express.Router();

// IMPORTANT: raw body needed for signature verification
router.post(
  "/razorpay",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];
    const body = req.body.toString();

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("❌ Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(body);

    console.log("✅ Razorpay Webhook Received:", event.event);

    // TODO: handle events
    if (event.event === "payment.captured") {
      // update order.payment_status = "paid"
      // unlock delivery
    }

    res.status(200).json({ received: true });
  }
);

export default router;
