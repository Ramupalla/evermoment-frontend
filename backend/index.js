import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import ordersRouter from "./src/routes/orders.js";
import uploadRoutes from "./src/routes/uploads.js";
import paymentRoutes from "./src/routes/payments.js";
import adminOrders from "./src/routes/adminOrders.js";
import contactRoutes from "./src/routes/contact.js";
import { adminAuth } from "./middleware/adminAuth.js";

dotenv.config();

const app = express();

/* =========================
   GLOBAL MIDDLEWARE
========================= */

// ✅ Explicit CORS (IMPORTANT)
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       process.env.FRONTEND_URL, // Vercel URL
//     ],
//     methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization", "x-admin-secret"],
//   })
// );

// app.use(express.json());
/* =========================
   GLOBAL MIDDLEWARE
========================= */
app.use(
  cors({
    origin: [
      "https://evermoment-frontend-ofla.vercel.app",
      "https://evermoment-frontend-jvs5.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-secret"],
    credentials: true,
  })
);

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
app.use("/api/orders", ordersRouter);
app.use("/api/uploads", uploadRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/contact", contactRoutes);

/* =========================
   ADMIN ROUTES (PROTECTED)
========================= */
app.use("/api/admin/orders", adminAuth, adminOrders);

/* =========================
   404 FALLBACK
========================= */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 EverMoment backend running on port ${PORT}`);
});

export default app;
