import { db } from "@kyso/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const { workflowId } = await params;

  if (!workflowId) {
    return new NextResponse("Missing workflowId", { status: 400 });
  }

  try {


    // Fetch the latest release separately
    const latestRelease = await db.query.workflowRelease.findFirst({
      where: (table, { eq }) => eq(table.workflowId, workflowId),
      orderBy: (table, { desc }) => [desc(table.releaseNumber)],
    });

    if (!latestRelease) {
      return new NextResponse("Workflow has no releases", { status: 404 });
    }

    // Return key information needed by the backend
    return NextResponse.json({
      ...latestRelease.agentFlow,
    });
  } catch (error) {
    console.error("Error fetching workflow:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
