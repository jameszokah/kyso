import useStore from '@/store/store';

import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { WorkflowBuilderNode } from '@kyso/types/node-data';
import { WorkflowNodeTemplate } from './workflow-node-template/workflow-node-template';

type Props = NodeProps<WorkflowBuilderNode>;

export const NodeContainer = memo(({ id, data, selected }: Props) => {
  const { icon, properties } = data;
  const { label = '', description = '' } = properties;

  const layoutDirection = useStore((store) => store.layoutDirection);

  return (
    <>
      <WorkflowNodeTemplate
        id={id}
        selected={selected}
        layoutDirection={layoutDirection}
        data={data}
        label={label}
        description={description}
        icon={icon}
      />
    </>
  );
});
