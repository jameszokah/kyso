'use client';

import { cn } from '@/lib/utils';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { NodePreviewContainer } from '../../node-preview-container';
import { PaletteItem } from '@kyso/types/common';
import { DragEvent } from 'react';

type PaletteItemsProps = {
  onDragStart: (event: DragEvent, type: string) => void;
  onMouseDown: (type: string) => void;
  items: PaletteItem[];
  isDisabled?: boolean;
};

export function PaletteItems({ items, onDragStart, onMouseDown, isDisabled = false }: PaletteItemsProps) {
  return (
    <SidebarMenu className="flex flex-col gap-3 box-border">
      {items.map((item) => (
        <SidebarMenuItem
          key={item.type}
          draggable={!isDisabled}
          className={cn(
            'rounded-xl cursor-grab outline-1 outline-transparent outline-offset-[-1px]',
            isDisabled && 'cursor-default select-none opacity-50',
          )}
          onMouseDown={() => onMouseDown(item.type)}
          onDragStart={(event) => onDragStart(event, item.type)}
        >
          <NodePreviewContainer type={item.type} />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
