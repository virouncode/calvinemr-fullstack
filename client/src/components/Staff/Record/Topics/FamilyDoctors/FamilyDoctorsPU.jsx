import { useRef } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import DoctorIcon from "../../../../UI/Icons/DoctorIcon";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import PatientClinicDoctorsList from "./PatientClinicDoctorsList";
import PatientFamilyDoctorsList from "./PatientFamilyDoctorsList";

const FamilyDoctorsPU = ({
  patientDoctors,
  isPendingPatientDoctors,
  errorPatientDoctors,
  isFetchingNextPagePatientDoctors,
  fetchNextPagePatientDoctors,
  isFetchingPatientDoctors,
  doctors,
  isPendingDoctors,
  errorDoctors,
  isFetchingNextPageDoctors,
  fetchNextPageDoctors,
  patientId,
  setPopUpVisible,
  demographicsInfos,
}) => {
  //HOOKS
  const editCounter = useRef(0);

  //INTERSECTION OBSERVER
  const {
    rootRef: rootRefPatientDoctors,
    lastItemRef: lastItemRefPatientDoctors,
  } = useIntersection(
    isFetchingNextPagePatientDoctors,
    fetchNextPagePatientDoctors,
    isFetchingPatientDoctors
  );

  //HANDLERS
  const handleClose = async () => {
    if (
      editCounter.current === 0 ||
      (editCounter.current > 0 &&
        (await confirmAlert({
          content: "Do you really want to close the window ?",
        })))
    ) {
      setPopUpVisible(false);
    }
  };

  if (isPendingPatientDoctors) {
    return (
      <>
        <h1 className="doctors__title">
          Patient family doctors & specialists <DoctorIcon clickable={false} />
        </h1>
        <LoadingParagraph />
      </>
    );
  }
  if (errorPatientDoctors) {
    return (
      <>
        <h1 className="doctors__title">
          Patient family doctors & specialists <DoctorIcon clickable={false} />
        </h1>
        <ErrorParagraph errorMsg={errorPatientDoctors.message} />
      </>
    );
  }

  return (
    <>
      <h1 className="doctors__title">
        Patient family doctors & specialists <DoctorIcon clickable={false} />
      </h1>
      <PatientClinicDoctorsList
        patientId={patientId}
        demographicsInfos={demographicsInfos}
      />
      <PatientFamilyDoctorsList
        rootRefPatientDoctors={rootRefPatientDoctors}
        lastItemRefPatientDoctors={lastItemRefPatientDoctors}
        patientDoctors={patientDoctors}
        patientId={patientId}
        isFetchingNextPagePatientDoctors={isFetchingNextPagePatientDoctors}
        demographicsInfos={demographicsInfos}
        editCounter={editCounter}
        doctors={doctors}
        isPendingDoctors={isPendingDoctors}
        errorDoctors={errorDoctors}
        isFetchingNextPageDoctors={isFetchingNextPageDoctors}
        fetchNextPageDoctors={fetchNextPageDoctors}
      />
      <div className="doctors__btn-container">
        <CloseButton onClick={handleClose} />
      </div>
    </>
  );
};

export default FamilyDoctorsPU;
