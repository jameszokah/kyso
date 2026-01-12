import { IconType, LayoutDirection } from '@kyso/types/common';
import { memo, useMemo, useState } from 'react';
import { BaseNode, BaseNodeHeader, BaseNodeContent } from '@/components/base-node';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { BaseHandle } from '@/components/base-handle';
import { Icon } from '@kyso/icons';
import { getHandleId } from '../../handles/get-handle-id';
import { getHandlePosition } from '../../handles/get-handle-position';

import { withOptionalPlugins } from '@/features/plugins/utils/adapter-components';
import { NodeData } from '@kyso/types/node-data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { NodeAppendix } from '@/components/node-appendix';

type WorkflowNodeTemplateProps = {
  id: string;
  icon: IconType;
  label: string;
  description: string;
  data?: NodeData;
  selected?: boolean;
  layoutDirection?: LayoutDirection;
  isConnecting?: boolean;
  showHandles?: boolean;
  isValid?: boolean;
  children?: React.ReactNode;
};

const WorkflowNodeTemplateComponent = memo(
  ({
    id,
    icon,
    label,
    description,
    layoutDirection = 'RIGHT',
    selected = false,
    showHandles = true,
    isValid,
    children,
  }: WorkflowNodeTemplateProps) => {
    const handleTargetId = getHandleId({ nodeId: id, handleType: 'target' });
    const handleSourceId = getHandleId({ nodeId: id, handleType: 'source' });
    const [open, setOpen] = useState(false);

    const handleTargetPosition = getHandlePosition({ direction: layoutDirection, handleType: 'target' });
    const handleSourcePosition = getHandlePosition({ direction: layoutDirection, handleType: 'source' });

    const iconElement = useMemo(() => <Icon name={icon} size="large" />, [icon]);

    const hasContent = !!children;

    return (
      <BaseNode
        className={cn(
          ' transition-all rounded-2xl border bg-white text-foreground shadow-sm hover:ring-2 hover:ring-primary/30',
          selected ? 'border-primary ring-2 ring-primary/50' : 'border-border',
          isValid === false && 'border-destructive',
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
          {/* Header */}{' '}
          <BaseNodeHeader
            className={cn('flex items-center justify-between bg-muted/50 px-3 py-2', {
              'border-b': hasContent,
            })}
          >
            {' '}
            <div className="flex items-center gap-2">
              {' '}
              {iconElement && (
                <div className="flex h-7 w-7 bg-primary/40 rounded-full items-center justify-center p-1 text-muted-foreground">
                  {iconElement}
                </div>
              )}{' '}
              <div className="flex flex-col">
                {' '}
                <span className="text-sm font-medium">{label}</span>{' '}
                {description && <span className="text-xs text-muted-foreground">{description}</span>}{' '}
              </div>{' '}
            </div>{' '}
            {hasContent && (
              <CollapsibleTrigger className="nodrag text-xs text-muted-foreground hover:text-foreground">
                {' '}
                {open ? '−' : '+'}{' '}
              </CollapsibleTrigger>
            )}{' '}
          </BaseNodeHeader>{' '}
          {/* Collapsible Content */}{' '}
          {hasContent && (
            <CollapsibleContent>
              <BaseNodeContent className="p-3 border-t">{children}</BaseNodeContent>{' '}
            </CollapsibleContent>
          )}{' '}
          {/* Handles */}{' '}
          {showHandles && (
            <>
              {' '}
              <BaseHandle
                id={handleTargetId}
                position={handleTargetPosition}
                type="target"
                className="!bg-primary p-1"
              />{' '}
              <BaseHandle
                id={handleSourceId}
                position={handleSourcePosition}
                type="source"
                className="!bg-primary p-1"
              />{' '}
            </>
          )}{' '}
          {/* Footer (optional) */}{' '}
          {/* <BaseNodeFooter className="flex justify-end border-t px-2 py-1 text-xs text-muted-foreground">
         
            {isValid === false && <span>Invalid node</span>}
          </BaseNodeFooter> */}
        </Collapsible>
      </BaseNode>
    );
  },
);

export const WorkflowNodeTemplate = withOptionalPlugins(WorkflowNodeTemplateComponent, 'WorkflowNodeTemplate');
