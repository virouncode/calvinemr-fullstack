import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ClockIcon = ({ onClick, ml = 0, mr = 0, color = "black" }) => {
  return (
    <FontAwesomeIcon
      icon={faClockRotateLeft}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        color: color,
      }}
    />
  );
};

export default ClockIcon;
