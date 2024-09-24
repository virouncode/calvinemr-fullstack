import { useMediaQuery } from "@mui/material";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useTopic } from "../../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../../hooks/reactquery/useFetchAllPages";
import useIntersection from "../../../../../hooks/useIntersection";
import {
  DemographicsType,
  MedType,
  XanoPaginatedType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { isMedicationActive } from "../../../../../utils/medications/isMedicationActive";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ExclamationTriangleIcon from "../../../../UI/Icons/ExclamationTriangleIcon";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import MedicationFormWithoutRX from "./MedicationFormWithoutRX";
import { default as MedicationItem } from "./MedicationItem";
import RxPopUp from "./Prescription/Form/RxPopUp";

type MedicationsPopUpProps = {
  topicDatas: InfiniteData<XanoPaginatedType<MedType>> | undefined;
  topicPost: UseMutationResult<MedType, Error, Partial<MedType>, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
  isPending: boolean;
  error: Error | null;
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<MedType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
  demographicsInfos: DemographicsType;
};

const MedicationsPopUp = ({
  topicDatas,
  topicPost,
  topicDelete,
  isPending,
  error,
  patientId,
  setPopUpVisible,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
  demographicsInfos,
}: MedicationsPopUpProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const editCounter = useRef(0);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [presVisible, setPresVisible] = useState(false);
  const [medFormVisible, setMedFormVisible] = useState(false);
  const largeScreen = useMediaQuery("(min-width: 1280px)");
  //Queries
  const {
    data: allergies,
    isPending: isPendingAllergies,
    error: errorAllergies,
    fetchNextPage: fetchNextPageAllergies,
    hasNextPage: hasNextPageAllergies,
  } = useTopic("ALLERGIES & ADVERSE REACTIONS", patientId);

  //Intersection observer
  const { divRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  useFetchAllPages(fetchNextPageAllergies, hasNextPageAllergies);

  const handleClose = async () => {
    if (
      editCounter.current === 0 ||
      (editCounter.current > 0 &&
        (await confirmAlert({
          content:
            "Do you really want to close the window ? Your changes will be lost",
        })))
    ) {
      setPopUpVisible(false);
    }
  };
  const handleNewRX = () => {
    setErrMsgPost("");
    if (!largeScreen) {
      toast.warning("This feature is not available on small screens", {
        containerId: "A",
      });
      return;
    }
    setPresVisible((v) => !v);
  };
  const handleNewMed = () => {
    setMedFormVisible(true);
  };

  if (isPending) {
    return (
      <>
        <h1 className="medications__title">Patient Medications & Treatments</h1>
        <LoadingParagraph />
      </>
    );
  }
  if (error) {
    return (
      <>
        <h1 className="medications__title">Patient Medications & Treatments</h1>
        <ErrorParagraph errorMsg={error.message} />
      </>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="medications">
      <h1 className="medications__title">Patient medications & treatments</h1>
      <div className="medications__allergies">
        <ExclamationTriangleIcon /> <label>Patient allergies: </label>
        {isPendingAllergies && <LoadingParagraph />}
        {errorAllergies && <ErrorParagraph errorMsg={errorAllergies.message} />}
        {allergies && allergies.pages.flatMap((page) => page.items).length > 0
          ? allergies.pages
              .flatMap((page) => page.items)
              .map(({ OffendingAgentDescription }) => OffendingAgentDescription)
              .join(", ")
          : "No allergies"}
      </div>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <>
        <div className="medications__table-container" ref={divRef}>
          <table className="medications__table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Status</th>
                <th>Drug name</th>
                <th>Strength</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Updated By</th>
                <th>Updated On</th>
              </tr>
            </thead>
            <tbody>
              {datas && datas.length > 0
                ? datas.map((item, index) =>
                    index === datas.length - 1 ? (
                      <MedicationItem
                        item={item}
                        key={item.id}
                        lastItemRef={lastItemRef}
                        topicDelete={topicDelete}
                      />
                    ) : (
                      <MedicationItem
                        item={item}
                        key={item.id}
                        topicDelete={topicDelete}
                      />
                    )
                  )
                : !isFetchingNextPage && (
                    <EmptyRow colSpan={10} text="No medications" />
                  )}
              {isFetchingNextPage && <LoadingRow colSpan={10} />}
            </tbody>
          </table>
        </div>
        <div className="medications__btn-container">
          <Button onClick={handleNewMed} label="Add Med without RX" />
          {user.title === "Doctor" && (
            <Button onClick={handleNewRX} label="New RX" />
          )}
          <CloseButton onClick={handleClose} />
        </div>
      </>
      {presVisible && (
        <FakeWindow
          title={`NEW PRESCRIPTION to ${toPatientName(demographicsInfos)}`}
          width={window.innerWidth}
          height={790}
          x={0}
          y={(window.innerHeight - 790) / 2}
          color="#931621"
          setPopUpVisible={setPresVisible}
        >
          <RxPopUp
            demographicsInfos={demographicsInfos}
            setPresVisible={setPresVisible}
            patientId={patientId}
            topicPost={topicPost}
            activeMeds={
              datas?.filter((med) =>
                isMedicationActive(med.StartDate, med.duration)
              ) ?? []
            }
            allergies={
              allergies ? allergies.pages.flatMap((page) => page.items) : []
            }
          />
        </FakeWindow>
      )}
      {medFormVisible && (
        <FakeWindow
          title={`NEW MEDICATION of ${toPatientName(demographicsInfos)}`}
          width={700}
          height={790}
          x={window.innerWidth - 700}
          y={(window.innerHeight - 790) / 2}
          color="#931621"
          setPopUpVisible={setMedFormVisible}
        >
          <MedicationFormWithoutRX
            patientId={patientId}
            setMedFormVisible={setMedFormVisible}
            allergies={
              allergies ? allergies.pages.flatMap((page) => page.items) : []
            }
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default MedicationsPopUp;
