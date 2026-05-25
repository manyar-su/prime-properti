import { AgentShell } from "@/components/agent/agent-shell";
import { PropertyForm } from "@/components/agent/property-form";
import { requireRole } from "@/lib/security/auth";

export default async function NewPropertyPage() {
  const session = await requireRole(["superadmin"]);

  return (
    <AgentShell session={session}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Tambah Properti</h1>
        <PropertyForm mode="create" />
      </div>
    </AgentShell>
  );
}

