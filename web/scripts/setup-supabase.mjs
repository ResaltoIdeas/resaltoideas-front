import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sql = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20260825_init.sql"),
  "utf8",
);

async function trySql() {
  const endpoints = [
    `${url}/pg/query`,
    `${url}/postgres/v1/query`,
  ];
  for (const endpoint of endpoints) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    });
    const text = await res.text();
    console.log(`SQL ${endpoint.replace(url, "")} -> ${res.status}`);
    if (res.ok) return true;
    if (res.status !== 404) console.log(text.slice(0, 400));
  }
  return false;
}

async function ensureBucket(id, isPublic) {
  const res = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, name: id, public: isPublic, fileSizeLimit: 83886080 }),
  });
  const text = await res.text();
  if (res.ok || res.status === 409 || text.includes("already exists") || text.includes("Duplicate")) {
    console.log(`Bucket ${id} OK`);
    return;
  }
  console.log(`Bucket ${id} -> ${res.status} ${text.slice(0, 300)}`);
}

const sqlOk = await trySql();
await ensureBucket("previews", true);
await ensureBucket("deliverables", false);

if (!sqlOk) {
  console.log("SCHEMA_NEEDS_DASHBOARD");
  process.exit(2);
}
console.log("SCHEMA_OK");
