import { faArrowsUpDownLeftRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const CrossArrowIcon = ({
  onPointerDown,
  ml = 0,
  mr = 0,
  clickable = true,
}) => {
  return (
    <FontAwesomeIcon
      icon={faArrowsUpDownLeftRight}
      onPointerDown={onPointerDown}
      style={{
        cursor: clickable && "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        touchAction: "none",
      }}
    />
  );
};

export default CrossArrowIcon;
