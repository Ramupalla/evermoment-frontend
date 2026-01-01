import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

/* =========================
   DATABASE CONNECTION
========================= */

// Railway MySQL (single source of truth)
const MYSQL_URL = process.env.MYSQL_MYSQL_URL;

if (!MYSQL_URL) {
  console.error("❌ MYSQL_MYSQL_URL not found in environment variables");
  process.exit(1);
}

const pool = mysql.createPool({
  uri: MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/* =========================
   HEALTH CHECK
========================= */
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL connected successfully");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
})();

export default pool;
