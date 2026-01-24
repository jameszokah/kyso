import type { ItemOption } from '@kyso/types/node-schema';
export const toolOptions: Record<string, ItemOption> = {
  gmail: { label: 'Gmail', value: 'gmail', icon: 'GoogleLogoThin' },
  excel: { label: 'Excel', value: 'excel', icon: 'MicrosoftExcelLogoThin' },
  airtable: { label: 'Airtable', value: 'airtable', icon: 'AirtableLogo' },
  jira: { label: 'Jira', value: 'jira', icon: 'JiraLogo' },
  slack: { label: 'Slack', value: 'slack', icon: 'SlackLogoThin' },
  hubspot: { label: 'Hubspot', value: 'hubspot', icon: 'HubspotLogo' },
};

export const chatModelOptions: Record<string, ItemOption> = {
  gpt: { label: 'GPT-4', value: 'gpt40', icon: 'OpenAiLogoThin' },
  gemini: { label: 'Gemini 2.5 Pro', value: 'gemini2.5pro', icon: 'GeminiLogo' },
  claude: { label: 'Claude 3.7 Sonet', value: 'claude3.7sonet', icon: 'ClaudeLogo' },
};

export const memoryOptions: Record<string, ItemOption> = {
  system: { label: 'Windows System Memory', value: 'system', icon: 'DatabaseThin' },
} as Record<string, ItemOption>;
