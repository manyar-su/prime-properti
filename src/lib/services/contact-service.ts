import type { ContactInput } from "@/lib/validators";
import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function createContactMessage(input: ContactInput, ipAddress: string) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("contact_messages")
    .insert({
      nama: input.nama,
      email: input.email,
      nomor_hp: input.nomorHp,
      pesan: input.pesan,
      ip_address: ipAddress,
    })
    .select("id, nama, email, nomor_hp, pesan, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function notifyContactMessage(message: {
  id: string;
  nama: string;
  email: string;
  nomor_hp: string;
  pesan: string;
  created_at: string;
}) {
  if (!env.CONTACT_NOTIFY_FUNCTION_URL || !env.CONTACT_NOTIFY_FUNCTION_KEY) {
    return;
  }

  await fetch(env.CONTACT_NOTIFY_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.CONTACT_NOTIFY_FUNCTION_KEY}`,
    },
    body: JSON.stringify(message),
  });
}

