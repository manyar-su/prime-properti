import { z } from "zod";

const phoneRegex = /^[0-9]{10,}$/;

export const contactSchema = z.object({
  nama: z.string().min(2).max(100),
  email: z.string().email(),
  nomorHp: z.string().regex(phoneRegex, "Nomor HP minimal 10 digit angka."),
  pesan: z.string().min(5).max(2000),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const propertySchema = z.object({
  nama_property: z.string().min(3).max(100),
  group: z.string().max(100).nullable().optional(),
  lebar: z.number().gt(0).max(999).multipleOf(0.01),
  panjang: z.number().gt(0).max(999).multipleOf(0.01),
  hadap: z.array(z.enum(["Utara", "Selatan", "Timur", "Barat"])) .min(1),
  tipe: z.enum(["ruko", "villa"]),
  tingkat: z.number().min(1).max(10).multipleOf(0.1),
  price: z.number().int().positive(),
  carport: z.boolean(),
  status: z.enum(["in_stock", "sold_out"]),
  siap: z.enum(["siap_huni", "siap_kosong", "siap_huni_renovasi"]),
  maps_link: z
    .string()
    .url()
    .includes("google.com/maps", { message: "Maps link harus domain google.com/maps" })
    .nullable()
    .optional(),
  kawasan: z.array(z.string().min(2).max(100)).min(1),
  unit: z.string().max(120).nullable().optional(),
});

export const propertyFilterSchema = z.object({
  search: z.string().optional(),
  kawasan: z.array(z.string()).optional(),
  hadap: z.array(z.enum(["Utara", "Selatan", "Timur", "Barat"])) .optional(),
  tipe: z.enum(["all", "ruko", "villa"]).default("all"),
  status: z.enum(["all", "in_stock", "sold_out"]).default("all"),
  siap: z.array(z.enum(["siap_huni", "siap_kosong", "siap_huni_renovasi"])) .optional(),
  carport: z.enum(["all", "yes", "no"]).default("all"),
  lebarMin: z.number().optional(),
  hargaMax: z.number().optional(),
  sortBy: z.enum(["nama_property", "price", "created_at", "status"]).default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(50),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type PropertyFilterInput = z.infer<typeof propertyFilterSchema>;

