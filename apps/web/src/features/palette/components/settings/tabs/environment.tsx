'use client';

import { useCallback, useMemo, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui-test/button';
import { Input } from '@/components/ui-test/input';
import useStore from '@/store/store';
import type { EnvironmentVariable } from '@/store/slices/settings/settings-slice';

const GRID_COLS = 'grid grid-cols-[minmax(0,1fr)_8px_minmax(0,1fr)_auto] items-center';

interface EnvironmentVariablesProps {
  registerBeforeLeaveHandler?: (handler: (onProceed: () => void) => void) => void;
}

export function EnvironmentVariables({ registerBeforeLeaveHandler }: EnvironmentVariablesProps) {
  const environmentVariables = useStore((state) => state.environmentVariables);
  const addEnvironmentVariable = useStore((state) => state.addEnvironmentVariable);
  const updateEnvironmentVariable = useStore((state) => state.updateEnvironmentVariable);
  const removeEnvironmentVariable = useStore((state) => state.removeEnvironmentVariable);

  const [searchTerm, setSearchTerm] = useState('');
  const [focusedValueIndex, setFocusedValueIndex] = useState<number | null>(null);

  // Initialize with one empty row if no variables exist
  const envVars = useMemo(() => {
    if (environmentVariables.length === 0) {
      return [{ key: '', value: '', id: -1, scope: 'personal' as const }];
    }
    return environmentVariables;
  }, [environmentVariables]);

  const filteredEnvVars = useMemo(() => {
    if (!searchTerm.trim()) return envVars;
    const term = searchTerm.toLowerCase();
    return envVars.filter((v) => v.key.toLowerCase().includes(term));
  }, [envVars, searchTerm]);

  const handleAddVariable = useCallback(() => {
    addEnvironmentVariable({ key: '', value: '', scope: 'personal' });
    setSearchTerm('');
  }, [addEnvironmentVariable]);

  const handleUpdateVariable = useCallback(
    (variable: EnvironmentVariable, field: 'key' | 'value', newValue: string) => {
      if (variable.id === -1) {
        // This is the placeholder row - create a new variable
        if (field === 'key' || (field === 'value' && newValue)) {
          addEnvironmentVariable({
            key: field === 'key' ? newValue : '',
            value: field === 'value' ? newValue : '',
            scope: 'personal',
          });
        }
      } else {
        updateEnvironmentVariable(variable.id, { [field]: newValue });
      }
    },
    [addEnvironmentVariable, updateEnvironmentVariable],
  );

  const handleRemoveVariable = useCallback(
    (id: number) => {
      if (id !== -1) {
        removeEnvironmentVariable(id);
      }
    },
    [removeEnvironmentVariable],
  );

  const handleValueFocus = useCallback((index: number) => {
    setFocusedValueIndex(index);
  }, []);

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Search and Add */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border bg-muted/30 px-2 py-1.5">
          <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" strokeWidth={2} />
          <Input
            placeholder="Search variables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-auto flex-1 border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button onClick={handleAddVariable} size="sm">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      {/* Variables List */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className={GRID_COLS}>
            <span className="text-xs font-medium text-muted-foreground">Key</span>
            <div />
            <span className="text-xs font-medium text-muted-foreground">Value</span>
            <div className="w-9" />
          </div>

          {/* Variables */}
          {filteredEnvVars.map((variable, index) => {
            const maskedValueStyle =
              focusedValueIndex !== index ? ({ WebkitTextSecurity: 'disc' } as React.CSSProperties) : undefined;

            return (
              <div key={variable.id} className={GRID_COLS}>
                <Input
                  value={variable.key}
                  onChange={(e) => handleUpdateVariable(variable, 'key', e.target.value)}
                  placeholder="API_KEY"
                  className="h-9"
                />
                <div />
                <Input
                  value={variable.value}
                  onChange={(e) => handleUpdateVariable(variable, 'value', e.target.value)}
                  type="text"
                  onFocus={() => handleValueFocus(index)}
                  onBlur={() => setFocusedValueIndex(null)}
                  placeholder="Enter value"
                  style={maskedValueStyle}
                  className="h-9"
                />
                <div className="ml-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveVariable(variable.id)}
                    disabled={variable.id === -1}
                    className="h-9 w-9"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {searchTerm.trim() && filteredEnvVars.length === 0 && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No environment variables found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
