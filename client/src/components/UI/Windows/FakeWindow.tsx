import React, { useEffect, useRef, useState } from "react";
import XmarkRectangleIcon from "../Icons/XmarkRectangleIcon";

type FakeWindowProps = {
  children: React.ReactNode;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  textColor?: string;
  closeCross?: boolean;
  closeDisabled?: boolean;
};

const FakeWindow = ({
  children,
  title,
  x,
  y,
  width,
  height,
  color,
  setPopUpVisible,
  textColor = "#FEFEFE",
  closeCross = true,
  closeDisabled = false,
}: FakeWindowProps) => {
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const windowRef = useRef<HTMLDivElement | null>(null);
  const [windowPosition, setWindowPosition] = useState({ x, y });
  const [windowSize, setWindowSize] = useState({ width, height });

  // Utility function to get mouse or touch coordinates
  const getCoordinates = (e: MouseEvent | TouchEvent) => {
    if (e instanceof TouchEvent) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {
      return { x: e.clientX, y: e.clientY };
    }
  };

  useEffect(() => {
    // Make the element the frontmost one
    const elements = document.querySelectorAll(".window");
    let maxZIndex = 0;
    elements.forEach((el) => {
      const zIndex = parseInt(
        window.getComputedStyle(el).getPropertyValue("z-index")
      );
      if (!isNaN(zIndex) && zIndex > maxZIndex) {
        maxZIndex = zIndex;
      }
    });
    if (windowRef.current)
      windowRef.current.style.zIndex = (maxZIndex + 1).toString();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "w") {
        event.preventDefault();
        setPopUpVisible(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setPopUpVisible]);

  const handleDragStart = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) => {
    const nativeEvent = e.nativeEvent as MouseEvent | TouchEvent;
    const { x: startX, y: startY } = getCoordinates(nativeEvent);
    const offsetX = startX - windowPosition.x;
    const offsetY = startY - windowPosition.y;

    isDragging.current = true;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging.current) {
        const { x, y } = getCoordinates(e);
        setWindowPosition({
          x: x - offsetX,
          y:
            y - offsetY <= 0
              ? 0
              : y - offsetY >= window.innerHeight - 40
              ? window.innerHeight - 40
              : y - offsetY,
        });
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);
  };

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    isResizing.current = true;

    const handleResizeMove = (e: MouseEvent | TouchEvent) => {
      if (isResizing.current) {
        const { x, y } = getCoordinates(e);
        setWindowSize({
          width: x - windowPosition.x,
          height: y - windowPosition.y,
        });
      }
    };

    const handleResizeEnd = () => {
      isResizing.current = false;
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleResizeEnd);
      window.removeEventListener("touchmove", handleResizeMove);
      window.removeEventListener("touchend", handleResizeEnd);
    };

    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", handleResizeEnd);
    window.addEventListener("touchmove", handleResizeMove);
    window.addEventListener("touchend", handleResizeEnd);
  };

  return (
    <div
      ref={windowRef}
      className="window"
      style={{
        left: windowPosition.x,
        top: windowPosition.y,
        width: windowSize.width,
        height: windowSize.height,
      }}
    >
      <div
        className="window-title"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart} // Handle drag start on touch devices
        style={{
          background: color,
          width: windowSize.width,
        }}
      >
        <p
          style={{
            color: textColor && `${textColor}`,
            fontWeight: textColor !== "#FEFEFE" ? "bold" : "normal",
          }}
        >
          {title}
        </p>
        {closeCross && (
          <div
            onClick={() => {
              setPopUpVisible(false);
            }}
            className={
              closeDisabled
                ? "window-title-close window-title-close--disabled"
                : "window-title-close"
            }
          >
            <XmarkRectangleIcon color={textColor && `${textColor}`} />
          </div>
        )}
      </div>
      <div
        className="resize-handle"
        onMouseDown={handleResizeStart}
        onTouchStart={handleResizeStart} // Handle resizing on touch devices
        style={{ background: color }}
      ></div>
      <div className="window-content">{children}</div>
    </div>
  );
};

export default FakeWindow;
