import PopUpIcon from "../../../UI/Icons/PopUpIcon";

const PatientTopicHeaderNoTriangle = ({ topic, handlePopUpClick }) => {
  return (
    <>
      <div style={{ width: "5px", heigth: "5px", visiblitiy: "hidden" }}></div>
      <div>{topic}</div>
      <PopUpIcon onClick={handlePopUpClick} />
    </>
  );
};

export default PatientTopicHeaderNoTriangle;
