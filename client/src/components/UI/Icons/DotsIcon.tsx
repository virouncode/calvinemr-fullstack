import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type DotsIconProps = {
  onClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
  clickable?: boolean;
};

const DotsIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  clickable = true,
}: DotsIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faEllipsisVertical}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
      className="icon"
    />
  );
};

export default DotsIcon;
