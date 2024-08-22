import React, { useState } from "react";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import AgeCalculatorPopUp from "../Topics/AgeCalculator/AgeCalculatorPopUp";
import PatientTopicHeaderNoTriangle from "./PatientTopicHeaderNoTriangle";

type PatientTopicAgeCalculatorProps = {
  backgroundColor: string;
  textColor: string;
  patientDob: number;
  side: "right" | "left";
  patientName: string;
};

const PatientTopicAgeCalculator = ({
  backgroundColor,
  textColor,
  patientDob,
  side,
  patientName,
}: PatientTopicAgeCalculatorProps) => {
  //Hooks
  const [popUpVisible, setPopUpVisible] = useState(false);

  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  const handlePopUpClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    setPopUpVisible((v) => !v);
  };

  return (
    <div className="patient-record__topic">
      <div
        className={`patient-record__topic-header patient-record__topic-header--${side}`}
        style={TOPIC_STYLE}
      >
        <PatientTopicHeaderNoTriangle
          topic="AGE CALCULATOR"
          handlePopUpClick={handlePopUpClick}
        />
      </div>
      {popUpVisible && (
        <FakeWindow
          title={`AGE CALCULATOR for ${patientName}`}
          width={350}
          height={150}
          x={(window.innerWidth - 350) / 2}
          y={(window.innerHeight - 150) / 2}
          color={backgroundColor}
          setPopUpVisible={setPopUpVisible}
        >
          <AgeCalculatorPopUp patientDob={patientDob} />
        </FakeWindow>
      )}
    </div>
  );
};

export default PatientTopicAgeCalculator;
