import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type UserPlusIconProps = {
  onClick: () => void;
  ml?: number;
  mr?: number;
  clickable?: boolean;
};
const UserPlusIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  clickable = true,
}: UserPlusIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faUserPlus}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default UserPlusIcon;
