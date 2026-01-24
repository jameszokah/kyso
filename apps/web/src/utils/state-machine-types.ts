export interface WorkflowConfig {
  id: string;
  tenantId: string;
  name: string;
  initialState: string;
  states: Record<string, AgentState>;
  global?: {
    model?: {
      provider: string;
      modelName: string;
      apiKey?: string;
    };
    voice?: {
      provider: string;
      voiceId: string;
      model?: string;
      apiKey?: string;
    };
    stt?: {
      provider: string;
      modelName?: string;
      language?: string;
      apiKey?: string;
    };
    language?: string;
  };
}

export interface AgentState {
  name: string;
  systemPrompt: string;
  tools: AgentToolConfig[];
  model?: {
    provider: string;
    modelName: string;
    apiKey?: string;
  };
  voice?: {
    provider: string;
    voiceId: string;
    model?: string;
    language?: string;
    apiKey?: string;
  };
  stt?: {
    provider: string;
    modelName?: string;
    language?: string;
    apiKey?: string;
  };
  rag?: {
    enabled: boolean;
    serviceName?: string;
  };
}

export interface AgentToolConfig {
  name: string;
  description: string;
  type: 'http_request' | 'function' | 'webhook';
  config: Record<string, any>;
  transitionTo?: string;
  parameters?: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'object' | 'array';
      description: string;
      required?: boolean;
    };
  };
}
