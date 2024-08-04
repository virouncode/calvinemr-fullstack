import { useRef, useState } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import RiskForm from "./RiskForm";
import RiskItem from "./RiskItem";

const RiskPU = ({
  topicDatas,
  topicPost,
  topicPut,
  topicDelete,
  isPending,
  error,
  patientId,
  setPopUpVisible,
  isFetchingNextPage,
  isFetching,
  fetchNextPage,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  //HANDLERS
  const handleClose = async (e) => {
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

  const handleAdd = (e) => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  if (isPending) {
    return (
      <>
        <h1 className="risk__title">
          Patient risk factors & prevention{" "}
          <i className="fa-solid fa-triangle-exclamation"></i>
        </h1>
        <LoadingParagraph />
      </>
    );
  }
  if (error) {
    return (
      <>
        <h1 className="risk__title">
          Patient risk factors & prevention{" "}
          <i className="fa-solid fa-triangle-exclamation"></i>
        </h1>
        <ErrorParagraph errorMsg={error.message} />
      </>
    );
  }

  const datas = topicDatas.pages.flatMap((page) => page.items);

  return (
    <>
      <h1 className="risk__title">
        Patient risk factors & prevention{" "}
        <i className="fa-solid fa-triangle-exclamation"></i>
      </h1>
      {errMsgPost && <div className="risk__err">{errMsgPost}</div>}
      <>
        <div className="risk__table-container" ref={rootRef}>
          <table className="risk__table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Risk factor</th>
                <th>Exposure details</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Age of onset</th>
                <th>Life stage</th>
                <th>Notes</th>
                <th>Updated By</th>
                <th>Updated On</th>
              </tr>
            </thead>
            <tbody>
              {addVisible && (
                <RiskForm
                  editCounter={editCounter}
                  setAddVisible={setAddVisible}
                  patientId={patientId}
                  setErrMsgPost={setErrMsgPost}
                  errMsgPost={errMsgPost}
                  topicPost={topicPost}
                />
              )}
              {datas && datas.length > 0
                ? datas.map((item, index) =>
                    index === datas.length - 1 ? (
                      <RiskItem
                        item={item}
                        key={item.id}
                        editCounter={editCounter}
                        setErrMsgPost={setErrMsgPost}
                        errMsgPost={errMsgPost}
                        lastItemRef={lastItemRef}
                        topicPut={topicPut}
                        topicDelete={topicDelete}
                      />
                    ) : (
                      <RiskItem
                        item={item}
                        key={item.id}
                        editCounter={editCounter}
                        setErrMsgPost={setErrMsgPost}
                        errMsgPost={errMsgPost}
                        topicPut={topicPut}
                        topicDelete={topicDelete}
                      />
                    )
                  )
                : !isFetchingNextPage &&
                  !addVisible && (
                    <EmptyRow colSpan="10" text="No risk factors" />
                  )}
              {isFetchingNextPage && <LoadingRow colSpan="10" />}
            </tbody>
          </table>
        </div>
        <div className="risk__btn-container">
          <Button onClick={handleAdd} disabled={addVisible} label="Add" />
          <CloseButton onClick={handleClose} />
        </div>
      </>
    </>
  );
};

export default RiskPU;
