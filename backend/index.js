import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import ordersRouter from "./src/routes/orders.js";
import uploadRoutes from "./src/routes/uploads.js";
import paymentRoutes from "./src/routes/payments.js";
import adminOrders from "./src/routes/adminOrders.js";
import { adminAuth } from "./middleware/adminAuth.js";
// import testMail from "./routes/testMail.js";
import contactRoutes from "./src/routes/contact.js";







dotenv.config();

const app = express();

/* =========================
   GLOBAL MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("EverMoment backend running ✅");
});

/* =========================
   PUBLIC ROUTES
========================= */
// app.use("/api/test", testMail);

app.use("/api/orders", ordersRouter);   // customer access + download
app.use("/api/uploads", uploadRoutes);  // S3 presign
app.use("/api/payments", paymentRoutes); // Razorpay / payment flow

/* =========================
   ADMIN ROUTES (PROTECTED)
========================= */
app.use("/api/admin/orders", adminAuth, adminOrders);
app.use("/api/contact", contactRoutes);

/* =========================
   404 FALLBACK (IMPORTANT)
========================= */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});



/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

export default app;


