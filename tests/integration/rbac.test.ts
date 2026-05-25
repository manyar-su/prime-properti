import { describe, expect, it } from "vitest";

import { createSessionToken, verifySessionToken } from "@/lib/security/session";
import { requireApiRole } from "@/lib/security/auth-api";

describe("auth/rbac", () => {
  it("verifies session payload", async () => {
    const token = await createSessionToken({
      sub: "u-1",
      email: "admin@example.com",
      role: "admin",
      name: "Admin",
    });

    const payload = await verifySessionToken(token);
    expect(payload?.role).toBe("admin");
  });

  it("returns forbidden for disallowed role", async () => {
    const token = await createSessionToken({
      sub: "u-1",
      email: "admin@example.com",
      role: "admin",
      name: "Admin",
    });

    const request = new Request("http://localhost/api/properties", {
      headers: {
        cookie: `pp_session=${token}`,
      },
    });

    const check = await requireApiRole(request, ["superadmin"]);
    expect(check.forbidden).toBe(true);
  });
});

