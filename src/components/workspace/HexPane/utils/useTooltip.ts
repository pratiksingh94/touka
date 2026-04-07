import { useCallback, useState } from "react";


export interface TooltipState {
  visibile: boolean;
  x: number;
  y: number;
  offset: number;
}

interface Props {
  offsetX?: number;
  offsetY?: number;
}

export function useTooltip({offsetX = 12, offsetY = 8}: Props = {}) {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visibile: false,
    x: 0,
    y: 0,
    offset: 0
  });

  const showTooltip = useCallback((e: React.MouseEvent, offset: number) => {
    setTooltip({
      visibile: true,
      x: e.clientX + offsetX,
      y: e.clientY + offsetY,
      offset,
    })
  }, [offsetX, offsetY])

  const moveTooltip = useCallback((e: MouseEvent) => {
    setTooltip(prev => prev.visibile ? {
      ...prev,
      x: e.clientX + offsetX,
      y: e.clientY + offsetY,
    } : prev)
  }, [offsetX, offsetY])

  const hideTooltip = useCallback(() => {
    setTooltip(prev => ({...prev, visibile: false}))
  }, []);

  return {
    tooltip,
    showTooltip,
    moveTooltip,
    hideTooltip
  }
}