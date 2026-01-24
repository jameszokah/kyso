import type { ItemOption } from "@kyso/types/node-schema";

export const modelProviderOptions: Record<string, ItemOption> = {
  openai: { label: 'OpenAI', value: 'openai', icon: 'OpenAiLogoThin' },
  anthropic: { label: 'Anthropic', value: 'anthropic', icon: 'ChatsCircleThin' }, // Claude icon placeholder
  google: { label: 'Google', value: 'google', icon: 'GoogleLogoThin' },
  groq: { label: 'Groq', value: 'groq', icon: 'CpuThin' },
};

export const modelNameOptions: Record<string, ItemOption> = {
  gpt4o: { label: 'GPT-4o', value: 'gpt-4o', icon: 'OpenAiLogoThin' },
  gpt4omini: { label: 'GPT-4o Mini', value: 'gpt-4o-mini', icon: 'OpenAiLogoThin' },
  claude35sonnet: { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20240620', icon: 'ChatsCircleThin' },
  gemini15pro: { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro', icon: 'GoogleLogoThin' },
};

export const voiceProviderOptions: Record<string, ItemOption> = {
  cartesia: { label: 'Cartesia', value: 'cartesia', icon: 'WaveformThin' },
  elevenlabs: { label: 'ElevenLabs', value: 'elevenlabs', icon: 'SpeakerHighThin' },
  playht: { label: 'PlayHT', value: 'playht', icon: 'PlayCircleThin' },
  openai: { label: 'OpenAI', value: 'openai', icon: 'OpenAiLogoThin' },
};

// Mock voices - in a real app these might be fetched dynamically
export const voiceIdOptions = [
  { label: 'Alloy (OpenAI)', value: 'alloy' },
  { label: 'Echo (OpenAI)', value: 'echo' },
  { label: 'Fable (OpenAI)', value: 'fable' },
  { label: 'Shimmer (OpenAI)', value: 'shimmer' },
  { label: 'Sonic (Cartesia)', value: 'sonic-3:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc' },
  { label: 'Sarah (ElevenLabs)', value: 'sarah' },
];

export const sttProviderOptions: Record<string, ItemOption> = {
  deepgram: { label: 'Deepgram', value: 'deepgram', icon: 'MicrophoneThin' },
  groq: { label: 'Groq', value: 'groq', icon: 'CpuThin' },
  assemblyai: { label: 'AssemblyAI', value: 'assemblyai', icon: 'WaveformThin' },
};

export const sttModelOptions = [
  { label: 'Nova 2 (Deepgram)', value: 'nova-2' },
  { label: 'Whisper Large V3 Turbo (Groq)', value: 'whisper-large-v3-turbo' },
  { label: 'Universal Streaming (AssemblyAI)', value: 'universal-streaming' },
];

export const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Japanese', value: 'ja' },
];
