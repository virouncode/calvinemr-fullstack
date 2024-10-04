import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type BarsIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
};

const BarsIcon = ({ onClick, ml = 0, mr = 0 }: BarsIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faBars}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        fontSize: "1.5rem",
      }}
      className="icon"
    />
  );
};

export default BarsIcon;
