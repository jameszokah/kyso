import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getWorkflow, getSession } from "@/lib/workflow-server";
import { WorkflowEditor } from "./workflow-editor";

interface WorkflowPageProps {
  params: Promise<{
    workflowId: string;
    locale: string;
  }>;
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { workflowId } = await params;

  // Check authentication first
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch workflow data
  const workflow = await getWorkflow(workflowId);

  if (!workflow) {
    notFound();
  }

  return (
    <Suspense>
      <WorkflowEditor workflow={workflow} />
    </Suspense>
  );
}
