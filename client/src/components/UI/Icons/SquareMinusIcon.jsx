import { faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SquareMinusIcon = ({ onClick, ml, mr }) => {
  return (
    <FontAwesomeIcon
      icon={faSquareMinus}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default SquareMinusIcon;
