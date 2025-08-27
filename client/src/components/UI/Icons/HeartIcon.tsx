import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type HeartIconProps = {
  onClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
  active: boolean;
  color?: string;
};

const HeartIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  active = false,
  color = "red",
}: HeartIconProps) => {
  return active ? (
    <FontAwesomeIcon
      icon={faSolidHeart}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        color: color,
      }}
      className="icon"
    />
  ) : (
    <FontAwesomeIcon
      icon={faRegularHeart}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
      className="icon"
    />
  );
};

export default HeartIcon;
