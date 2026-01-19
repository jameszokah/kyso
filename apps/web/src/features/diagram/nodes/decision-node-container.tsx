import useStore from '@/store/store';

import { memo } from 'react';
import { type NodeProps, type Node } from '@xyflow/react';

import { DecisionNodeTemplate } from './decision-node-template/decision-node-template';
import type { DecisionNodeSchema } from '../../../data/nodes/decision/schema';
import type { NodeDataProperties } from '@/features/json-form/types/default-properties';
import type { NodeData } from '@kyso/types/node-data';
import type { DecisionBranch } from '@/features/json-form/types/controls';

type Props = NodeProps<Node<NodeData<NodeDataProperties<DecisionNodeSchema>>>>;

export const DecisionNodeContainer = memo(({ id, data, selected }: Props) => {
  const { icon, properties } = data;
  const { label = '', description = '', decisionBranches } = properties;

  const layoutDirection = useStore((store) => store.layoutDirection);

  return (
    <>
      <DecisionNodeTemplate
        id={id}
        selected={selected}
        layoutDirection={layoutDirection}
        label={label}
        description={description}
        showHandles={true}
        icon={icon}
        decisionBranches={decisionBranches as DecisionBranch[]}
      />
    </>
  );
});
