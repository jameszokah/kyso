import React from 'react';
import { useOnViewportChange } from '@xyflow/react';
import type { ChildrenProps } from '@kyso/types/common';

const ZoomContext = React.createContext(1);

export function ZoomProvider({ children }: ChildrenProps) {
  const [zoom, setZoom] = React.useState(1);
  useOnViewportChange({
    onChange: ({ zoom: _zoom }) => {
      if (_zoom !== zoom) {
        setZoom(_zoom);
      }
    },
  }); 

  return <ZoomContext.Provider value={zoom}>{children}</ZoomContext.Provider>;
}
