'use client';

import { cn } from '@/lib/utils';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, useSidebar } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui-test/button';
import { PropertiesBarHeader } from '../header/properties-bar-header';
import { NodeProperties } from '../node-properties/node-properties';
import { EdgeProperties } from '../edge-properties/edge-properties';
import { renderComponent } from './render-component';
import type { PropertiesBarItem, PropertiesBarProps } from './properties-bar.types';
import { withOptionalPlugins } from '../../../plugins/utils/adapter-components';

function PropertiesSidebarComponent({
  selection,
  onMenuHeaderClick,
  onDeleteClick,
  headerLabel,
  deleteNodeLabel,
  deleteEdgeLabel,
  selectedTab,
  onTabChange,
  tabs = [],
}: PropertiesBarProps) {
  const { open } = useSidebar();

  const name = selection?.node?.data?.properties?.label ?? selection?.edge?.data?.label;
  const isExpanded = !!selection;
  const hasCustomItems = tabs.length > 0;

  const tabList = [{ label: 'Properties', value: 'properties' }, ...tabs.map(({ label, value }) => ({ label, value }))];

  const contentComponents: PropertiesBarItem[] = [
    {
      when: ({ selection, selectedTab }) => !!selection.node && selectedTab === 'properties',
      component: ({ selection }) => <NodeProperties node={selection.node!} />,
    },
    {
      when: ({ selection }) => !!selection.edge,
      component: ({ selection }) => <EdgeProperties edge={selection.edge!} />,
    },
    ...tabs.flatMap((tab) => tab.components),
  ];

  return (
    <Sidebar
      side="right"
      variant="floating"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collapsible={'' as any}
      className={cn(
        'border rounded-xl bg-background text-foreground shadow-sm',
        'transition-all duration-300 ease-in-out',
        'py-4 gap-4  m-4',
        open && isExpanded ? 'w-64' : isExpanded ? 'w-64' : 'w-52',
        open && isExpanded ? 'h-[calc(100vh-2rem)]' : isExpanded ? 'h-[calc(100vh-2rem)]' : 'h-16',
      )}
    >
      <SidebarHeader className="px-4">
        <PropertiesBarHeader
          isExpanded={isExpanded}
          header={headerLabel}
          name={name ?? ''}
          onDotsClick={onMenuHeaderClick}
        />
        {isExpanded && !!selection?.node && selection.node.type === 'node' && hasCustomItems && (
          <Tabs value={selectedTab} onValueChange={onTabChange} className="mt-2 w-full">
            <TabsList className="grid grid-cols-3 w-full rounded-md bg-muted">
              {tabList.map(({ label, value }) => (
                <TabsTrigger key={value} value={value} className="text-xs py-1">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </SidebarHeader>
      {isExpanded && (
        <>
          <Separator className="my-3" />
          <SidebarContent className="px-4 space-y-3">
            {renderComponent(contentComponents, selection, selectedTab)}
          </SidebarContent>
          <Separator className="my-3" />
          <SidebarFooter className="px-4">
            <Button onClick={onDeleteClick} variant="destructive" className="w-full">
              {selection?.node ? deleteNodeLabel : deleteEdgeLabel}
            </Button>
          </SidebarFooter>
        </>
      )}
    </Sidebar>
  );
}

export const PropertiesSidebar = withOptionalPlugins(PropertiesSidebarComponent, 'PropertiesSidebar');
