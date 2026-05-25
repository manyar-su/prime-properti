import { describe, expect, it } from "vitest";

import { contactSchema, propertySchema } from "@/lib/validators";

describe("validators", () => {
  it("validates contact payload", () => {
    const result = contactSchema.safeParse({
      nama: "Andi",
      email: "andi@example.com",
      nomorHp: "081234567890",
      pesan: "Halo tim Prime Property",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid property payload", () => {
    const result = propertySchema.safeParse({
      nama_property: "AB",
      lebar: 0,
      panjang: 10,
      hadap: ["Utara"],
      tipe: "ruko",
      tingkat: 1,
      price: 1000,
      carport: true,
      status: "in_stock",
      siap: "siap_huni",
      kawasan: ["Krakatau"],
    });

    expect(result.success).toBe(false);
  });
});

