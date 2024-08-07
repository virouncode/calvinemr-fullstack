import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const MicrophoneIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  top,
  right,
  clickable = true,
  color,
}) => {
  return (
    <FontAwesomeIcon
      icon={faMicrophone}
      onClick={onClick}
      style={{
        cursor: clickable && "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        top: `${top}px`,
        right: `${right}px`,
        position: "absolute",
        color: color,
      }}
    />
  );
};

export default MicrophoneIcon;
