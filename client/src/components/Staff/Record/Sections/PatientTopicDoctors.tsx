import React, { useRef, useState } from "react";
import { DemographicsType, DoctorType } from "../../../../types/api";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import FamilyDoctorsDropDown from "../Topics/FamilyDoctors/FamilyDoctorsDropDown";
import FamilyDoctorsPopUp from "../Topics/FamilyDoctors/FamilyDoctorsPopUp";
import PatientTopicHeader from "./PatientTopicHeader";

type PatientTopicDoctorsProps = {
  textColor: string;
  backgroundColor: string;
  patientName: string;
  patientId: number;
  contentsVisible: boolean;
  side: "right" | "left";
  demographicsInfos: DemographicsType;
  data: DoctorType[];
};

const PatientTopicDoctors = ({
  textColor,
  backgroundColor,
  patientName,
  patientId,
  contentsVisible,
  side,
  demographicsInfos,
  data,
}: PatientTopicDoctorsProps) => {
  //Hooks
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triangleRef = useRef<SVGSVGElement | null>(null);
  //Queries

  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  const handlePopUpClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    setPopUpVisible((v) => !v);
  };

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
        <PatientTopicHeader
          topic="FAMILY DOCTORS & SPECIALISTS"
          handlePopUpClick={handlePopUpClick}
          contentsVisible={contentsVisible}
          popUpButton="popUp"
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
        <FamilyDoctorsDropDown
          patientId={patientId}
          demographicsInfos={demographicsInfos}
          data={data}
        />
        {popUpVisible && (
          <FakeWindow
            title={`FAMILY DOCTORS & SPECIALISTS of ${patientName}`}
            width={window.innerWidth}
            height={600}
            x={0}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <FamilyDoctorsPopUp
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
      </div>
    </div>
  );
};

export default PatientTopicDoctors;
