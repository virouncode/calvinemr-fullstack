import React, { useState } from "react";
import {
  useTopicDelete,
  useTopicPost,
  useTopicPut,
} from "../../../../../hooks/reactquery/mutations/topicMutations";
import { useTopic } from "../../../../../hooks/reactquery/queries/topicQueries";
import { ChecklistType } from "../../../../../types/api";
import {
  checklistTests,
  splitChecklistResults,
} from "../../../../../utils/checklist/checklistUtils";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import ChecklistForm from "./ChecklistForm";
import ChecklistHistory from "./ChecklistHistory";
import ChecklistItem from "./ChecklistItem";

type ChecklistPopUpProps = {
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChecklistPopUp = ({
  patientId,
  setPopUpVisible,
}: ChecklistPopUpProps) => {
  const [addVisible, setAddVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [testNameToShow, setTestNameToShow] = useState("");
  const [testNameToAdd, setTestNameToAdd] = useState<string>("");

  const {
    data: topicDatas,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTopic("CHECKLIST", patientId);
  const topicPost = useTopicPost("CHECKLIST", patientId);
  const topicPut = useTopicPut("CHECKLIST", patientId);
  const topicDelete = useTopicDelete("CHECKLIST", patientId);

  const handleClose = () => {
    setPopUpVisible(false);
  };

  if (isPending) {
    return (
      <div className="checklist">
        <h1 className="checklist__title">Patient checklist</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="checklist">
        <h1 className="checklist__title">Patient checklist</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }
  const datas = topicDatas?.pages.flatMap((page) => page.items);
  const splittedChecklistResults = splitChecklistResults(
    datas as ChecklistType[]
  );

  return (
    <div className="checklist">
      <h1 className="checklist__title">Patient checklist</h1>
      <div className="checklist__table-container">
        <table className="checklist__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Test name</th>
              <th>Validity</th>
              <th>Last result</th>
              <th>Date of last result</th>
              <th>Valid until</th>
              <th>Expired</th>
            </tr>
          </thead>
          <tbody>
            {checklistTests.map((test, index) => (
              <ChecklistItem
                testName={test.name}
                results={splittedChecklistResults[index]}
                key={test.name}
                index={index}
                setTestNameToShow={setTestNameToShow}
                setTestNameToAdd={setTestNameToAdd}
                setAddVisible={setAddVisible}
                setHistoryVisible={setHistoryVisible}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="checklist__btn-container">
        <CloseButton onClick={handleClose} />
      </div>
      {addVisible && (
        <FakeWindow
          title={`ADD ${testNameToAdd} RESULT`}
          width={1200}
          height={270}
          x={(window.innerWidth - 1200) / 2}
          y={(window.innerHeight - 270) / 2}
          color="#009DA5"
          setPopUpVisible={setAddVisible}
        >
          <ChecklistForm
            setAddVisible={setAddVisible}
            testName={testNameToAdd}
            patientId={patientId}
            topicPost={topicPost}
          />
        </FakeWindow>
      )}
      {historyVisible && (
        <FakeWindow
          title={`${setTestNameToShow} RESULTS HISTORY`}
          width={window.innerWidth}
          height={600}
          x={0}
          y={(window.innerHeight - 600) / 2}
          color="#009DA5"
          setPopUpVisible={setHistoryVisible}
        >
          <ChecklistHistory
            testName={testNameToShow}
            setHistoryVisible={setHistoryVisible}
            testHistoryToShow={
              splittedChecklistResults[
                checklistTests.findIndex((test) => test.name === testNameToShow)
              ]
            }
            topicPut={topicPut}
            topicDelete={topicDelete}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default ChecklistPopUp;
