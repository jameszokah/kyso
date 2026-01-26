import { headers } from 'next/headers';
import EmbedAgentClient from '@/components/voice-ui/embed-iframe/agent-client';
import { ApplyThemeScript } from '@/components/voice-ui/embed-iframe/theme-provider';
import { getAppConfig, getOrigin } from '@/lib/env';

export default async function Embed() {
  const hdrs = await headers();
  const origin = getOrigin(hdrs);
  const appConfig = await getAppConfig(origin);

  return (
    <>
      <ApplyThemeScript />
      <EmbedAgentClient appConfig={appConfig} />
    </>
  );
}
