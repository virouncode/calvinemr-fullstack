import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type GearIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
};
const GearIcon = ({ onClick, ml = 0, mr = 0 }: GearIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faGear}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        fontSize: "1.2rem",
      }}
      className="gear-icon"
    />
  );
};

export default GearIcon;
