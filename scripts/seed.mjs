import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const email = process.env.SEED_SUPERADMIN_EMAIL ?? "superadmin@primeproperty.id";
const password = process.env.SEED_SUPERADMIN_PASSWORD ?? "PrimeProperty123!";
const passwordHash = await bcrypt.hash(password, 10);

const { data: superadmin, error: adminError } = await supabase
  .from("admin_profiles")
  .upsert(
    {
      email,
      name: "Super Admin",
      role: "superadmin",
      password_hash: passwordHash,
      is_enabled: true,
      failed_attempts: 0,
    },
    { onConflict: "email" },
  )
  .select("id")
  .single();

if (adminError) {
  console.error(adminError);
  process.exit(1);
}

const kawasanList = ["Krakatau", "Pancing", "Tembung", "Helvetia", "Cemara Asri", "Kuala"];
const hadapList = ["Utara", "Selatan", "Timur", "Barat"];

const rows = Array.from({ length: 60 }).map((_, idx) => {
  const base = idx + 1;
  const lebar = 4 + (base % 4) + 0.5;
  const panjang = 12 + (base % 10);
  const tingkat = base % 5 === 0 ? 2.5 : (base % 3) + 1;
  const price = 500_000_000 + base * 27_500_000;

  return {
    nama_property: `Prime Listing ${String(base).padStart(2, "0")}`,
    group: base % 4 === 0 ? null : `Cluster ${String((base % 6) + 1)}`,
    lebar,
    panjang,
    hadap: [hadapList[base % hadapList.length]],
    tipe: base % 2 === 0 ? "ruko" : "villa",
    tingkat,
    price,
    carport: base % 3 !== 0,
    status: base % 7 === 0 ? "sold_out" : "in_stock",
    siap: base % 5 === 0 ? "siap_huni_renovasi" : base % 2 === 0 ? "siap_huni" : "siap_kosong",
    maps_link: "https://www.google.com/maps",
    kawasan: [kawasanList[base % kawasanList.length]],
    unit: base % 3 === 0 ? "Ready Siap huni" : "Gate siap",
    created_by: superadmin.id,
  };
});

const { error: insertError } = await supabase.from("properties").insert(rows);
if (insertError) {
  console.error(insertError);
  process.exit(1);
}

console.log("Seed completed: admin + 60 properties");
console.log(`Superadmin login: ${email} / ${password}`);

