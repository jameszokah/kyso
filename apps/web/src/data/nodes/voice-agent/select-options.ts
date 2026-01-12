import { ItemOption } from "@kyso/types/node-schema";

export const modelProviderOptions: Record<string, ItemOption> = {
  openai: { label: 'OpenAI', value: 'openai', icon: 'OpenAiLogoThin' },
  anthropic: { label: 'Anthropic', value: 'anthropic', icon: 'AnchorSimpleThin' },
  google: { label: 'Google', value: 'google', icon: 'GoogleLogoThin' },
  groq: { label: 'Groq', value: 'groq', icon: 'GridFourThin' },
};

export const modelNameOptions: Record<string, ItemOption> = {
  gpt4o: { label: 'GPT-4o', value: 'gpt-4o', icon: 'OpenAiLogoThin' },
  gpt4omini: { label: 'GPT-4o Mini', value: 'gpt-4o-mini', icon: 'OpenAiLogoThin' },
  claude35sonnet: { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20240620', icon: 'AnchorSimpleThin' },
  gemini15pro: { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro', icon: 'GoogleLogoThin' },
};

export const voiceProviderOptions: Record<string, ItemOption> = {
  cartesia: { label: 'Cartesia', value: 'cartesia', icon: 'ChartPieSliceThin' },
  elevenlabs: { label: 'ElevenLabs', value: 'elevenlabs', icon: 'ElevatorThin' },
  playht: { label: 'PlayHT', value: 'playht', icon: 'PlaylistThin' },
  rime: { label: 'Rime', value: 'rime', icon: 'RowsPlusBottomThin' },
};

// Mock voices - in a real app these might be fetched dynamically
export const voiceIdOptions = [
  { label: 'Sonic (Cartesia)', value: 'sonic-3:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc' },
  { label: 'Sarah (ElevenLabs)', value: 'sarah' },
  { label: 'Turbo (PlayHT)', value: 'turbo' },
];

export const sttProviderOptions = [
  { label: 'AssemblyAI', value: 'assemblyai' },
  { label: 'Deepgram', value: 'deepgram' },
  { label: 'Google', value: 'google' },
];

export const sttModelOptions = [
  { label: 'Universal Streaming (AssemblyAI)', value: 'universal-streaming' },
  { label: 'Nova 2 (Deepgram)', value: 'nova-2' },
];

export const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
];
