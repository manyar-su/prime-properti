// Supabase Edge Function: contact-notify
// Deploy with: supabase functions deploy contact-notify

declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

interface ContactPayload {
  id: string;
  nama: string;
  email: string;
  nomor_hp: string;
  pesan: string;
  created_at: string;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const payload = (await req.json()) as ContactPayload;

  const smtpApiUrl = Deno.env.get("SMTP_API_URL");
  const smtpApiKey = Deno.env.get("SMTP_API_KEY");
  const adminEmail = Deno.env.get("CONTACT_ADMIN_EMAIL");

  if (!smtpApiUrl || !smtpApiKey || !adminEmail) {
    return new Response(JSON.stringify({ ok: false, message: "SMTP secrets belum dikonfigurasi." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const subject = `[Prime Property] Pesan Baru #${payload.id}`;
  const text = `
Nama: ${payload.nama}
Email: ${payload.email}
Nomor HP: ${payload.nomor_hp}
Waktu: ${payload.created_at}

Pesan:
${payload.pesan}
`.trim();

  await fetch(smtpApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${smtpApiKey}`,
    },
    body: JSON.stringify({
      to: adminEmail,
      subject,
      text,
    }),
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});

