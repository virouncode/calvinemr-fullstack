import React, { useRef } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import { DemographicsType } from "../../../../../types/api";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import PatientClinicDoctorsList from "./PatientClinicDoctorsList";
import PatientFamilyDoctorsList from "./PatientFamilyDoctorsList";
import { useDoctors } from "../../../../../hooks/reactquery/queries/doctorsQueries";
import { usePatientDoctors } from "../../../../../hooks/reactquery/queries/patientDoctorsQueries";

type FamilyDoctorsPopUpProps = {
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  demographicsInfos: DemographicsType;
};

const FamilyDoctorsPopUp = ({
  patientId,
  setPopUpVisible,
  demographicsInfos,
}: FamilyDoctorsPopUpProps) => {
  //Hooks
  const editCounter = useRef(0);

  const {
    data: patientDoctors,
    isPending: isPendingPatientDoctors,
    error: errorPatientDoctors,
    isFetchingNextPage: isFetchingNextPagePatientDoctors,
    fetchNextPage: fetchNextPagePatientDoctors,
    isFetching: isFetchingPatientDoctors,
  } = usePatientDoctors(patientId);
  const {
    data: doctors,
    isPending: isPendingDoctors,
    error: errorDoctors,
    isFetchingNextPage: isFetchingNextPageDoctors,
    fetchNextPage: fetchNextPageDoctors,
    isFetching: isFetchingDoctors,
  } = useDoctors();
  //Intersection observer
  const {
    divRef: rootRefPatientDoctors,
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
      <div className="doctors">
        <h1 className="doctors__title">Patient family doctors & specialists</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (errorPatientDoctors) {
    return (
      <div className="doctors">
        <h1 className="doctors__title">Patient family doctors & specialists</h1>
        <ErrorParagraph errorMsg={errorPatientDoctors.message} />
      </div>
    );
  }

  return (
    <div className="doctors">
      <h1 className="doctors__title">Patient family doctors & specialists</h1>
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
        isFetchingDoctors={isFetchingPatientDoctors}
      />
      <div className="doctors__btn-container">
        <CloseButton onClick={handleClose} />
      </div>
    </div>
  );
};

export default FamilyDoctorsPopUp;
