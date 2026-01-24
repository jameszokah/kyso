import { Button } from '@/components/ui-test/button';
import { Input } from '@/components/ui-test/input';
import { TrashIcon, PlusIcon } from '@phosphor-icons/react';
import React from 'react';

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

interface KeyValueListProps {
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addButtonLabel?: string;
}

export function KeyValueList({
  items,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  addButtonLabel = 'Add Item',
}: KeyValueListProps) {
  const handleAdd = () => {
    onChange([...items, { id: crypto.randomUUID(), key: '', value: '' }]);
  };

  const handleChange = (id: string, field: 'key' | 'value', value: string) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.id} className="flex gap-2 items-center">
          <Input
            placeholder={keyPlaceholder}
            value={item.key}
            onChange={(e) => handleChange(item.id, 'key', e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder={valuePlaceholder}
            value={item.value}
            onChange={(e) => handleChange(item.id, 'value', e.target.value)}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(item.id)}
            className="shrink-0 text-destructive hover:text-destructive"
          >
            <TrashIcon />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="self-start gap-2"
      >
        <PlusIcon />
        {addButtonLabel}
      </Button>
    </div>
  );
}
