import React, { useRef, useState } from "react";
import { DemographicsType } from "../../../../types/api";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import DemographicsDropDown from "../Topics/Demographics/DemographicsDropDown";
import DemographicsPopUp from "../Topics/Demographics/DemographicsPopUp";
import PatientTopicHeader from "./PatientTopicHeader";

type PatientTopicDemographicsProps = {
  demographicsInfos: DemographicsType;
  loadingPatient: boolean;
  patientId: number;
  patientName: string;
  errPatient: Error | null;
  textColor: string;
  backgroundColor: string;
  side: "right" | "left";
  contentsVisible: boolean;
};

const PatientTopicDemographics = ({
  demographicsInfos,
  loadingPatient,
  patientId,
  patientName,
  errPatient,
  textColor,
  backgroundColor,
  side,
  contentsVisible,
}: PatientTopicDemographicsProps) => {
  //Hooks
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triangleRef = useRef<SVGSVGElement | null>(null);

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
          topic="DEMOGRAPHICS"
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
        <DemographicsDropDown
          demographicsInfos={demographicsInfos}
          loadingPatient={loadingPatient}
          errPatient={errPatient}
        />

        {popUpVisible && (
          <FakeWindow
            title={`DEMOGRAPHICS of ${patientName}`}
            width={900}
            height={750}
            x={(window.innerWidth - 900) / 2}
            y={(window.innerHeight - 750) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <DemographicsPopUp
              demographicsInfos={demographicsInfos}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              loadingPatient={loadingPatient}
              errPatient={errPatient}
            />
          </FakeWindow>
        )}
      </div>
    </div>
  );
};

export default PatientTopicDemographics;
