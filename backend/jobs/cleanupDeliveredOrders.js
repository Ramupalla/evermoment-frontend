import dotenv from "dotenv";

// 🔒 FORCE load the exact .env file
dotenv.config({
  path: "D:/Projects/EverMoment/.env",
});

console.log("ENV CHECK →", {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "SET" : undefined,
  DB_NAME: process.env.DB_NAME,
});

import pool from "../src/db.js";
import { deleteOrderFolder } from "../utils/deleteOrderFolder.js";


/* =========================
   CLEANUP JOB
========================= */
export async function cleanupDeliveredOrders() {
  const [orders] = await pool.query(`
    SELECT id
    FROM orders
    WHERE
      delivery_unlocked = 1
      AND files_deleted = 0
      AND delivered_at < NOW() - INTERVAL 7 DAY
  `);

  if (!orders.length) {
    console.log("ℹ️ No orders eligible for cleanup");
    return;
  }

  for (const order of orders) {
    console.log(`🧪 DRY RUN — would delete raw/${order.id}/`);

    // 🔓 ENABLE LATER (when ready)
    // await deleteOrderFolder(order.id);
    // await pool.query(
    //   "UPDATE orders SET files_deleted = 1 WHERE id = ?",
    //   [order.id]
    // );
  }
}

/* =========================
   RUN IF EXECUTED DIRECTLY
========================= */
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupDeliveredOrders()
    .then(() => {
      console.log("✅ Cleanup job finished");
    })
    .catch(err => {
      console.error("❌ Cleanup job failed:", err);
      process.exit(1);
    });
}
