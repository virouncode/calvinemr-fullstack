import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const XmarkIcon = ({ onClick, ml = 0, mr = 0, color, clickable = true }) => {
  return (
    <FontAwesomeIcon
      icon={faXmark}
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

export default XmarkIcon;
