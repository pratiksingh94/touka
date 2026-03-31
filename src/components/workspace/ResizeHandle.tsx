import { useEffect, useRef } from "react";

interface HorizontalProps {
  onResize: (delta: number) => void;
}

export function HorizontalResizeHandle({onResize}: HorizontalProps) {
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let startY = 0;
    let isResizing = false;

    const handleMouseMove = (e: MouseEvent) => {
      if(!isResizing) return;
      const delta = e.clientY - startY;
      onResize(delta);
      startY = e.clientY
    }

    const handleMouseUp = () => {
      isResizing = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp)

      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isResizing = true;
      startY = e.clientY;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp)

      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    }

    const element = handleRef.current;
    if(element) {
      element.addEventListener("mousedown", handleMouseDown);
      return () => element.removeEventListener("mousedown", handleMouseDown)
    }
  }, [onResize])

  return (
    <div ref={handleRef} className="h-[5px] bg-border cursor-row-resize hover:bg-accent transition-colors"/>
  )
}



interface VerticalProps {
  onResize: (delta: number) => void;
}

export function VertocalResizeHandle({onResize}: VerticalProps) {
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let startX = 0;
    let isResizing = false;

    const handleMouseMove = (e: MouseEvent) => {
      if(!isResizing) return;
      const delta = e.clientX - startX;
      onResize(delta);
      startX = e.clientX
    }

    const handleMouseUp = () => {
      isResizing = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp)

      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isResizing = true;
      startX = e.clientX;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp)

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    const element = handleRef.current;
    if(element) {
      element.addEventListener("mousedown", handleMouseDown);
      return () => element.removeEventListener("mousedown", handleMouseDown)
    }
  }, [onResize])

  return (
    <div ref={handleRef} className="w-[5px] bg-border cursor-col-resize hover:bg-accent transition-colors"/>
  )
}