import React, { useRef } from "react";
import { DemographicsType } from "../../../../types/api";
import LabelsDropDown from "../Topics/Labels/LabelsDropDown";
import PatientTopicHeaderNoPopUp from "./PatientTopicHeaderNoPopUp";

type PatientTopicLabelsProps = {
  textColor: string;
  backgroundColor: string;
  contentsVisible: boolean;
  side: string;
  demographicsInfos: DemographicsType;
};

const PatientTopicLabel = ({
  textColor,
  backgroundColor,
  contentsVisible,
  side,
  demographicsInfos,
}: PatientTopicLabelsProps) => {
  //Hooks
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triangleRef = useRef<SVGSVGElement | null>(null);

  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  const handleClickHeader = () => {
    if (triangleRef.current)
      triangleRef.current.classList.toggle("triangle--active");
    if (containerRef.current)
      containerRef.current.classList.toggle(
        `patient-record__topic-container--active`
      );
  };

  return (
    <div className="patient-record__topic">
      <div
        className={`patient-record__topic-header patient-record__topic-header--${side}`}
        style={TOPIC_STYLE}
        onClick={handleClickHeader}
      >
        <PatientTopicHeaderNoPopUp
          topic="LABELS"
          contentsVisible={contentsVisible ?? false}
          triangleRef={triangleRef}
        />
      </div>
      <div
        className={
          contentsVisible
            ? `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active`
            : `patient-record__topic-container patient-record__topic-container--${side} `
        }
        ref={containerRef}
      >
        {/* LABELS */}
        <LabelsDropDown demographicsInfos={demographicsInfos} />
      </div>
    </div>
  );
};

export default PatientTopicLabel;
