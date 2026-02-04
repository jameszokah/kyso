import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getWorkflow, getSession } from "@/lib/workflow-server";
import { WorkflowEditor } from "./workflow-editor";


export default async function WorkflowPage({ params }: PageProps<'/[locale]/workflow/[workflowId]'>) {
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
    <WorkflowEditor workflow={workflow} />
  );
}
