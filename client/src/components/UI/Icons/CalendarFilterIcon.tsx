import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type CalendarFilterIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
};
const CalendarFilterIcon = ({
  onClick,
  ml = 0,
  mr = 0,
}: CalendarFilterIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faCalendar}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        fontSize: "1.2rem",
      }}
      className="user-icon icon"
    />
  );
};

export default CalendarFilterIcon;
