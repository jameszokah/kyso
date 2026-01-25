'use client';

import { useCallback, useState } from 'react';
import { FormControlWithLabel } from '@/components/form/form-control-with-label/form-control-with-label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HttpToolControl, type HttpToolConfig } from '../http-tool-control/http-tool-control';

export interface AgentToolConfig {
  name: string;
  description: string;
  type: 'http_request' | 'function' | 'webhook';
  config: Record<string, any>;
}

interface AgentToolConfigControlProps {
  value: AgentToolConfig;
  onChange: (value: AgentToolConfig) => void;
  hideTypeSelection?: boolean; // For when type is fixed (e.g. ToolNode restricted to http)
}

const TOOL_TYPES = [
  { label: 'HTTP Request', value: 'http_request' },
  { label: 'Function', value: 'function' },
  { label: 'Webhook', value: 'webhook' },
];

export function AgentToolConfigControl({
  value,
  onChange,
  hideTypeSelection = false,
}: AgentToolConfigControlProps) {
  const handleChange = useCallback(
    (updates: Partial<AgentToolConfig>) => {
      onChange({ ...value, ...updates });
    },
    [value, onChange]
  );

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md bg-background">
      <FormControlWithLabel label="Tool Name">
        <Input
          placeholder="e.g. get_weather"
          value={value?.name || ''}
          onChange={(e) => handleChange({ name: e.target.value })}
        />
      </FormControlWithLabel>

      <FormControlWithLabel label="Description">
        <Textarea
          placeholder="Description of what this tool does..."
          value={value?.description || ''}
          onChange={(e) => handleChange({ description: e.target.value })}
          className="min-h-[80px]"
        />
      </FormControlWithLabel>

      {!hideTypeSelection && (
        <FormControlWithLabel label="Type">
          <Select
            value={value?.type || 'http_request'}
            onValueChange={(t: any) => handleChange({ type: t, config: {} })} // Reset config on type change
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOOL_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControlWithLabel>
      )}

      {(value?.type === 'http_request' || (!value?.type && hideTypeSelection)) && (
        <div className="mt-2">
          <p className="text-sm font-medium mb-2">HTTP Configuration</p>
          <HttpToolControl
            value={value?.config as HttpToolConfig}
            onChange={(config) => handleChange({ config })}
          />
        </div>
      )}
      
      {value?.type === 'function' && (
         <div className="p-4 bg-muted/50 rounded text-sm text-muted-foreground">
             Function configuration is not yet implemented in this UI.
         </div>
      )}
      
       {value?.type === 'webhook' && (
         <div className="p-4 bg-muted/50 rounded text-sm text-muted-foreground">
             Webhook configuration is not yet implemented in this UI.
         </div>
      )}
    </div>
  );
}
