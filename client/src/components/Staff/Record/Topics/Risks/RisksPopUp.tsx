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
import RiskForm from "./RiskForm";
import RiskItem from "./RiskItem";

type RisksPopUpProps = {
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const RisksPopUp = ({ patientId, setPopUpVisible }: RisksPopUpProps) => {
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
  } = useTopic("RISK FACTORS", patientId);
  const topicPost = useTopicPost("RISK FACTORS", patientId);
  const topicPut = useTopicPut("RISK FACTORS", patientId);
  const topicDelete = useTopicDelete("RISK FACTORS", patientId);

  //INTERSECTION OBSERVER
  const { rootRef, targetRef } = useIntersection<HTMLDivElement | null>(
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
      <div className="risk">
        <h1 className="risk__title">Patient risk factors & prevention</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="risk">
        <h1 className="risk__title">Patient risk factors & prevention</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="risk">
      <h1 className="risk__title">Patient risk factors & prevention</h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
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
                        targetRef={targetRef}
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
                    <EmptyRow colSpan={10} text="No risk factors" />
                  )}
              {isFetchingNextPage && <LoadingRow colSpan={10} />}
            </tbody>
          </table>
        </div>
        <div className="risk__btn-container">
          <Button onClick={handleAdd} disabled={addVisible} label="Add" />
          <CloseButton onClick={handleClose} />
        </div>
      </>
    </div>
  );
};

export default RisksPopUp;
