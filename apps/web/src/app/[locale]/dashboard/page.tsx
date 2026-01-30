import { auth } from "@kyso/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
      <h1 className="text-2xl text-bold">Dashboard</h1>
      <p className="text-lg">Welcome {session.user.name}</p>
      <Dashboard session={session} customerState={customerState} />
    </div>
  );
}
