import useStore from '@/store/store';

import { type NodeProps, type Node } from '@xyflow/react';
import type { NodeData } from '@kyso/types/node-data';
import { memo, useMemo } from 'react';

import type { VoiceAgentNodeSchema } from '../../../data/nodes/voice-agent/schema';
import type { NodeDataProperties } from '../../json-form/types/default-properties';
import { VoiceAgentNodeTemplate } from './voice-agent-node-template/voice-agent-node-template';
import { modelProviderOptions } from '@/data/nodes/voice-agent/select-options';

type Props = NodeProps<Node<NodeData<NodeDataProperties<VoiceAgentNodeSchema>>>>;

export const VoiceNodeContainer = memo(({ id, data, selected }: Props) => {
  const { icon, properties, type } = data;
  const { label = '', description = '', model } = properties;

  const nodeDefinition = useStore((store) => store.getNodeDefinition(type));

  const selectedModelOption = useMemo(() => {
    if (!model || !nodeDefinition) {
      return;
    }
    return Object.values(modelProviderOptions).find((x) => x.value === model.provider);
  }, [model, nodeDefinition]);

  // const selectedMemoryOptions = useMemo(() => {
  //   if (!memory || !nodeDefinition) {
  //     return;
  //   }
  //   return Object.values(memoryOptions).find((x) => x.value === memory);
  // }, [memory, nodeDefinition]);

  return (
    <>
      <VoiceAgentNodeTemplate
        id={id}
        selected={selected}
        label={label}
        description={description}
        icon={icon}
        chatModel={selectedModelOption}
        // memoryModel={selectedMemoryOptions}
        selectedTools={data.properties.tools}
      />
    </>
  );
});
