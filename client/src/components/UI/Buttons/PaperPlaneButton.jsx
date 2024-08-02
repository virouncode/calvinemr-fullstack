

const PaperPlaneButton = ({ handlePopUpClick }) => {
  return (
    <i
      className="fa-regular fa-paper-plane"
      style={{ color: "#FEFEFE" }}
      onClick={handlePopUpClick}
    />
  );
};

export default PaperPlaneButton;
