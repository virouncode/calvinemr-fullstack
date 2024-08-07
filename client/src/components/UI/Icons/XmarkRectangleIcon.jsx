import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const XmarkRectangleIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  color,
  clickable = true,
}) => {
  return (
    <FontAwesomeIcon
      icon={faRectangleXmark}
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

export default XmarkRectangleIcon;
