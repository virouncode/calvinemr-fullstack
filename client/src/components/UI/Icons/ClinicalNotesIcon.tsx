import { faLaptopMedical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type ClinicalNotesIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
};
const ClinicalNotesIcon = ({
  onClick,
  ml = 0,
  mr = 0,
}: ClinicalNotesIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faLaptopMedical}
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

export default ClinicalNotesIcon;
