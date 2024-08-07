import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ArrowDownIcon = ({ onClick, ml = 0, mr = 0, clickable = true }) => {
  return (
    <FontAwesomeIcon
      icon={faArrowDown}
      onClick={onClick}
      style={{
        cursor: clickable && "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default ArrowDownIcon;
