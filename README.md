# Prime Property V1

Next.js fullstack scaffold untuk Prime Property (Tailwind + TypeScript + Supabase) dengan halaman publik dan portal agent internal.

## Fitur yang tersedia

- Halaman publik: `/`, `/about`, `/contact`
- Login agent internal: `/agent/login`
- Dashboard listing properti (admin + superadmin): `/agent/properties`
- Detail properti: `/agent/properties/[id]`
- CRUD properti (superadmin): create/edit/delete (soft delete)
- API endpoints:
  - `POST /api/contact`
  - `POST /api/agent/login`
  - `POST /api/agent/logout`
  - `GET /api/properties`
  - `GET /api/properties/:id`
  - `POST /api/properties`
  - `PUT /api/properties/:id`
  - `DELETE /api/properties/:id`

## Security baseline

- Session cookie: httpOnly, SameSite=Lax, maxAge 30 hari
- Rate limit in-app: global 100 req/menit/IP, auth 10 req/menit/IP, contact 3 req/jam/IP
- CSRF check untuk endpoint mutasi
- RBAC backend (admin read-only; superadmin CRUD)
- Lockout login setelah 5 gagal (15 menit)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env template:

```bash
cp .env.example .env.local
```

3. Isi kredensial Supabase di `.env.local`.

4. Jalankan SQL schema ke project Supabase:

- File: `supabase/sql/001_init.sql`

5. Seed data dummy (50+ listing):

```bash
npm run seed
```

6. Jalankan development server:

```bash
npm run dev
```

## Testing

```bash
npm run lint
npm run test
```

## Catatan integrasi email contact

Form contact menyimpan data ke tabel `contact_messages`, lalu memanggil endpoint Edge Function via `CONTACT_NOTIFY_FUNCTION_URL` + `CONTACT_NOTIFY_FUNCTION_KEY`.

Template function disiapkan di:

- `supabase/functions/contact-notify/index.ts`

