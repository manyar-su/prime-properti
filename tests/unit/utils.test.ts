import { describe, expect, it } from "vitest";

import { formatRupiah, parseNumber } from "@/lib/utils";

describe("utils", () => {
  it("formatRupiah uses Indonesian separators", () => {
    expect(formatRupiah(1350000000)).toContain("1.350.000.000");
  });

  it("parseNumber parses rupiah-like input", () => {
    expect(parseNumber("1.250.000")).toBe(1250000);
    expect(parseNumber("10,5")).toBe(10.5);
  });
});

