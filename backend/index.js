// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// import ordersRouter from "./src/routes/orders.js";
// import uploadRoutes from "./src/routes/uploads.js";
// import paymentRoutes from "./src/routes/payments.js";
// import adminOrdersRouter from "./src/routes/adminOrders.js";
// import contactRoutes from "./src/routes/contact.js";

// // import { adminAuth } from "./middleware/adminAuth.js";

// dotenv.config();

// const app = express();

// /* =========================
//    GLOBAL MIDDLEWARE
// ========================= */

// // ✅ CORS
// app.use(
//   cors({
//     origin: [
//       "https://evermoment-frontend-ofla.vercel.app",
//       "https://evermoment-frontend-jvs5.vercel.app",
//       "http://localhost:3000",
//     ],
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "x-admin-secret"],
//     credentials: true,
//   })
// );

// // ✅ REQUIRED for POST body parsing
// app.use(express.json());

// /* =========================
//    HEALTH CHECK
// ========================= */
// app.get("/", (req, res) => {
//   res.send("EverMoment backend running ✅");
// });

// /* =========================
//    PUBLIC ROUTES
// ========================= */
// app.use("/api/orders", ordersRouter);
// app.use("/api/uploads", uploadRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use("/api/contact", contactRoutes);

// /* =========================
//    ADMIN ROUTES (UNPROTECTED for now)
// ========================= */
// app.use("/api/admin/orders", adminOrdersRouter);
// // app.use("/api/admin/orders", adminAuth, adminOrdersRouter);

// /* =========================
//    404 FALLBACK
// ========================= */
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// /* =========================
//    START SERVER
// ========================= */
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 EverMoment backend running on port ${PORT}`);
// });

// export default app;
// #---------------------------------------------------- above code works locally

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import ordersRouter from "./src/routes/orders.js";
import uploadRoutes from "./src/routes/uploads.js";
import paymentRoutes from "./src/routes/payments.js";
import adminOrdersRouter from "./src/routes/adminOrders.js";
import contactRoutes from "./src/routes/contact.js";

dotenv.config();

const app = express();

/* =========================
   CORS (PRODUCTION SAFE)
========================= */
const allowedOrigins = [
  "https://www.evermomentstudio.online",
  "https://evermomentstudio.online",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-secret"],
    credentials: true,
  })
);

/* ✅ IMPORTANT: FIX FOR NODE 22 */
app.options("/*", cors());

app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("EverMoment backend running ✅");
});

/* =========================
   ROUTES
========================= */
app.use("/api/orders", ordersRouter);
app.use("/api/uploads", uploadRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/orders", adminOrdersRouter);

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
