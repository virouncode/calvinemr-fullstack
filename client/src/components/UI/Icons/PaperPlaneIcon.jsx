import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const PaperPlaneIcon = ({ onClick, ml = 0, mr = 0, clickable = true }) => {
  return (
    <FontAwesomeIcon
      icon={faPaperPlane}
      onClick={onClick}
      style={{
        cursor: clickable && "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default PaperPlaneIcon;
