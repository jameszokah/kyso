'use client';

import { useCallback, useEffect, useState } from 'react';
import { FormControlWithLabel } from '@/components/form/form-control-with-label/form-control-with-label';
import { Input } from '@/components/ui-test/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { KeyValueList, type KeyValuePair } from '@/components/form/key-value-list/key-value-list';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export interface HttpToolConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
}

interface HttpToolControlProps {
  value: HttpToolConfig;
  onChange: (value: HttpToolConfig) => void;
}

function recordToKeyValuePairs(record?: Record<string, string>): KeyValuePair[] {
  if (!record) return [];
  return Object.entries(record).map(([key, value]) => ({
    id: crypto.randomUUID(),
    key,
    value,
  }));
}

function keyValuePairsToRecord(pairs: KeyValuePair[]): Record<string, string> {
  return pairs.reduce((acc, { key, value }) => {
    if (key.trim()) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
}

export function HttpToolControl({ value, onChange }: HttpToolControlProps) {
  const [headers, setHeaders] = useState<KeyValuePair[]>(() =>
    recordToKeyValuePairs(value?.headers)
  );
  
  // Body state
  const [bodyType, setBodyType] = useState<'none' | 'json' | 'form-data'>(() => {
    if (!value?.body) return 'none';
    // Heuristic could be improved, but for now assuming if body exists and is object, it's JSON or Form
    return 'json'; 
  });
  
  const [jsonMode, setJsonMode] = useState<'builder' | 'raw'>('builder');
  const [bodyBuilderItems, setBodyBuilderItems] = useState<KeyValuePair[]>(() => {
    if (value?.body && typeof value.body === 'object') {
       // Flatten simple objects for builder
       // Note: This only works for flat objects. Nested objects would need recursion or just raw mode.
       const pairs: KeyValuePair[] = [];
       for (const [k, v] of Object.entries(value.body)) {
         if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
           pairs.push({ id: crypto.randomUUID(), key: k, value: String(v) });
         }
       }
       return pairs;
    }
    return [];
  });
  const [rawBody, setRawBody] = useState<string>(() => {
      if (value?.body) {
          if (typeof value.body === 'string') return value.body;
          return JSON.stringify(value.body, null, 2);
      }
      return '';
  });

  const updateConfig = useCallback((updates: Partial<HttpToolConfig>) => {
    onChange({ ...value, ...updates });
  }, [value, onChange]);

  // Sync headers to config
  useEffect(() => {
    updateConfig({ headers: keyValuePairsToRecord(headers) });
  }, [headers]); // Be careful with dependency loop, ideally updateConfig should be stable

  // Sync body to config
  useEffect(() => {
    if (bodyType === 'none') {
      updateConfig({ body: undefined });
    } else if (bodyType === 'json') {
      if (jsonMode === 'raw') {
        try {
          const parsed = JSON.parse(rawBody);
          updateConfig({ body: parsed });
        } catch (e) {
          // Allow saving string if it's not valid JSON yet? 
          // Or just don't update to keep valid state? 
          // For now let's might not update invalid JSON to value
        }
      } else {
        updateConfig({ body: keyValuePairsToRecord(bodyBuilderItems) });
      }
    } else if (bodyType === 'form-data') {
       // Use builder items for form/urlencoded config
       updateConfig({ body: keyValuePairsToRecord(bodyBuilderItems) });
    }
  }, [bodyType, jsonMode, bodyBuilderItems, rawBody]); // Optimization needed to avoid rapid cycles

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <FormControlWithLabel label="Method" className="w-[120px]">
          <Select
            value={value?.method || 'GET'}
            onValueChange={(m) => updateConfig({ method: m })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HTTP_METHODS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControlWithLabel>

        <FormControlWithLabel label="URL" className="flex-1">
          <Input
            placeholder="https://api.example.com/v1/resource"
            value={value?.url || ''}
            onChange={(e) => updateConfig({ url: e.target.value })}
          />
        </FormControlWithLabel>
      </div>

      <FormControlWithLabel label="Headers">
        <KeyValueList
          items={headers}
          onChange={setHeaders}
          keyPlaceholder="Header"
          valuePlaceholder="Value"
        />
      </FormControlWithLabel>

      <div className="space-y-3">
        <Label>Body</Label>
        <RadioGroup
          value={bodyType}
          onValueChange={(v: any) => setBodyType(v)}
          className="flex flex-row gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="body-none" />
            <Label htmlFor="body-none">None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="json" id="body-json" />
            <Label htmlFor="body-json">JSON</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="form-data" id="body-form" />
            <Label htmlFor="body-form">Form Data</Label>
          </div>
        </RadioGroup>

        {bodyType !== 'none' && (
          <div className="border rounded-md p-4 bg-muted/20 space-y-4">
            {bodyType === 'json' && (
              <div className="flex items-center gap-2 mb-2">
                <Switch
                  checked={jsonMode === 'raw'}
                  onCheckedChange={(checked) =>
                    setJsonMode(checked ? 'raw' : 'builder')
                  }
                  id="json-mode"
                />
                <Label htmlFor="json-mode">Raw JSON Mode</Label>
              </div>
            )}

            {(bodyType === 'form-data' || (bodyType === 'json' && jsonMode === 'builder')) && (
               <KeyValueList
                 items={bodyBuilderItems}
                 onChange={setBodyBuilderItems}
                 keyPlaceholder="Key"
                 valuePlaceholder="Value"
               />
            )}

            {bodyType === 'json' && jsonMode === 'raw' && (
              <Textarea
                placeholder="{}"
                className="font-mono min-h-[150px]"
                value={rawBody}
                onChange={(e) => setRawBody(e.target.value)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
