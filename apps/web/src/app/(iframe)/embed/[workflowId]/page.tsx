import { headers } from 'next/headers';
import EmbedAgentClient from '@/components/voice-ui/embed-iframe/agent-client';
import { ApplyThemeScript } from '@/components/voice-ui/embed-iframe/theme-provider';
import { getAppConfig, getOrigin } from '@/lib/env';
import { db, workflowRelease } from '@kyso/db';
import { desc, eq } from 'drizzle-orm';

export default async function Embed({ params }: { params: Promise<{ workflowId: string }> }) {
  const hdrs = await headers();
  const origin = getOrigin(hdrs);
  
  // Fetch the latest release for this workflow
  const { workflowId } = await params;
  
  const release = await db.query.workflowRelease.findFirst({
    where: eq(workflowRelease.workflowId, workflowId),
    orderBy: [desc(workflowRelease.releaseNumber)],
  });

  // Default config
  let appConfig = await getAppConfig(origin);
  
  if (release?.agentFlow) {
    const agentFlow = release.agentFlow as any;
    // Map settings from the stored agent flow to AppConfig
    // Assuming settings are stored in agentFlow.global or similar, 
    // or we might need to adjust based on where `settings` are stored in the release schema
    // In schema: workflowRelease.agentFlow is the extracted config.
    // Let's assume some defaults are overridden if present in the flow config
    
    // For now, we'll keep the defaults but inject the workflowId
    // If you have specific settings map, add them here:
    // e.g. supportsChatInput: agentFlow.settings?.chatEnabled ?? true
    
    appConfig = {
        ...appConfig,
        workflowId,
        agentName: release.message ? `release-${release.releaseNumber}` : undefined,
    };
  } else {
    // Fallback if no release found - might want to show error
    appConfig = {
        ...appConfig,
        workflowId,
    };
  }

  return (
    <>
      <ApplyThemeScript />
      <EmbedAgentClient appConfig={appConfig} />
    </>
  );
}
