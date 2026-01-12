export interface AgentConfig {
  id: string;
  systemPrompt: string;
  model: {
    provider: string;
    modelName: string;
  };
  voice: {
    provider: string;
    voiceId: string;
  };
  stt: {
    provider: string;
    modelName?: string;
    language?: string;
  };
  tools: AgentToolConfig[];
}

export interface AgentToolConfig {
  name: string;
  description: string;
  type: 'http_request' | 'function';
  config: Record<string, any>;
}

export interface StateMachineConfig {
  id: string;
  name: string;
  callConfig?: {
    allowCall: boolean;
    agentName: string;
  };
  initialState: string;
  states: Record<string, StateConfig>;
}

export interface StateConfig {
  name: string;
  agent?: AgentConfig;
  transitions: Record<string, string>; // tool_name -> target_state_name
}
