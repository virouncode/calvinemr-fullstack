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
import ProblemListForm from "./ProblemListForm";
import ProblemListItem from "./ProblemListItem";

type ProblemListPopUpProps = {
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProblemListPopUp = ({
  patientId,
  setPopUpVisible,
}: ProblemListPopUpProps) => {
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
  } = useTopic("PROBLEM LIST", patientId);
  const topicPost = useTopicPost("PROBLEM LIST", patientId);
  const topicPut = useTopicPut("PROBLEM LIST", patientId);
  const topicDelete = useTopicDelete("PROBLEM LIST", patientId);
  //Intersection observer
  const { divRef, lastItemRef } = useIntersection(
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
      <div className="problemlist">
        <h1 className="problemlist__title">Patient problem list</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="problemlist">
        <h1 className="problemlist__title">Patient problem list</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="problemlist">
      <h1 className="problemlist__title">Patient problem list</h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="problemlist__table-container" ref={divRef}>
        <table className="problemlist__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Diagnosis Description</th>
              <th>Problem Description</th>
              <th>Status</th>
              <th>Onset date</th>
              <th>Life stage</th>
              <th>Resolution date</th>
              <th>Notes</th>
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {addVisible && (
              <ProblemListForm
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
                    <ProblemListItem
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
                    <ProblemListItem
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
                !addVisible && <EmptyRow colSpan={10} text="No problem list" />}
            {isFetchingNextPage && <LoadingRow colSpan={10} />}
          </tbody>
        </table>
      </div>
      <div className="problemlist__btn-container">
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
        <CloseButton onClick={handleClose} />
      </div>
    </div>
  );
};

export default ProblemListPopUp;
