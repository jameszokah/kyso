import { GetDiagramState, SetDiagramState } from '../../store';

// Types
export interface EnvironmentVariable {
  key: string;
  value: string;
  id: number;
  scope: 'personal' | 'workspace';
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  displayKey: string;
  keyType: 'personal' | 'workspace';
  createdAt: string;
  lastUsed?: string;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface McpServer {
  id: string;
  name: string;
  transport: string;
  url: string;
  headers: Record<string, string>;
  timeout: number;
  enabled: boolean;
  tools: McpTool[];
}

export interface McpTool {
  name: string;
  description?: string;
  serverId: string;
}

export interface SettingsState {
  // Environment Variables
  environmentVariables: EnvironmentVariable[];
  addEnvironmentVariable: (variable: Omit<EnvironmentVariable, 'id'>) => void;
  updateEnvironmentVariable: (id: number, updates: Partial<EnvironmentVariable>) => void;
  removeEnvironmentVariable: (id: number) => void;
  setEnvironmentVariables: (variables: EnvironmentVariable[]) => void;

  // API Keys
  apiKeys: ApiKey[];
  addApiKey: (key: Omit<ApiKey, 'id' | 'createdAt'>) => string;
  removeApiKey: (id: string) => void;
  setApiKeys: (keys: ApiKey[]) => void;

  // Files
  files: WorkspaceFile[];
  addFile: (file: Omit<WorkspaceFile, 'id' | 'uploadedAt'>) => string;
  removeFile: (id: string) => void;
  setFiles: (files: WorkspaceFile[]) => void;

  // MCP Servers
  mcpServers: McpServer[];
  addMcpServer: (server: Omit<McpServer, 'id' | 'tools'>) => string;
  updateMcpServer: (id: string, updates: Partial<McpServer>) => void;
  removeMcpServer: (id: string) => void;
  setMcpServers: (servers: McpServer[]) => void;
}

// Helper to generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

let envVariableCounter = 0;
function generateEnvVariableId(): number {
  envVariableCounter += 1;
  return envVariableCounter;
}

// Persistence keys
const STORAGE_KEYS = {
  ENV_VARS: 'workflow-settings-env-vars',
  API_KEYS: 'workflow-settings-api-keys',
  FILES: 'workflow-settings-files',
  MCP_SERVERS: 'workflow-settings-mcp-servers',
};

// Load from localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Failed to load ${key} from storage:`, error);
  }
  return defaultValue;
}

// Save to localStorage
function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to storage:`, error);
  }
}

export function useSettingsSlice(set: SetDiagramState, _get: GetDiagramState): SettingsState {
  return {
    // Environment Variables
    environmentVariables: loadFromStorage<EnvironmentVariable[]>(STORAGE_KEYS.ENV_VARS, []),

    addEnvironmentVariable: (variable) => {
      const newVariable: EnvironmentVariable = {
        ...variable,
        id: generateEnvVariableId(),
      };
      set((state) => {
        const updated = [...state.environmentVariables, newVariable];
        saveToStorage(STORAGE_KEYS.ENV_VARS, updated);
        return { environmentVariables: updated };
      });
    },

    updateEnvironmentVariable: (id, updates) => {
      set((state) => {
        const updated = state.environmentVariables.map((v) => (v.id === id ? { ...v, ...updates } : v));
        saveToStorage(STORAGE_KEYS.ENV_VARS, updated);
        return { environmentVariables: updated };
      });
    },

    removeEnvironmentVariable: (id) => {
      set((state) => {
        const updated = state.environmentVariables.filter((v) => v.id !== id);
        saveToStorage(STORAGE_KEYS.ENV_VARS, updated);
        return { environmentVariables: updated };
      });
    },

    setEnvironmentVariables: (variables) => {
      saveToStorage(STORAGE_KEYS.ENV_VARS, variables);
      set({ environmentVariables: variables });
    },

    // API Keys
    apiKeys: loadFromStorage<ApiKey[]>(STORAGE_KEYS.API_KEYS, []),

    addApiKey: (key) => {
      const id = generateId();
      const fullKey = `wf_${generateId()}`;
      const newKey: ApiKey = {
        ...key,
        id,
        key: fullKey,
        displayKey: `${fullKey.slice(0, 8)}...${fullKey.slice(-4)}`,
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        const updated = [...state.apiKeys, newKey];
        saveToStorage(STORAGE_KEYS.API_KEYS, updated);
        return { apiKeys: updated };
      });
      return fullKey;
    },

    removeApiKey: (id) => {
      set((state) => {
        const updated = state.apiKeys.filter((k) => k.id !== id);
        saveToStorage(STORAGE_KEYS.API_KEYS, updated);
        return { apiKeys: updated };
      });
    },

    setApiKeys: (keys) => {
      saveToStorage(STORAGE_KEYS.API_KEYS, keys);
      set({ apiKeys: keys });
    },

    // Files
    files: loadFromStorage<WorkspaceFile[]>(STORAGE_KEYS.FILES, []),

    addFile: (file) => {
      const id = generateId();
      const newFile: WorkspaceFile = {
        ...file,
        id,
        uploadedAt: new Date().toISOString(),
      };
      set((state) => {
        const updated = [...state.files, newFile];
        saveToStorage(STORAGE_KEYS.FILES, updated);
        return { files: updated };
      });
      return id;
    },

    removeFile: (id) => {
      set((state) => {
        const updated = state.files.filter((f) => f.id !== id);
        saveToStorage(STORAGE_KEYS.FILES, updated);
        return { files: updated };
      });
    },

    setFiles: (files) => {
      saveToStorage(STORAGE_KEYS.FILES, files);
      set({ files: files });
    },

    // MCP Servers
    mcpServers: loadFromStorage<McpServer[]>(STORAGE_KEYS.MCP_SERVERS, []),

    addMcpServer: (server) => {
      const id = generateId();
      const newServer: McpServer = {
        ...server,
        id,
        tools: [],
      };
      set((state) => {
        const updated = [...state.mcpServers, newServer];
        saveToStorage(STORAGE_KEYS.MCP_SERVERS, updated);
        return { mcpServers: updated };
      });
      return id;
    },

    updateMcpServer: (id, updates) => {
      set((state) => {
        const updated = state.mcpServers.map((s) => (s.id === id ? { ...s, ...updates } : s));
        saveToStorage(STORAGE_KEYS.MCP_SERVERS, updated);
        return { mcpServers: updated };
      });
    },

    removeMcpServer: (id) => {
      set((state) => {
        const updated = state.mcpServers.filter((s) => s.id !== id);
        saveToStorage(STORAGE_KEYS.MCP_SERVERS, updated);
        return { mcpServers: updated };
      });
    },

    setMcpServers: (servers) => {
      saveToStorage(STORAGE_KEYS.MCP_SERVERS, servers);
      set({ mcpServers: servers });
    },
  };
}
