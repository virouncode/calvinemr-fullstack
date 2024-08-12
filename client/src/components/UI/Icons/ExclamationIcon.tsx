import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type ExclamationIconProps = {
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  ml?: number;
  mr?: number;
  color?: string;
};

const ExclamationIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  color = "red",
}: ExclamationIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faCircleExclamation}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        color: color,
      }}
    />
  );
};

export default ExclamationIcon;
