import express from "express";
import { sendDeliveryEmail } from "../utils/sendDeliveryEmail.js";

const router = express.Router();

router.get("/mail", async (req, res) => {
  await sendDeliveryEmail({
    email: "YOUR_PERSONAL_EMAIL@gmail.com",
    token: "TEST_TOKEN_123",
  });

  res.send("✅ Test mail triggered");
});

export default router;
