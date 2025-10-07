import React, { useRef, useState } from "react";
import {
  useTopicDelete,
  useTopicPost,
  useTopicPut,
} from "../../../../../hooks/reactquery/mutations/topicMutations";
import { useTopic } from "../../../../../hooks/reactquery/queries/topicQueries";
import useIntersection from "../../../../../hooks/useIntersection";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import AlertForm from "./AlertForm";
import AlertItem from "./AlertItem";

type AlertsPopUpProps = {
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const AlertsPopUp = ({ patientId, setPopUpVisible }: AlertsPopUpProps) => {
  //Hooks
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const {
    data: topicDatas,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTopic("ALERTS & SPECIAL NEEDS", patientId);
  const topicPost = useTopicPost("ALERTS & SPECIAL NEEDS", patientId);
  const topicPut = useTopicPut("ALERTS & SPECIAL NEEDS", patientId);
  const topicDelete = useTopicDelete("ALERTS & SPECIAL NEEDS", patientId);

  //Intersection observer
  const { rootRef, targetRef } = useIntersection<HTMLDivElement | null>(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

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

  if (isPending) {
    return (
      <div className="alerts">
        <h1 className="alerts__title">Alerts and special needs</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="alerts">
        <h1 className="alerts__title">Alerts and special needs</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="alerts">
      <h1 className="alerts__title">Alerts and special needs</h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <>
        <div className="alerts__table-container" ref={rootRef}>
          <table className="alerts__table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Description</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Notes</th>
                <th>Updated By</th>
                <th>Updated On</th>
              </tr>
            </thead>
            <tbody>
              {addVisible && (
                <AlertForm
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
                      <AlertItem
                        item={item}
                        key={item.id}
                        editCounter={editCounter}
                        setErrMsgPost={setErrMsgPost}
                        errMsgPost={errMsgPost}
                        targetRef={targetRef}
                        topicPut={topicPut}
                        topicDelete={topicDelete}
                      />
                    ) : (
                      <AlertItem
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
                  !addVisible && <EmptyRow colSpan={7} text="No alerts" />}
              {isFetchingNextPage && <LoadingRow colSpan={7} />}
            </tbody>
          </table>
        </div>
        <div className="alerts__btn-container">
          <Button onClick={handleAdd} disabled={addVisible} label="Add" />
          <CloseButton onClick={handleClose} />
        </div>
      </>
    </div>
  );
};

export default AlertsPopUp;
