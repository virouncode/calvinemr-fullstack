import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React from "react";
import useIntersection from "../../../../hooks/useIntersection";
import {
  MessageType,
  PaginatedDatasType,
  TodoType,
} from "../../../../types/api";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessageDetail from "./MessageDetail";
import MessagesOverview from "./MessagesOverview";
import NewMessage from "./NewMessage";
import NewTodo from "./NewTodo";

type MessagesBoxProps = {
  section: string;
  newVisible: boolean;
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  newTodoVisible: boolean;
  setNewTodoVisible: React.Dispatch<React.SetStateAction<boolean>>;
  msgsSelectedIds: number[];
  setMsgsSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  currentMsgId: number;
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  messages: (MessageType | TodoType)[];
  isPending: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<PaginatedDatasType<MessageType | TodoType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
  printVisible: boolean;
  setPrintVisible: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
};

const MessagesBox = ({
  section,
  newVisible,
  setNewVisible,
  newTodoVisible,
  setNewTodoVisible,
  msgsSelectedIds,
  setMsgsSelectedIds,
  currentMsgId,
  setCurrentMsgId,
  messages,
  isPending,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
  printVisible,
  setPrintVisible,
  search,
}: MessagesBoxProps) => {
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
            <MessagesOverview
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
            <MessageDetail
              setCurrentMsgId={setCurrentMsgId}
              message={
                messages.find(({ id }) => id === currentMsgId) as
                  | MessageType
                  | TodoType
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
            width={1300}
            height={630}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 630) / 2}
            color={"#94bae8"}
            setPopUpVisible={setNewVisible}
          >
            <NewMessage setNewVisible={setNewVisible} />
          </FakeWindow>
        )}
        {newTodoVisible && (
          <FakeWindow
            title="NEW TO-DO"
            width={1300}
            height={620}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 620) / 2}
            color={"#94bae8"}
            setPopUpVisible={setNewTodoVisible}
          >
            <NewTodo setNewTodoVisible={setNewTodoVisible} />
          </FakeWindow>
        )}
      </>
    )
  );
};

export default MessagesBox;
