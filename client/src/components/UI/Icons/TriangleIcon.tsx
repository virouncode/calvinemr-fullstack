import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type TriangleIconProps = {
  onClick?: () => void;
  ml?: number;
  mr?: number;
  clickable?: boolean;
  triangleRef?: React.LegacyRef<SVGSVGElement>;
  className?: string;
  color?: string;
  rotation?: 90 | 180 | 270;
};
const TriangleIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  clickable = true,
  triangleRef,
  className,
  color,
  rotation,
}: TriangleIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faPlay}
      onClick={onClick}
      rotation={rotation}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        color: color,
        fontSize: "0.7rem",
      }}
      ref={triangleRef}
      className={`${className} icon`}
    />
  );
};

export default TriangleIcon;
