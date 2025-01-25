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
import PastHealthForm from "./PastHealthForm";
import PastHealthItem from "./PastHealthItem";

type PastHealthPopUpProps = {
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const PastHealthPopUp = ({
  patientId,
  setPopUpVisible,
}: PastHealthPopUpProps) => {
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
  } = useTopic("PAST HEALTH", patientId);
  const topicPost = useTopicPost("PAST HEALTH", patientId);
  const topicPut = useTopicPut("PAST HEALTH", patientId);
  const topicDelete = useTopicDelete("PAST HEALTH", patientId);

  //INTERSECTION OBSERVER
  const { divRef, lastItemRef } = useIntersection(
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

  if (isPending) {
    return (
      <div className="pasthealth">
        <h1 className="pasthealth__title">Patient past health</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="pasthealth">
        <h1 className="pasthealth__title">Patient past health</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }
  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="pasthealth">
      <h1 className="pasthealth__title">Patient past health</h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="pasthealth__table-container" ref={divRef}>
        <table className="pasthealth__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Description/Procedure</th>
              <th>Onset date</th>
              <th>Life Stage</th>
              <th>Procedure date</th>
              <th>Resolved date</th>
              <th>Problem status</th>
              <th>Notes</th>
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {addVisible && (
              <PastHealthForm
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
                    <PastHealthItem
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
                    <PastHealthItem
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
                !addVisible && <EmptyRow colSpan={10} text="No past health" />}
            {isFetchingNextPage && <LoadingRow colSpan={10} />}
          </tbody>
        </table>
      </div>
      <div className="pasthealth__btn-container">
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
        <CloseButton onClick={handleClose} />
      </div>
    </div>
  );
};

export default PastHealthPopUp;
