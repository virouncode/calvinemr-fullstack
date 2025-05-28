import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type UserIconProps = {
  ml?: number;
  mr?: number;
};
const UserIcon = ({ ml, mr }: UserIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faUser}
      style={{
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
      className="icon"
    />
  );
};

export default UserIcon;
