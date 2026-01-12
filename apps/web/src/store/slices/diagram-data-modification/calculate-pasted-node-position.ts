import { Node } from '@xyflow/react';
import { Point } from '@kyso/types/common';
import { subtractPoints } from '@/utils/points';
import { getNodesCenterPoint } from '@/utils/position-utils';

export function calculateNodePastePositionOffset(nodes: Node[], pastePosition: Point): Point {
  const nodesCenterPoint = getNodesCenterPoint(nodes);

  return subtractPoints(pastePosition, nodesCenterPoint);
}
