import { IconType } from '@kyso/types/common';
import { LayoutDirection } from '@kyso/types/common';
import { memo, useMemo } from 'react';
import { BaseNode, BaseNodeContent, BaseNodeHeader, BaseNodeHeaderTitle } from '@/components/base-node';
import { Icon } from '@kyso/icons';
import { BranchesContainer } from './components/branches-container';
import { DecisionBranch } from '@/features/json-form/types/controls';

import { Position } from '@xyflow/react';
import { getHandleId } from '../../handles/get-handle-id';
import { BaseHandle } from '@/components/base-handle';
import { Badge } from '@/components/ui/badge';
import { NodeAppendix } from '@/components/node-appendix';
import { GitFork } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  id: string;
  icon: IconType;
  label: string;
  description: string;
  selected?: boolean;
  layoutDirection?: LayoutDirection;
  isConnecting?: boolean;
  showHandles?: boolean;
  isValid?: boolean;
  decisionBranches?: DecisionBranch[];
};

export const DecisionNodeTemplate = memo(
  ({
    id,
    icon,
    label,
    description,
    showHandles,
    selected = false,
    isValid,
    decisionBranches,
    layoutDirection,
  }: Props) => {
    const iconElement = useMemo(() => <Icon name={icon} size="large" />, [icon]);

    const handleTargetId = getHandleId({ nodeId: id, handleType: 'target' });
    const handleSourceId = getHandleId({ nodeId: id, handleType: 'source' });

    const isCanvasNode = showHandles;

    return (
      <BaseNode
        className={`bg-white rounded-2xl border transition-all hover:ring-2 hover:ring-primary/30 ${isValid === false ? 'border-destructive' : 'border-border'} ${selected ? 'border-primary ring-2 ring-primary/50' : ''} `}
      >
        <NodeAppendix position="top" className="border-none absolute top-3 left-1 bg-transparent p-0">
          <Badge className="gap-1 self-start bg-white border-px rounded-full text-xs" variant="default">
            {/* <BadgeCheckIcon className="size-4" /> */}
            <div className="flex h-2 w-2 items-center justify-center text-muted-foreground">
              <GitFork />
            </div>
            <span className="text-[6px]">Decision</span>
          </Badge>
        </NodeAppendix>
        {/* Header */}{' '}
        <BaseNodeHeader
          className={cn('flex items-center justify-between bg-muted/50 p-3 ', {
            'border-b': isCanvasNode,
          })}
        >
          {' '}
          <div className="flex items-center gap-2">
            {' '}
            {iconElement && (
              <div className="flex h-7 w-7 bg-primary/40 rounded-full items-center justify-center p-1 text-muted-foreground">
                {' '}
                <GitFork />
              </div>
            )}{' '}
            <div className="flex flex-col leading-tight">
              {' '}
              <BaseNodeHeaderTitle className="text-sm font-medium text-foreground">{label}</BaseNodeHeaderTitle>{' '}
              {description && <span className="truncate text-xs text-muted-foreground"> {description} </span>}{' '}
            </div>{' '}
          </div>{' '}
          {isValid === false && <span className="text-xs font-semibold text-destructive">Invalid</span>}{' '}
        </BaseNodeHeader>{' '}
        {/* Content */}{' '}
        {isCanvasNode && (
          <BaseNodeContent className="p-3">
            {' '}
            <BranchesContainer
              layoutDirection={layoutDirection}
              nodeId={id}
              decisionBranches={decisionBranches ?? []}
            />{' '}
          </BaseNodeContent>
        )}{' '}
        {/* Handles */}{' '}
        {isCanvasNode && (
          <>
            {' '}
            <BaseHandle id={handleTargetId} type="target" position={Position.Left} className="!bg-primary p-1" />{' '}
            <BaseHandle id={handleSourceId} type="source" position={Position.Right} className="!bg-primary p-1" />{' '}
          </>
        )}{' '}
        {/* Optional footer */}{' '}
        {/* <BaseNodeFooter className="flex justify-end border-t p-2 text-xs text-muted-foreground">

        </BaseNodeFooter> */}
      </BaseNode>
    );
  },
);
