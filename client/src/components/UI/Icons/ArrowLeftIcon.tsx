import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type ArrowLeftIconProps = {
  onClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
  clickable?: boolean;
};

const ArrowLeftIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  clickable = true,
}: ArrowLeftIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faArrowLeft}
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

export default ArrowLeftIcon;
