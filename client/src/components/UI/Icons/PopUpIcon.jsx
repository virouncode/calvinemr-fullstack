import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const PopUpIcon = ({ onClick, ml = 0, mr = 0, clickable = true }) => {
  return (
    <FontAwesomeIcon
      icon={faArrowUpRightFromSquare}
      onClick={onClick}
      style={{
        cursor: clickable && "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        color: "#FEFEFE",
        fontSize: "0.7rem",
      }}
    />
  );
};

export default PopUpIcon;
