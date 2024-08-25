import { faUserDoctor } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type DoctorAbsoluteIconProps = {
  onClick: () => void;
  ml?: number;
  mr?: number;
  top: number;
  right: number;
  clickable?: boolean;
  noPrint?: boolean;
};
const DoctorAbsoluteIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  top,
  right,
  clickable = true,
  noPrint = true,
}: DoctorAbsoluteIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faUserDoctor}
      onClick={onClick}
      style={{
        position: "absolute",
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        top: `${top}px`,
        right: `${right}px`,
      }}
      className={noPrint ? "no-print" : ""}
    />
  );
};

export default DoctorAbsoluteIcon;
