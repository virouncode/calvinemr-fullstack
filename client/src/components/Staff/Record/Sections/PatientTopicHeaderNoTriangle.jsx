import PopUpButton from "../../../UI/Buttons/PopUpButton";

const PatientTopicHeaderNoTriangle = ({ topic, handlePopUpClick }) => {
  return (
    <>
      <div style={{ width: "5px", heigth: "5px", visiblitiy: "hidden" }}></div>
      <div>{topic}</div>
      <PopUpButton handlePopUpClick={handlePopUpClick} />
    </>
  );
};

export default PatientTopicHeaderNoTriangle;
