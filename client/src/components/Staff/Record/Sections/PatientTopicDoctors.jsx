import { useRef, useState } from "react";
import { useDoctors } from "../../../../hooks/reactquery/queries/doctorsQueries";
import { usePatientDoctors } from "../../../../hooks/reactquery/queries/patientDoctorsQueries";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import FamilyDoctorsContent from "../Topics/FamilyDoctors/FamilyDoctorsContent";
import FamilyDoctorsPU from "../Topics/FamilyDoctors/FamilyDoctorsPU";
import PatientTopicHeader from "./PatientTopicHeader";

const PatientTopicDoctors = ({
  textColor,
  backgroundColor,
  patientName,
  patientId,
  contentsVisible,
  side,
  demographicsInfos,
}) => {
  //HOOKS
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef(null);
  const triangleRef = useRef(null);

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //PATIENT DOCTORS
  const {
    data: patientDoctors,
    isPending: isPendingPatientDoctors,
    error: errorPatientDoctors,
    isFetchingNextPage: isFetchingNextPagePatientDoctors,
    fetchNextPage: fetchNextPagePatientDoctors,
    isFetching: isFetchingPatientDoctors,
  } = usePatientDoctors(patientId);

  //ALL DOCTORS
  const {
    data: doctors,
    isPending: isPendingDoctors,
    error: errorDoctors,
    isFetchingNextPage: isFetchingNextPageDoctors,
    fetchNextPage: fetchNextPageDoctors,
    isFetching: isFetchingDoctors,
  } = useDoctors();

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
          topic="FAMILY DOCTORS/SPECIALISTS"
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
        <FamilyDoctorsContent
          patientDoctors={patientDoctors}
          isPending={isPendingPatientDoctors}
          error={errorPatientDoctors}
          patientId={patientId}
        />
        {popUpVisible && (
          <FakeWindow
            title={`FAMILY DOCTORS & SPECIALISTS of ${patientName}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <FamilyDoctorsPU
              patientDoctors={patientDoctors}
              isPendingPatientDoctors={isPendingPatientDoctors}
              errorPatientDoctors={errorPatientDoctors}
              isFetchingNextPagePatientDoctors={
                isFetchingNextPagePatientDoctors
              }
              fetchNextPagePatientDoctors={fetchNextPagePatientDoctors}
              isFetchingPatientDoctors={isFetchingPatientDoctors}
              doctors={doctors}
              isPendingDoctors={isPendingDoctors}
              errorDoctors={errorDoctors}
              isFetchingNextPageDoctors={isFetchingNextPageDoctors}
              fetchNextPageDoctors={fetchNextPageDoctors}
              isFetchingDoctors={isFetchingDoctors}
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
