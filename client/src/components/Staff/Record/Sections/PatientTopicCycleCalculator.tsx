import React, { useState } from "react";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import CycleCalculatorPopUp from "../Topics/CycleCalculator/CycleCalculatorPopUp";
import PatientTopicHeaderNoTriangle from "./PatientTopicHeaderNoTriangle";

type PatientTopicCycleCalculatorProps = {
  backgroundColor: string;
  textColor: string;
  patientDob: number;
  side: "right" | "left";
  patientName: string;
};

const PatientTopicCycleCalculator = ({
  backgroundColor,
  textColor,
  patientDob,
  side,
  patientName,
}: PatientTopicCycleCalculatorProps) => {
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
          topic="CYCLE DAY CALCULATOR"
          handlePopUpClick={handlePopUpClick}
        />
      </div>
      {popUpVisible && (
        <FakeWindow
          title={`CYCLE DAY CALCULATOR for ${patientName}`}
          width={500}
          height={250}
          x={(window.innerWidth - 500) / 2}
          y={(window.innerHeight - 250) / 2}
          color={backgroundColor}
          setPopUpVisible={setPopUpVisible}
        >
          <CycleCalculatorPopUp patientDob={patientDob} />
        </FakeWindow>
      )}
    </div>
  );
};

export default PatientTopicCycleCalculator;
