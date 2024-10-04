import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type UserPlusAbsoluteIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
  top: number;
  right: number;
  clickable?: boolean;
  noPrint?: boolean;
};
const UserPlusAbsoluteIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  top,
  right,
  clickable = true,
  noPrint = true,
}: UserPlusAbsoluteIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faUserPlus}
      onClick={onClick}
      style={{
        position: "absolute",
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        top: `${top}px`,
        right: `${right}px`,
      }}
      className={noPrint ? "no-print icon" : "icon"}
    />
  );
};

export default UserPlusAbsoluteIcon;
