import { NodeType } from '@kyso/types/node-types';
import { NodeContainer } from './nodes/node-container';
import type { NodeTypes } from '@xyflow/react';
import { AiNodeContainer } from './nodes/ai-node-container';
import { DecisionNodeContainer } from './nodes/decision-node-container';
import { VoiceNodeContainer } from './nodes/voice-node-container';

export function getNodeTypesObject(): NodeTypes {
  return {
    [NodeType.Node]: NodeContainer,
    [NodeType.AiNode]: AiNodeContainer,
    [NodeType.VoiceNode]: VoiceNodeContainer,
    [NodeType.DecisionNode]: DecisionNodeContainer,
  };
}
