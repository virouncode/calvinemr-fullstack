import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type GoToBottomIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
  clickable?: boolean;
};
const GoToBottomIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  clickable = true,
}: GoToBottomIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faAngleDoubleDown}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default GoToBottomIcon;
