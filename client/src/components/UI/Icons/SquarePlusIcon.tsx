import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type SquarePlusIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
};

const SquarePlusIcon = ({ onClick, ml = 0, mr = 0 }: SquarePlusIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faSquarePlus}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
      className="squareplus-icon"
    />
  );
};

export default SquarePlusIcon;
