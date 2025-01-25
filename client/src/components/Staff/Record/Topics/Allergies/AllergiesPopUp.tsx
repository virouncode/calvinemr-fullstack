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
import AllergyForm from "./AllergyForm";
import AllergyItem from "./AllergyItem";

type AllergiesPopUpProps = {
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const AllergiesPopUp = ({
  patientId,
  setPopUpVisible,
}: AllergiesPopUpProps) => {
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
  } = useTopic("ALLERGIES & ADVERSE REACTIONS", patientId);
  const topicPost = useTopicPost("ALLERGIES & ADVERSE REACTIONS", patientId);
  const topicPut = useTopicPut("ALLERGIES & ADVERSE REACTIONS", patientId);
  const topicDelete = useTopicDelete(
    "ALLERGIES & ADVERSE REACTIONS",
    patientId
  );

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
      <div className="allergies">
        <h1 className="allergies__title">
          Patient allergies & adverse reactions
        </h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="allergies">
        <h1 className="allergies__title">
          Patient allergies & adverse reactions
        </h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="allergies">
      <h1 className="allergies__title">
        Patient allergies & adverse reactions
      </h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="pasthealth__table-container" ref={divRef}>
        <table className="allergies__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Offending agent</th>
              <th>Type of agent</th>
              <th>Reaction type</th>
              <th>Start date</th>
              <th>Life stage</th>
              <th>Severity</th>
              <th>Reaction</th>
              <th>Recorded date</th>
              <th>Notes</th>
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {addVisible && (
              <AllergyForm
                editCounter={editCounter}
                setAddVisible={setAddVisible}
                patientId={patientId}
                setErrMsgPost={setErrMsgPost}
                errMsgPost={errMsgPost}
                topicPost={topicPost}
              />
            )}
            {datas && datas.length > 0
              ? datas.map((allergy, index) =>
                  index === datas.length - 1 ? (
                    <AllergyItem
                      item={allergy}
                      key={allergy.id}
                      editCounter={editCounter}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                      lastItemRef={lastItemRef}
                      topicPut={topicPut}
                      topicDelete={topicDelete}
                    />
                  ) : (
                    <AllergyItem
                      item={allergy}
                      key={allergy.id}
                      editCounter={editCounter}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                      topicPut={topicPut}
                      topicDelete={topicDelete}
                    />
                  )
                )
              : !isFetchingNextPage &&
                !addVisible && <EmptyRow colSpan={12} text="No allergies" />}
            {isFetchingNextPage && <LoadingRow colSpan={12} />}
          </tbody>
        </table>
      </div>
      <div className="allergies__btn-container">
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
        <CloseButton onClick={handleClose} />
      </div>
    </div>
  );
};

export default AllergiesPopUp;
