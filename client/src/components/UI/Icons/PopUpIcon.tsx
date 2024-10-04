import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type PopUpIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
  clickable?: boolean;
};
const PopUpIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  clickable = true,
}: PopUpIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faArrowUpRightFromSquare}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        color: "#FEFEFE",
        fontSize: "0.7rem",
      }}
      className="icon"
    />
  );
};

export default PopUpIcon;
