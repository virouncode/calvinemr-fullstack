import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const PhoneIcon = ({ onClick, ml = 0, mr = 0, color, clickable = true }) => {
  return (
    <FontAwesomeIcon
      icon={faPhone}
      onClick={onClick}
      style={{
        cursor: clickable && "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        color: color,
        fontSize: "0.7rem",
      }}
    />
  );
};

export default PhoneIcon;
