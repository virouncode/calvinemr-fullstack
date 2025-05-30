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
import FamilyHistoryForm from "./FamilyHistoryForm";
import FamilyHistoryItem from "./FamilyHistoryItem";

type FamilyHistoryPopUpProps = {
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const FamilyHistoryPopUp = ({
  patientId,
  setPopUpVisible,
}: FamilyHistoryPopUpProps) => {
  //HOOKS
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
  } = useTopic("FAMILY HISTORY", patientId);
  const topicPost = useTopicPost("FAMILY HISTORY", patientId);
  const topicPut = useTopicPut("FAMILY HISTORY", patientId);
  const topicDelete = useTopicDelete("FAMILY HISTORY", patientId);

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
      <div className="famhistory">
        <h1 className="famhistory__title">Patient family history</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="famhistory">
        <h1 className="famhistory__title">Patient family history</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="famhistory">
      <h1 className="famhistory__title">Patient family history</h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="famhistory__table-container" ref={divRef}>
        <table className="famhistory__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Description</th>
              <th>Relative affected</th>
              <th>Start date</th>
              <th>Age at onset</th>
              <th>Life stage</th>
              <th>Treatment</th>
              <th>Notes</th>
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {addVisible && (
              <FamilyHistoryForm
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
                    <FamilyHistoryItem
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
                    <FamilyHistoryItem
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
                  <EmptyRow colSpan={10} text="No family history" />
                )}
            {isFetchingNextPage && <LoadingRow colSpan={10} />}
          </tbody>
        </table>
      </div>
      <div className="famhistory__btn-container">
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
        <CloseButton onClick={handleClose} />
      </div>
    </div>
  );
};

export default FamilyHistoryPopUp;
