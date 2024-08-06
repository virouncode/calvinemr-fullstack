import { useRef, useState } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import PatientChartHealthSearch from "../../../Billing/PatientChartHealthSearch";
import RelationshipForm from "./RelationshipForm";
import RelationshipItem from "./RelationshipItem";

const RelationshipsPU = ({
  topicDatas,
  topicPost,
  topicPut,
  topicDelete,
  isPending,
  error,
  patientId,
  setPopUpVisible,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [patientSearchVisible, setPatientSearchVisible] = useState(false);
  const [patientSelected, setPatientSelected] = useState(null);

  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

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
  const handleAdd = () => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  const handleClickPatient = (e, patient) => {
    setPatientSelected(patient);
    setPatientSearchVisible(false);
  };

  if (isPending) {
    return (
      <>
        <h1 className="relationships__title">
          Patient relationships <i className="fa-solid fa-people-group"></i>
        </h1>
        <LoadingParagraph />
      </>
    );
  }
  if (error) {
    return (
      <>
        <h1 className="relationships__title">
          Patient relationships <i className="fa-solid fa-people-group"></i>
        </h1>
        <ErrorParagraph errorMsg={error.message} />
      </>
    );
  }

  const datas = topicDatas.pages.flatMap((page) => page.items);

  return (
    <>
      <h1 className="relationships__title">
        Patient relationships <i className="fa-solid fa-people-group"></i>
      </h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <>
        <div className="relationships__table-container" ref={rootRef}>
          <table className="relationships__table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Relation</th>
                <th>With Patient</th>
                <th>Updated By</th>
                <th>Updated On</th>
              </tr>
            </thead>
            <tbody>
              {addVisible && (
                <RelationshipForm
                  editCounter={editCounter}
                  setAddVisible={setAddVisible}
                  patientId={patientId}
                  setErrMsgPost={setErrMsgPost}
                  errMsgPost={errMsgPost}
                  topicPost={topicPost}
                  setPatientSearchVisible={setPatientSearchVisible}
                  patientSelected={patientSelected}
                />
              )}
              {datas && datas.length > 0
                ? datas.map((item, index) =>
                    index === datas.length - 1 ? (
                      <RelationshipItem
                        item={item}
                        key={item.id}
                        editCounter={editCounter}
                        setErrMsgPost={setErrMsgPost}
                        errMsgPost={errMsgPost}
                        lastItemRef={lastItemRef}
                        patientId={patientId}
                        topicPost={topicPost}
                        topicPut={topicPut}
                        topicDelete={topicDelete}
                        setPatientSearchVisible={setPatientSearchVisible}
                        patientSelected={patientSelected}
                        setPatientSelected={setPatientSelected}
                      />
                    ) : (
                      <RelationshipItem
                        item={item}
                        key={item.id}
                        editCounter={editCounter}
                        setErrMsgPost={setErrMsgPost}
                        errMsgPost={errMsgPost}
                        patientId={patientId}
                        topicPost={topicPost}
                        topicPut={topicPut}
                        topicDelete={topicDelete}
                        setPatientSearchVisible={setPatientSearchVisible}
                        patientSelected={patientSelected}
                        setPatientSelected={setPatientSelected}
                      />
                    )
                  )
                : !isFetchingNextPage &&
                  !addVisible && (
                    <EmptyRow colSpan="5" text="No relationships" />
                  )}
              {isFetchingNextPage && <LoadingRow colSpan="5" />}
            </tbody>
          </table>
        </div>
        <div className="relationships__btn-container">
          <Button onClick={handleAdd} disabled={addVisible} label="Add" />
          <CloseButton onClick={handleClose} />
        </div>
      </>
      {patientSearchVisible && (
        <FakeWindow
          title="PATIENT SEARCH"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setPatientSearchVisible}
        >
          <PatientChartHealthSearch handleClickPatient={handleClickPatient} />
        </FakeWindow>
      )}
    </>
  );
};

export default RelationshipsPU;
