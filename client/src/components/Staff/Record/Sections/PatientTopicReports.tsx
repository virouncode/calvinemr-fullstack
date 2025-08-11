import React, { useRef, useState } from "react";
import { DemographicsType, ReportType } from "../../../../types/api";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import ReportsDropDown from "../Topics/Reports/ReportsDropDown";
import ReportsPopUp from "../Topics/Reports/ReportsPopUp";
import PatientTopicHeader from "./PatientTopicHeader";

type PatientTopicReportsProps = {
  backgroundColor: string;
  textColor: string;
  patientName: string;
  patientId: number;
  contentsVisible: boolean;
  side: "right" | "left";
  demographicsInfos: DemographicsType;
  reportsReceived: ReportType[];
  reportsSent: ReportType[];
};

const PatientTopicReports = ({
  backgroundColor,
  textColor,
  patientName,
  patientId,
  contentsVisible,
  side,
  demographicsInfos,
  reportsReceived,
  reportsSent,
}: PatientTopicReportsProps) => {
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
          topic="REPORTS"
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
        <ReportsDropDown
          reportsReceived={reportsReceived}
          reportsSent={reportsSent}
        />
        {popUpVisible && (
          <FakeWindow
            title={`REPORTS about ${patientName}`}
            width={window.innerWidth}
            height={window.innerHeight}
            x={0}
            y={0}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ReportsPopUp
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
      </div>
    </div>
  );
};

export default PatientTopicReports;
