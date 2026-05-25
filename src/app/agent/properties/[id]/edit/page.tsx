import { notFound } from "next/navigation";

import { AgentShell } from "@/components/agent/agent-shell";
import { PropertyForm } from "@/components/agent/property-form";
import { requireRole } from "@/lib/security/auth";
import { getPropertyById } from "@/lib/services/property-service";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["superadmin"]);
  const { id } = await params;

  const property = await getPropertyById(id);
  if (!property) notFound();

  return (
    <AgentShell session={session}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Properti</h1>
        <PropertyForm mode="edit" initialValue={property} />
      </div>
    </AgentShell>
  );
}

