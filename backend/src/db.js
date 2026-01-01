// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// /* =========================
//    DEBUG (SAFE TO KEEP)
// ========================= */
// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_PORT:", process.env.DB_PORT);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "YES" : "NO");
// console.log("DB_NAME:", process.env.DB_NAME);

// /* =========================
//    MYSQL CONNECTION POOL
// ========================= */
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT), // ✅ REQUIRED for Railway
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,

//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// export default pool;

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

/* =========================
   DATABASE CONNECTION
========================= */
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not set");
}

const pool = mysql.createPool(DATABASE_URL);

/* =========================
   HEALTH CHECK (SAFE)
========================= */
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL connected successfully");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
  }
})();

export default pool;
