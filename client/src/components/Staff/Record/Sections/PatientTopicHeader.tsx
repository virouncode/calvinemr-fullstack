import React from "react";
import TriangleButton from "../../../UI/Buttons/TriangleButton";
import PaperPlaneIcon from "../../../UI/Icons/PaperPlaneIcon";
import PopUpIcon from "../../../UI/Icons/PopUpIcon";

type PatientTopicHeaderProps = {
  topic: string;
  handlePopUpClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  contentsVisible: boolean;
  popUpButton: string;
  triangleRef: React.MutableRefObject<SVGSVGElement | null>;
};

const PatientTopicHeader = ({
  topic,
  handlePopUpClick,
  contentsVisible,
  popUpButton,
  triangleRef,
}: PatientTopicHeaderProps) => {
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
