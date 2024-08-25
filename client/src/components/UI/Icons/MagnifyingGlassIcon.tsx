import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type MagnifyingGlassIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
  top?: number;
  right?: number;
  clickable?: boolean;
};
const MagnifyingGlassIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  top = 0,
  right = 0,
  clickable = true,
}: MagnifyingGlassIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faMagnifyingGlass}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        position: "absolute",
        top: `${top}px`,
        right: `${right}px`,
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default MagnifyingGlassIcon;
