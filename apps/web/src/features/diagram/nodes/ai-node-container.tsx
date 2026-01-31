import useStore from '@/store/store';

import type { NodeProps, Node } from '@xyflow/react';
import type { NodeData } from '@kyso/types/node-data';
import { memo, useMemo } from 'react';

import { AiAgentNodeTemplate } from './ai-agent-node-template/ai-agent-node-template';
import type { AiAgentNodeSchema } from '../../../data/nodes/ai-agent/schema';
import type { NodeDataProperties } from '../../json-form/types/default-properties';
import { chatModelOptions, memoryOptions } from '../../../data/nodes/ai-agent/select-options';

type Props = NodeProps<Node<NodeData<NodeDataProperties<AiAgentNodeSchema>>>>;

export const AiNodeContainer = memo(({ id, data, selected }: Props) => {
  const { icon, properties, type } = data;
  const { label = '', description = '', chatModel, memory } = properties;

  const nodeDefinition = useStore((store) => store.getNodeDefinition(type));

  const selectedModelOption = useMemo(() => {
    if (!chatModel || !nodeDefinition) {
      return;
    }
    return Object.values(chatModelOptions).find((x) => x.value === chatModel);
  }, [chatModel, nodeDefinition]);

  const selectedMemoryOptions = useMemo(() => {
    if (!memory || !nodeDefinition) {
      return;
    }
    return Object.values(memoryOptions).find((x) => x.value === memory);
  }, [memory, nodeDefinition]);

  return (
    <>
      <AiAgentNodeTemplate
        id={id}
        selected={selected}
        label={label}
        description={description}
        icon={icon}
        chatModel={selectedModelOption}
        memoryModel={selectedMemoryOptions}
        selectedTools={data.properties.tools}
      />
    </>
  );
});
