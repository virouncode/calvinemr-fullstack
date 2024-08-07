import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const CheckIcon = ({ onClick, ml = 0, mr = 0, color, clickable = true }) => {
  return (
    <FontAwesomeIcon
      icon={faCheck}
      onClick={onClick}
      style={{
        cursor: clickable && "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        color: color,
      }}
    />
  );
};

export default CheckIcon;
