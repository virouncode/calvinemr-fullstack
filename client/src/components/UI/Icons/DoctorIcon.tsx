import { faUserDoctor } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type DoctorIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
  clickable?: boolean;
};
const DoctorIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  clickable = true,
}: DoctorIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faUserDoctor}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default DoctorIcon;
