import { faUserDoctor } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const DoctorAbsoluteIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  top,
  right,
  clickable = true,
  noPrint = true,
}) => {
  return (
    <FontAwesomeIcon
      icon={faUserDoctor}
      onClick={onClick}
      style={{
        position: "absolute",
        cursor: clickable && "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        className: noPrint && "no-print",
        top: `${top}px`,
        right: `${right}px`,
      }}
    />
  );
};

export default DoctorAbsoluteIcon;
