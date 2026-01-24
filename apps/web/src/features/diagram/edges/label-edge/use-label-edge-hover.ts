import { useState } from 'react';
import useStore from '@/store/store';
import { type EdgeState, useEdgeStyle } from '../use-edge-style';

type UseLabelEdgeHoverParams = {
  id: string;
  isSelected?: boolean;
};

export function useLabelEdgeHover({ id, isSelected }: UseLabelEdgeHoverParams) {
  const draggedSegmentDestinationId = useStore((state) => state.draggedSegmentDestinationId);
  const validatedEdgeIds = useStore((state) => state.validatedEdgeIds);
  const [labelHovered, setLabelHovered] = useState(false);
  const edgeHovered = useStore((state) => state.hoveredElement === id);
  const hovered = (labelHovered || edgeHovered) && !draggedSegmentDestinationId;

  const isValidated = validatedEdgeIds.includes(id);
  const edgeState: EdgeState = isValidated ? 'validated' : isSelected ? 'selected' : 'default';
  const style = useEdgeStyle({ state: edgeState, isHovered: hovered });

  function handleMouseEnter() {
    setLabelHovered(true);
  }

  function handleMouseLeave() {
    setLabelHovered(false);
  }

  return {
    style,
    hovered,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };
}
