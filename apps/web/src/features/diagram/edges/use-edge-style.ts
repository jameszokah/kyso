import type { CSSProperties } from 'react';

export type EdgeState = 'default' | 'selected' | 'temporary';

interface UseEdgeStyleProps {
  state: EdgeState;
  isHovered?: boolean;
}

export function useEdgeStyle({ state, isHovered }: UseEdgeStyleProps): CSSProperties {
  const baseStyle: CSSProperties = {
    strokeWidth: 2,
    stroke: '#b1b1b7', // muted-foreground
  };

  if (state === 'temporary') {
    return {
      ...baseStyle,
      strokeDasharray: '5,5',
      stroke: '#94a3b8', // slate-400
    };
  }

  if (state === 'selected') {
    return {
      ...baseStyle,
      stroke: '#0f172a', // primary
      strokeWidth: 3,
    };
  }

  if (isHovered) {
    return {
      ...baseStyle,
      stroke: '#64748b', // slate-500
    };
  }

  return baseStyle;
}
