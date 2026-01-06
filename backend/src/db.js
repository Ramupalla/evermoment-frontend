import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

/* =========================
   ENV VALIDATION
========================= */
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  console.error("❌ Missing required database environment variables");
  process.exit(1);
}

/* =========================
   DATABASE CONNECTION (AIVEN SAFE)
========================= */
const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,

 // ✅ FIX FOR AIVEN (LOCAL + PROD)
  ssl: {
    rejectUnauthorized: false,
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/* =========================
   HEALTH CHECK (ON BOOT)
========================= */
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL connected successfully (Aiven)");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
})();

export default pool;

// #---------------------------------------------------------------
// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// /* =========================
//    DATABASE CONFIG
// ========================= */

// let pool;

// /* ===== CASE 1: DATABASE_URL ===== */
// if (process.env.DATABASE_URL) {
//   pool = mysql.createPool({
//     uri: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false },
//     waitForConnections: true,
//     connectionLimit: 10,
//   });
// }
// /* ===== CASE 2: Split DB vars ===== */
// else {
//   const {
//     DB_HOST,
//     DB_PORT,
//     DB_USER,
//     DB_PASSWORD,
//     DB_NAME,
//   } = process.env;

//   console.log("ENV CHECK →", {
//     DB_HOST,
//     DB_PORT,
//     DB_USER,
//     DB_PASSWORD: DB_PASSWORD ? "SET" : undefined,
//     DB_NAME,
//   });

//   if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
//     throw new Error("❌ Missing required database environment variables");
//   }

//   pool = mysql.createPool({
//     host: DB_HOST,
//     port: Number(DB_PORT),
//     user: DB_USER,
//     password: DB_PASSWORD,
//     database: DB_NAME,
//     ssl: { rejectUnauthorized: false },
//     waitForConnections: true,
//     connectionLimit: 10,
//   });
// }

// /* =========================
//    HEALTH CHECK
// ========================= */
// (async () => {
//   try {
//     const conn = await pool.getConnection();
//     console.log("✅ MySQL connected successfully");
//     conn.release();
//   } catch (err) {
//     console.error("❌ MySQL connection failed:", err.message);
//     process.exit(1);
//   }
// })();

// export default pool;
