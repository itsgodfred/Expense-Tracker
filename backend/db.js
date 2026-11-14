import pg from "pg";

const { Pool } = pg;

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, NODE_ENV } = process.env;

const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: NODE_ENV === "production" ? { rejectUnauthorized: false } : true,
});

export default pool;
