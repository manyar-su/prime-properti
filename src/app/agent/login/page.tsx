import { redirect } from "next/navigation";

import { LoginForm } from "@/components/agent/login-form";
import { getSession } from "@/lib/security/auth";

export default async function AgentLoginPage() {
  const session = await getSession();
  if (session) redirect("/agent/properties");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Prime Property</p>
          <h1 className="mt-2 text-2xl font-bold">Login Agent Internal</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

