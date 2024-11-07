import { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import { ChecklistType } from "../../../../../types/api";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import ChecklistHistoryItem from "./ChecklistHistoryItem";

type ChecklistHistoryProps = {
  setHistoryVisible: React.Dispatch<React.SetStateAction<boolean>>;
  testHistoryToShow: ChecklistType[];
  topicPut: UseMutationResult<ChecklistType, Error, ChecklistType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
};

const ChecklistHistory = ({
  setHistoryVisible,
  testHistoryToShow,
  topicPut,
  topicDelete,
}: ChecklistHistoryProps) => {
  const [errMsgPost, setErrMsgPost] = React.useState<string>("");
  const handleClose = () => {
    setHistoryVisible(false);
  };
  return (
    <div className="checklist">
      <h1 className="checklist__title">
        Patient {testHistoryToShow[0].test_name} history
      </h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="checklist__table-container">
        <table className="checklist__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Validity</th>
              <th>Result</th>
              <th>Date</th>
              <th>Valid until</th>
              <th>Expired</th>
            </tr>
          </thead>
          <tbody>
            {testHistoryToShow.map((test) => (
              <ChecklistHistoryItem
                result={test}
                key={test.id}
                errMsgPost={errMsgPost}
                setErrMsgPost={setErrMsgPost}
                topicPut={topicPut}
                topicDelete={topicDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="checklist__btn-container">
        <CloseButton onClick={handleClose} />
      </div>
    </div>
  );
};

export default ChecklistHistory;
