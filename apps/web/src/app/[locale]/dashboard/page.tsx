import { auth } from "@kyso/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import Dashboard from "./dashboard";
import { getSession } from "@/lib/workflow-server";

export default async function DashboardPage() {
    // Check authentication first
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const { data: customerState } = await authClient.customer.state({
    fetchOptions: {
      headers: await headers(),
    },
  });

  return (
    <div className="p-4">
      <Dashboard session={session} customerState={customerState} />
    </div>
  );
}
