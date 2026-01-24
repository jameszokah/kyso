'use client';

import { createControlRenderer } from '../../utils/rendering';
import { AgentToolConfigControl, type AgentToolConfig } from './agent-tool-config-control';

interface SingleAgentToolControlProps {
  data: AgentToolConfig;
  path: string;
  handleChange: (path: string, value: AgentToolConfig) => void;
}

function SingleAgentToolControl({ path, handleChange, data }: SingleAgentToolControlProps) {
  // Ensure default structure
  const value = data || { name: '', description: '', type: 'http_request', config: {} };

  return (
    <AgentToolConfigControl
      value={value}
      onChange={(newValue) => handleChange(path, newValue)}
      hideTypeSelection={true} // Restrict to HTTP as per requirement for now
    />
  );
}

export const singleAgentToolControlRenderer = createControlRenderer('SingleAgentTool', SingleAgentToolControl);
