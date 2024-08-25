import React from "react";
import TriangleIcon from "../Icons/TriangleIcon";

type TriangleButtonProps = {
  className?: string;
  color?: string;
  triangleRef?: React.LegacyRef<SVGSVGElement>;
};

const TriangleButton = ({
  className,
  color,
  triangleRef = null,
}: TriangleButtonProps) => {
  return (
    <TriangleIcon
      className={className}
      color={color}
      triangleRef={triangleRef}
    />
  );
};

export default TriangleButton;
