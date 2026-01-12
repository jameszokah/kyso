import useStore from '@/store/store';

import { memo } from 'react';
import { NodeProps, Node } from '@xyflow/react';

import { DecisionNodeTemplate } from './decision-node-template/decision-node-template';
import { DecisionNodeSchema } from '../../../data/nodes/decision/schema';
import { NodeDataProperties } from '@/features/json-form/types/default-properties';
import { NodeData } from '@kyso/types/node-data';
import { DecisionBranch } from '@/features/json-form/types/controls';

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
