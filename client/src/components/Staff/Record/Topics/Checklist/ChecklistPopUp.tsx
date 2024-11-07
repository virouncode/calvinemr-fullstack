import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import React, { useState } from "react";
import { ChecklistType, XanoPaginatedType } from "../../../../../types/api";
import {
  splitResults,
  tests,
} from "../../../../../utils/checklist/splitResults";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import ChecklistForm from "./ChecklistForm";
import ChecklistHistory from "./ChecklistHistory";
import ChecklistItem from "./ChecklistItem";

type ChecklistPopUpProps = {
  topicDatas: InfiniteData<XanoPaginatedType<ChecklistType>> | undefined;
  topicPost: UseMutationResult<
    ChecklistType,
    Error,
    Partial<ChecklistType>,
    void
  >;
  topicPut: UseMutationResult<ChecklistType, Error, ChecklistType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
  isPending: boolean;
  error: Error | null;
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<ChecklistType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
};

const ChecklistPopUp = ({
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
}: ChecklistPopUpProps) => {
  const [errMsgPost, setErrMsgPost] = useState<string | null>(null);
  const [addVisible, setAddVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [testNameToAdd, setTestNameToAdd] = useState<string | null>(null);
  const [testHistoryToShow, setTestHistoryToShow] = useState<
    ChecklistType[] | null
  >(null);
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

  const splittedResults = splitResults(datas as ChecklistType[]);

  return (
    <div className="checklist">
      <h1 className="checklist__title">Patient checklist</h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
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
            {tests.map((test, index) => (
              <ChecklistItem
                results={splittedResults[index]}
                key={test.name}
                index={index}
                setTestHistoryToShow={setTestHistoryToShow}
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
            testName={testNameToAdd as string}
            patientId={patientId}
            topicPost={topicPost}
          />
        </FakeWindow>
      )}
      {historyVisible && (
        <FakeWindow
          title={`${testHistoryToShow?.[0]?.test_name} RESULTS HISTORY`}
          width={window.innerWidth}
          height={600}
          x={0}
          y={(window.innerHeight - 600) / 2}
          color="#009DA5"
          setPopUpVisible={setHistoryVisible}
        >
          <ChecklistHistory
            setHistoryVisible={setHistoryVisible}
            testHistoryToShow={testHistoryToShow as ChecklistType[]}
            topicPut={topicPut}
            topicDelete={topicDelete}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default ChecklistPopUp;
