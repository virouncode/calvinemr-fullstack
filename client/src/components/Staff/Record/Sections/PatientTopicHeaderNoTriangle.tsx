import React from "react";
import PopUpIcon from "../../../UI/Icons/PopUpIcon";

type PatientTopicHeaderNoTriangleProps = {
  topic: string;
  handlePopUpClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
};

const PatientTopicHeaderNoTriangle = ({
  topic,
  handlePopUpClick,
}: PatientTopicHeaderNoTriangleProps) => {
  return (
    <>
      <div style={{ width: "5px", height: "5px", visibility: "hidden" }}></div>
      <div>{topic}</div>
      <PopUpIcon onClick={handlePopUpClick} />
    </>
  );
};

export default PatientTopicHeaderNoTriangle;
