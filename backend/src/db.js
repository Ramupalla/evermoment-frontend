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
