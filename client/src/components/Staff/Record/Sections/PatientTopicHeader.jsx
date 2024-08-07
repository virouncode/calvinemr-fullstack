import TriangleButton from "../../../UI/Buttons/TriangleButton";
import PaperPlaneIcon from "../../../UI/Icons/PaperPlaneIcon";
import PopUpIcon from "../../../UI/Icons/PopUpIcon";

const PatientTopicHeader = ({
  topic,
  handlePopUpClick,
  contentsVisible,
  popUpButton,
  triangleRef,
}) => {
  return (
    <>
      <TriangleButton
        className={contentsVisible ? "triangle triangle--active" : "triangle"}
        color="#FEFEFE"
        triangleRef={triangleRef}
      />
      {topic}
      {popUpButton === "popUp" ? (
        <PopUpIcon onClick={handlePopUpClick} />
      ) : popUpButton === "paperPlane" ? (
        <PaperPlaneIcon onClick={handlePopUpClick} />
      ) : (
        <div></div>
      )}
    </>
  );
};

export default PatientTopicHeader;
