import React from "react";
import TriangleIcon from "../Icons/TriangleIcon";
type TriangleClinicalButtonProps = {
  className?: string;
  color?: string;
  triangleRef?: React.LegacyRef<SVGSVGElement>;
};
const TriangleClinicalButton = ({
  className,
  color,
  triangleRef = null,
}: TriangleClinicalButtonProps) => {
  return (
    <TriangleIcon
      className={className}
      rotation={180}
      color={color}
      triangleRef={triangleRef}
    />
  );
};

export default TriangleClinicalButton;
