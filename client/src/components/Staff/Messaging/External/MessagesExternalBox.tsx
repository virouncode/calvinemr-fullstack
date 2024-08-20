import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React from "react";
import useIntersection from "../../../../hooks/useIntersection";
import { MessageExternalType, PaginatedDatasType } from "../../../../types/api";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessageExternalDetail from "./MessageExternalDetail";
import MessagesExternalOverview from "./MessagesExternalOverview";
import NewMessageExternal from "./NewMessageExternal";

type MessagesExternalBoxProps = {
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
      InfiniteData<PaginatedDatasType<MessageExternalType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
  printVisible: boolean;
  setPrintVisible: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
};

const MessagesExternalBox = ({
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
}: MessagesExternalBoxProps) => {
  //INTERSECTION OBSERVER
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
            <MessagesExternalOverview
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
            <MessageExternalDetail
              setCurrentMsgId={setCurrentMsgId}
              message={messages.find(({ id }) => id === currentMsgId)}
              section={section}
              printVisible={printVisible}
              setPrintVisible={setPrintVisible}
            />
          )}
        </div>
        {newVisible && (
          <FakeWindow
            title="NEW EXTERNAL MESSAGE"
            width={1300}
            height={630}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 630) / 2}
            color={"#94bae8"}
            setPopUpVisible={setNewVisible}
          >
            <NewMessageExternal setNewVisible={setNewVisible} />
          </FakeWindow>
        )}
      </>
    )
  );
};

export default MessagesExternalBox;
