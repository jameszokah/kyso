import { Position } from '@xyflow/react';
import type { IconType } from '@kyso/types/common';
import { memo, useMemo } from 'react';
import { Icon } from '@kyso/icons';
import { SettingInfo } from './components/setting-info/setting-info';
import { ToolInfo } from './components/tool-info/tool-info';
import type { ItemOption } from '@kyso/types/node-schema';
import type { NodeDataProperties } from '@/features/json-form/types/default-properties';
import { getHandleId } from '../../handles/get-handle-id';
import { ConnectableItem } from '../components/connectable-item/connectable-item';
import { useState } from 'react';
import { BaseNode, BaseNodeHeader, BaseNodeContent } from '@/components/base-node';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { BaseHandle } from '@/components/base-handle';
import { cn } from '@/lib/utils';
import { NodeAppendix } from '@/components/node-appendix';
import { Badge } from '@/components/ui/badge';
import type { VoiceAgentNodeSchema } from '@/data/nodes/voice-agent/schema';

type Props = {
  id: string;
  icon: IconType;
  label: string;
  description: string;
  selected?: boolean;
  isConnecting?: boolean;
  showHandles?: boolean;
  chatModel?: ItemOption | undefined;
  // memoryModel?: ItemOption | undefined;
  selectedTools?: NodeDataProperties<VoiceAgentNodeSchema>['tools'] | undefined;
};

export const VoiceAgentNodeTemplate = memo(
  ({
    id,
    icon,
    label,
    description,
    selected = false,
    showHandles = true,
    chatModel,
    // memoryModel,
    selectedTools,
  }: Props) => {
    const isCanvasNode = showHandles;
    const handleTargetId = getHandleId({ nodeId: id, handleType: 'target' });
    const handleSourceId = getHandleId({ nodeId: id, handleType: 'source' });
    const [open, setOpen] = useState(false);

    const iconElement = useMemo(() => <Icon name={icon} size="large" />, [icon]);

    return (
      <BaseNode
        className={cn(
          'rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-200',
          'hover:ring-2 hover:ring-primary/30',
          selected ? 'border-primary ring-2 ring-primary/40' : 'border-border',
          // isValid === false && 'border-destructive/70'
        )}
      >
        <NodeAppendix position="top" className="border-none absolute top-3 left-1 bg-transparent p-0">
          <Badge className="gap-1 self-start bg-white border-px rounded-full text-xs" variant="default">
            {/* <BadgeCheckIcon className="size-4" /> */}
            <div className="flex h-2 w-2 items-center justify-center text-muted-foreground">{iconElement}</div>
            <span className="text-[6px]">{label}</span>
          </Badge>
        </NodeAppendix>
        <Collapsible open={open} onOpenChange={setOpen}>
          {' '}
          {/* Header */}
          <BaseNodeHeader
            className={cn('flex items-center justify-between rounded-t-2xl bg-muted/50 px-3 py-2', {
              'border-b': isCanvasNode,
            })}
          >
            <div className="flex items-center gap-3">
              {' '}
              {iconElement && (
                <div className="flex h-7 w-7 bg-primary/40 rounded-full items-center justify-center p-1 text-muted-foreground">
                  {' '}
                  {iconElement}
                </div>
              )}
              <div className="flex flex-col">
                {' '}
                <span className="text-sm font-medium leading-tight text-foreground"> {label}</span>
                {description && <span className="text-xs text-muted-foreground"> {description} </span>}
              </div>{' '}
            </div>
            {isCanvasNode && (
              <CollapsibleTrigger className="nodrag rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground hover:bg-primary/30 hover:text-foreground transition-colors">
                {open ? '−' : '+'}
              </CollapsibleTrigger>
            )}
          </BaseNodeHeader>
          {/* Content */}
          <BaseNodeContent className="p-3">
            <CollapsibleContent>
              <div className="flex flex-col gap-3 pb-2">
                <SettingInfo
                  label="Chat Model"
                  actionLabel={chatModel ? chatModel.label : 'Add Chat'}
                  icon={chatModel?.icon}
                  className={cn(
                    'flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                    chatModel ? 'bg-primary/40 text-primary-foreground' : 'bg-muted/40 hover:bg-muted/60',
                  )}
                />
                {/* <SettingInfo
                  label="Memory"
                  actionLabel={memoryModel ? memoryModel.label : 'Add Memory'}
                  icon={memoryModel?.icon}
                  className={cn(
                    'flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                    memoryModel ? 'bg-muted text-foreground' : 'bg-muted/40 hover:bg-muted/60',
                  )}
                /> */}
              </div>
            </CollapsibleContent>
            {/* Tools */}
            {isCanvasNode && (
              <ToolInfo>
                {selectedTools?.map((tool, index) => (
                  <ConnectableItem
                    key={tool.name || index}
                    label={tool.name || 'Unnamed Tool'}
                    handleType="source"
                    innerId={index.toString()}
                    nodeId={id}
                  />
                ))}
              </ToolInfo>
            )}
          </BaseNodeContent>{' '}
          {/* Handles */}
          {isCanvasNode && (
            <>
              {' '}
              <BaseHandle id={handleTargetId} position={Position.Left} type="target" className="!bg-primary p-1" />
              <BaseHandle
                id={handleSourceId}
                position={Position.Right}
                type="source"
                className="!bg-primary p-1"
              />{' '}
            </>
          )}{' '}
          {/* Footer */}
          {/* <BaseNodeFooter className="flex items-center justify-end border-t px-3 py-2 text-xs text-muted-foreground">
            {isValid === false && (
              <span className="text-destructive">Invalid configuration</span>
            )}
          </BaseNodeFooter> */}
        </Collapsible>
      </BaseNode>
    );
  },
);
