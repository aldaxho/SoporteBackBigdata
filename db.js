import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Detecta si está habilitado SSL
const useSSL = process.env.PGSSLMODE !== "disable";

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  //ssl: useSSL ? { rejectUnauthorized: false } : false,
});

export default pool;
