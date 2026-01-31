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
  console.log('[WorkflowPage] Starting for workflowId:', workflowId);

  // Check authentication first
  const session = await getSession();
  console.log('[WorkflowPage] Session retrieved:', !!session?.user);
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch workflow data
  console.log('[WorkflowPage] Fetching workflow data...');
  const workflow = await getWorkflow(workflowId);
  console.log('[WorkflowPage] Workflow data retrieved:', !!workflow);

  if (!workflow) {
    notFound();
  }

  return (
    <WorkflowEditor workflow={workflow} />
  );
}
