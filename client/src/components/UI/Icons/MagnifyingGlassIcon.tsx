import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMediaQuery } from "@mui/material";
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
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
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
        fontSize: isTabletOrMobile ? "1rem" : "$size-sm",
      }}
      className="icon"
    />
  );
};

export default MagnifyingGlassIcon;
