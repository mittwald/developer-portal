import React, { ReactNode, useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@mittwald/flow-react-components";
import { IconZoomIn, IconZoomOut, IconRefresh } from "@tabler/icons-react";
import styles from "./index.module.css";

export interface InteractiveMermaidDiagramProps {
  /** Unique identifier for the diagram */
  id: string;
  /** Optional title for the diagram */
  title?: string;
  /** The mermaid diagram content (children will be the rendered mermaid block) */
  children: ReactNode;
  /** Default zoom level (default: 250) */
  defaultZoom?: number;
  /** Minimum zoom level in percent (default: 50) */
  minZoom?: number;
  /** Maximum zoom level in percent (default: 800) */
  maxZoom?: number;
  /** Zoom increment/decrement in percent (default: 20) */
  zoomStep?: number;
}

/**
 * Interactive wrapper for mermaid diagrams with zoom, pan, and fullscreen capabilities.
 * Provides:
 * - Larger inline diagram with zoom/pan controls
 * - Fullscreen modal expansion via mittwald flow components
 * - Smooth CSS transform-based zoom and pan
 */
function InteractiveMermaidDiagram({
  id,
  title,
  children,
  defaultZoom = 100,
  minZoom = 10,
  maxZoom = 1000,
  zoomStep = 20,
}: InteractiveMermaidDiagramProps) {
  const diagramRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(defaultZoom);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ mouseX: 0, mouseY: 0, panX: 0, panY: 0 });
  const currentPanRef = useRef({ x: 0, y: 0 });

  // Handle window wheel zoom - listen on window level to capture wheel before diagram
  useEffect(() => {
    const handleWindowWheel = (e: WheelEvent) => {
      // Check if we're hovering over the diagram area
      if (!diagramRef.current) return;
      const rect = diagramRef.current.getBoundingClientRect();
      const isOverDiagram =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      
      if (!isOverDiagram) return;
      
      // Only handle zoom if ctrl/cmd is held
      if (!e.ctrlKey && !e.metaKey) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
      setZoom((currentZoom) => Math.max(minZoom, Math.min(maxZoom, currentZoom + delta)));
    };

    window.addEventListener("wheel", handleWindowWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWindowWheel);
    };
  }, [minZoom, maxZoom]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(maxZoom, prev + zoomStep));
  }, [maxZoom, zoomStep]);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(minZoom, prev - zoomStep));
  }, [minZoom, zoomStep]);

  const handleReset = useCallback(() => {
    setZoom(defaultZoom);
    setPanX(0);
    setPanY(0);
    currentPanRef.current = { x: 0, y: 0 };
  }, [defaultZoom]);

  // Pan with mouse drag - only on SVG, not on buttons
  const handleDiagramMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Check if click is on a button or control
    if (target.tagName === "BUTTON" || target.closest("button")) return;
    
    setIsPanning(true);
    // Store starting mouse position AND current actual pan values (from ref, not stale state)
    panStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      panX: currentPanRef.current.x,
      panY: currentPanRef.current.y,
    };
  };

  const handleDiagramMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    
    e.preventDefault();
    
    // Calculate mouse movement in viewport space
    const zoomFactor = zoom / 100;
    const mouseDeltaX = e.clientX - panStartRef.current.mouseX;
    const mouseDeltaY = e.clientY - panStartRef.current.mouseY;
    
    // Convert mouse movement to pan space by dividing by zoom
    const panDeltaX = mouseDeltaX / zoomFactor;
    const panDeltaY = mouseDeltaY / zoomFactor;
    
    // Calculate new pan: starting pan + movement delta (in pan space)
    const newPanX = panStartRef.current.panX + panDeltaX;
    const newPanY = panStartRef.current.panY + panDeltaY;
    
    // Track latest pan values
    currentPanRef.current = { x: newPanX, y: newPanY };
    
    // Update inline style directly without setState - no re-render, no flicker
    if (diagramRef.current) {
      const newTransform = `scale(${zoomFactor}) translate(${newPanX}px, ${newPanY}px)`;
      diagramRef.current.style.transform = newTransform;
    }
  };

  const handleDiagramMouseUp = () => {
    if (!isPanning) return;
    
    setIsPanning(false);
    
    // Sync final pan values back to state for persistence
    setPanX(currentPanRef.current.x);
    setPanY(currentPanRef.current.y);
  };

  const transformStyle = {
    transform: `scale(${zoom / 100}) translate(${panX}px, ${panY}px)`,
    transformOrigin: "center center",
  };

  const DiagramView = () => (
    <div className={styles.diagramWrapper}>
      <div className={styles.controls}>
        <div className={styles.zoomControls}>
          <Button
            variant="soft"
            size="s"
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            <IconZoomOut size={16} />
          </Button>
          <span className={styles.zoomLevel}>{zoom}%</span>
          <Button
            variant="soft"
            size="s"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            <IconZoomIn size={16} />
          </Button>
          <Button
            variant="soft"
            size="s"
            onClick={handleReset}
            aria-label="Reset zoom"
          >
            <IconRefresh size={16} />
          </Button>
        </div>
      </div>
      
      <div
        ref={diagramRef}
        className={styles.diagram}
        style={transformStyle as React.CSSProperties}
        onMouseDown={handleDiagramMouseDown}
        onMouseMove={handleDiagramMouseMove}
        onMouseUp={handleDiagramMouseUp}
        onMouseLeave={handleDiagramMouseUp}
        role="img"
        aria-label={title || "Interactive diagram"}
      >
        <div className={styles.diagramContent} ref={contentRef}>
          {children}
        </div>
      </div>
      
      <div className={styles.hint}>
        <small>💡 Ctrl+Scroll to zoom • Drag to pan • Buttons to control</small>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.inlineView}>
        <DiagramView />
      </div>
    </div>
  );
}

export default InteractiveMermaidDiagram;
