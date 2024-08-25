import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React, { useRef } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import {
  DemographicsType,
  DoctorType,
  XanoPaginatedType,
} from "../../../../../types/api";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import PatientClinicDoctorsList from "./PatientClinicDoctorsList";
import PatientFamilyDoctorsList from "./PatientFamilyDoctorsList";

type FamilyDoctorsPopUpProps = {
  patientDoctors:
    | InfiniteData<XanoPaginatedType<DoctorType>, unknown>
    | undefined;
  isPendingPatientDoctors: boolean;
  errorPatientDoctors: Error | null;
  isFetchingNextPagePatientDoctors: boolean;
  fetchNextPagePatientDoctors: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<DoctorType>, unknown>,
      Error
    >
  >;
  isFetchingPatientDoctors: boolean;
  doctors: InfiniteData<XanoPaginatedType<DoctorType>, unknown> | undefined;
  isPendingDoctors: boolean;
  errorDoctors: Error | null;
  isFetchingNextPageDoctors: boolean;
  fetchNextPageDoctors: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<DoctorType>, unknown>,
      Error
    >
  >;
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  demographicsInfos: DemographicsType;
};

const FamilyDoctorsPopUp = ({
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
}: FamilyDoctorsPopUpProps) => {
  //Hooks
  const editCounter = useRef(0);
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
      <>
        <h1 className="doctors__title">Patient family doctors & specialists</h1>
        <LoadingParagraph />
      </>
    );
  }
  if (errorPatientDoctors) {
    return (
      <>
        <h1 className="doctors__title">Patient family doctors & specialists</h1>
        <ErrorParagraph errorMsg={errorPatientDoctors.message} />
      </>
    );
  }

  return (
    <>
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
    </>
  );
};

export default FamilyDoctorsPopUp;
