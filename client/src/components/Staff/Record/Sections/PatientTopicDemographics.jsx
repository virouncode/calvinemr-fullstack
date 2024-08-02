import { useRef, useState } from "react";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import DemographicsContent from "../Topics/Demographics/DemographicsContent";
import DemographicsPU from "../Topics/Demographics/DemographicsPU";
import PatientTopicHeader from "./PatientTopicHeader";

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
}) => {
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef(null);
  const triangleRef = useRef(null);

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };
  //HANDLERS
  const handlePopUpClick = (e) => {
    e.stopPropagation();
    setPopUpVisible((v) => !v);
  };

  const handleTriangleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("triangle--active");
    containerRef.current.classList.toggle(
      `patient-record__topic-container--active`
    );
  };

  const handleClickHeader = () => {
    triangleRef.current.classList.toggle("triangle--active");
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
          handleTriangleClick={handleTriangleClick}
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
        <DemographicsContent
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
            <DemographicsPU
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
