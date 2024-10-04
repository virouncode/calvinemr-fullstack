import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type LockIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
};

const LockIcon = ({ onClick, ml = 0, mr = 0 }: LockIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faLock}
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

export default LockIcon;
