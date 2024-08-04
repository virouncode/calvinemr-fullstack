import { useEffect, useRef, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useTopic } from "../../../../../hooks/reactquery/queries/topicQueries";
import useIntersection from "../../../../../hooks/useIntersection";
import { isMedicationActive } from "../../../../../utils/medications/isMedicationActive";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import MedicationFormWithoutRX from "./MedicationFormWithoutRX";
import { default as MedicationItem } from "./MedicationItem";
import RxPU from "./Prescription/Form/RxPU";

const MedicationsPU = ({
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
}) => {
  //HOOKS
  const { user } = useUserContext();
  const editCounter = useRef(0);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [presVisible, setPresVisible] = useState(false);
  const [medFormVisible, setMedFormVisible] = useState(false);
  const {
    data: allergies,
    isPending: isPendingAllergies,
    error: errorAllergies,
    fetchNextPage: fetchNextPageAllergies,
  } = useTopic("ALLERGIES & ADVERSE REACTIONS", patientId);

  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  useEffect(() => {
    const fetchAllAllergies = async () => {
      let hasMore = true;
      while (hasMore) {
        const response = await fetchNextPageAllergies();
        hasMore = response.hasMore;
      }
    };
    fetchAllAllergies();
  }, [fetchNextPageAllergies]);

  //HANDLERS
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
    setPresVisible((v) => !v);
  };
  const handleNewMed = () => {
    setMedFormVisible(true);
  };

  if (isPending) {
    return (
      <>
        <h1 className="medications__title">
          Patient Medications & Treatments <i className="fa-solid fa-pills"></i>
        </h1>
        <LoadingParagraph />
      </>
    );
  }
  if (error) {
    return (
      <>
        <h1 className="medications__title">
          Patient Medications & Treatments <i className="fa-solid fa-pills"></i>
        </h1>
        <ErrorParagraph errorMsg={error.message} />
      </>
    );
  }

  const datas = topicDatas.pages.flatMap((page) => page.items);

  return (
    <>
      <h1 className="medications__title">
        Patient medications & treatments <i className="fa-solid fa-pills"></i>
      </h1>
      <div className="medications__allergies">
        <i
          className="fa-solid fa-triangle-exclamation"
          style={{ color: "#ff0000" }}
        />{" "}
        <label>Patient allergies: </label>
        {isPendingAllergies && <LoadingParagraph />}
        {errorAllergies && <ErrorParagraph errorMsg={errorAllergies.message} />}
        {allergies && allergies.pages.flatMap((page) => page.items).length > 0
          ? allergies.pages
              .flatMap((page) => page.items)
              .map(({ OffendingAgentDescription }) => OffendingAgentDescription)
              .join(", ")
          : "No allergies"}
      </div>
      {errMsgPost && <div className="medications__err">{errMsgPost}</div>}
      <>
        <div className="medications__table-container" ref={rootRef}>
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
                    <EmptyRow colSpan="10" text="No medications" />
                  )}
              {isFetchingNextPage && <LoadingRow colSpan="10" />}
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
          width={1450}
          height={790}
          x={(window.innerWidth - 1450) / 2}
          y={(window.innerHeight - 790) / 2}
          color="#931621"
          setPopUpVisible={setPresVisible}
        >
          <RxPU
            demographicsInfos={demographicsInfos}
            setPresVisible={setPresVisible}
            patientId={patientId}
            topicPost={topicPost}
            activeMeds={
              datas &&
              datas.filter((med) =>
                isMedicationActive(med.StartDate, med.duration)
              )
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
          />
        </FakeWindow>
      )}
    </>
  );
};

export default MedicationsPU;
