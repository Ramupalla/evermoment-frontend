import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

/* =========================
   DATABASE CONNECTION
========================= */

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  process.exit(1);
}

const pool = mysql.createPool(DATABASE_URL);

/* =========================
   CONNECTION CHECK (SAFE)
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
