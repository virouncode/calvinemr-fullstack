import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React from "react";
import useIntersection from "../../../hooks/useIntersection";
import {
  MessageExternalType,
  PaginatedMessagesExternalType,
} from "../../../types/api";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../UI/Windows/FakeWindow";
import MessagePatientDetail from "./MessagePatientDetail";
import MessagesPatientOverview from "./MessagesPatientOverview";
import NewMessagePatient from "./NewMessagePatient";

type MessagesPatientBoxProps = {
  section: string;
  newVisible: boolean;
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  msgsSelectedIds: number[];
  setMsgsSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  currentMsgId: number;
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  isPending: boolean;
  messages: MessageExternalType[];
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<PaginatedMessagesExternalType, unknown>,
      Error
    >
  >;
  isFetching: boolean;
  printVisible: boolean;
  setPrintVisible: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
};

const MessagesPatientBox = ({
  section,
  newVisible,
  setNewVisible,
  msgsSelectedIds,
  setMsgsSelectedIds,
  currentMsgId,
  setCurrentMsgId,
  isPending,
  messages,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
  printVisible,
  setPrintVisible,
  search,
}: MessagesPatientBoxProps) => {
  const { divRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  if (isPending)
    return (
      <div className="messages-content__box">
        <LoadingParagraph />
      </div>
    );

  return (
    messages && (
      <>
        <div className="messages-content__box" ref={divRef}>
          {currentMsgId === 0 ? (
            <MessagesPatientOverview
              messages={messages}
              isFetchingNextPage={isFetchingNextPage}
              setCurrentMsgId={setCurrentMsgId}
              msgsSelectedIds={msgsSelectedIds}
              setMsgsSelectedIds={setMsgsSelectedIds}
              section={section}
              lastItemRef={lastItemRef}
              search={search}
            />
          ) : (
            <MessagePatientDetail
              setCurrentMsgId={setCurrentMsgId}
              message={
                messages.find(
                  ({ id }) => id === currentMsgId
                ) as MessageExternalType
              }
              section={section}
              printVisible={printVisible}
              setPrintVisible={setPrintVisible}
            />
          )}
        </div>
        {newVisible && (
          <FakeWindow
            title="NEW MESSAGE"
            width={1000}
            height={600}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 600) / 2}
            color={"#94bae8"}
            setPopUpVisible={setNewVisible}
          >
            <NewMessagePatient setNewVisible={setNewVisible} />
          </FakeWindow>
        )}
      </>
    )
  );
};

export default MessagesPatientBox;
