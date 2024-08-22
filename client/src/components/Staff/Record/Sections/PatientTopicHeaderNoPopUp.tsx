import React from "react";
import TriangleButton from "../../../UI/Buttons/TriangleButton";

type PatientTopicHeaderNoPopUpProps = {
  topic: string;
  contentsVisible: boolean;
  triangleRef: React.MutableRefObject<SVGSVGElement | null>;
};

const PatientTopicHeaderNoPopUp = ({
  topic,
  contentsVisible,
  triangleRef,
}: PatientTopicHeaderNoPopUpProps) => {
  return (
    <>
      <TriangleButton
        className={contentsVisible ? "triangle triangle--active" : "triangle"}
        color="#FEFEFE"
        triangleRef={triangleRef}
      />
      {topic}
    </>
  );
};

export default PatientTopicHeaderNoPopUp;
