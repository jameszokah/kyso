import type { PaletteItem } from '@kyso/types/common';
import { triggerNode } from './nodes/trigger/trigger';
import { action } from './nodes/action/action';
import { conditional } from './nodes/conditional/conditional';
import { notification } from './nodes/notification/notification';
import { delay } from './nodes/delay/delay';
import { decision } from './nodes/decision/decision';
import { aiAgent } from './nodes/ai-agent/ai-agent';

export const paletteData: PaletteItem[] = [triggerNode, action, delay, conditional, decision, notification, aiAgent];

import { startNode } from './nodes/start-node/start-node';
import { endNode } from './nodes/end-node/end-node';
import { voiceAgent } from './nodes/voice-agent/voice-agent';

import { toolNode } from './nodes/tool-node/tool-node';

export const voicePaletteData: PaletteItem[] = [startNode, voiceAgent, toolNode, endNode];
