

const PopUpButton = ({ handlePopUpClick }) => {
  return (
    <i
      className="fa-solid fa-arrow-up-right-from-square fa-sm"
      style={{ color: "#FEFEFE" }}
      onClick={handlePopUpClick}
    />
  );
};

export default PopUpButton;
