'use client';

import { cn } from '@/lib/utils';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, useSidebar } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { PaletteHeader } from './components/header/palette-header';
import { PaletteFooter } from './components/footer/palette-footer';
import { PaletteItems } from './components/items/palette-items';
import { DraggedItem } from './components/dragged-item/dragged-item';
import { NodePreviewContainer } from './node-preview-container';
import { usePaletteDragAndDrop } from './hooks/use-palette-drag-and-drop';
import useStore from '@/store/store';
import { useEffect } from 'react';

export function PaletteSidebar() {
  // const toggleSidebar = useStore((state) => state.toggleSidebar);
  const fetchData = useStore((state) => state.fetchData);
  // const isSidebarExpanded = useStore((state) => state.isSidebarExpanded);
  const paletteItems = useStore((state) => state.data);
  const isReadOnlyMode = useStore((state) => state.isReadOnlyMode);

  const { open: isSidebarExpanded } = useSidebar();

  const { draggedItem, zoom, ref, onMouseDown, onDragStart } = usePaletteDragAndDrop(!isReadOnlyMode);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Sidebar
      side="left"
      variant="floating"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collapsible={'' as any}
      className={cn(
        'border rounded-xl bg-background text-foreground shadow-sm',
        'transition-all duration-300 ease-in-out z-50',
        'py-4 gap-4 m-4',
        isSidebarExpanded ? 'w-64' : 'w-52',
        isSidebarExpanded ? 'h-[calc(100vh-2rem)] m-4 ml-6' : 'h-18',
      )}
    >
      <SidebarHeader className="px-4 ">
        <PaletteHeader />
      </SidebarHeader>
      {isSidebarExpanded && (
        <>
          <Separator className="my-3" />
          <SidebarContent className="px-4">
            <PaletteItems
              items={paletteItems}
              onMouseDown={onMouseDown}
              onDragStart={onDragStart}
              isDisabled={isReadOnlyMode}
            />
            {draggedItem && (
              <DraggedItem ref={ref} zoom={zoom}>
                <NodePreviewContainer type={draggedItem.type} />
              </DraggedItem>
            )}
          </SidebarContent>
          <Separator className="my-3" />
          <SidebarFooter className="px-4">
            <PaletteFooter />
          </SidebarFooter>
        </>
      )}
    </Sidebar>
  );
}
