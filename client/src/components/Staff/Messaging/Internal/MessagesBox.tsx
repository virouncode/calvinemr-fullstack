import { useMediaQuery } from "@mui/material";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React from "react";
import useIntersection from "../../../../hooks/useIntersection";
import {
  MessageType,
  TodoType,
  XanoPaginatedType,
} from "../../../../types/api";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessageDetail from "./MessageDetail";
import MessagesOverview from "./MessagesOverview";
import NewMessage from "./NewMessage";
import NewMessageMobile from "./NewMessageMobile";
import NewTodo from "./NewTodo";
import NewTodoMobile from "./NewTodoMobile";

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
      InfiniteData<XanoPaginatedType<MessageType | TodoType>, unknown>,
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
  //Intersection observer
  const { divRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");

  if (isPending)
    return (
      <div className="messages__content-box">
        <LoadingParagraph />
      </div>
    );

  const message = messages.find(({ id }) => id === currentMsgId) as
    | MessageType
    | TodoType;

  return (
    messages && (
      <>
        <div className="messages__content-box" ref={divRef}>
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
            message && (
              <MessageDetail
                setCurrentMsgId={setCurrentMsgId}
                message={message}
                section={section}
                printVisible={printVisible}
                setPrintVisible={setPrintVisible}
              />
            )
          )}
        </div>
        {newVisible && (
          <FakeWindow
            title="NEW MESSAGE"
            width={1024}
            height={630}
            x={(window.innerWidth - 1024) / 2}
            y={(window.innerHeight - 630) / 2}
            color={"#94bae8"}
            setPopUpVisible={setNewVisible}
          >
            {isTabletOrMobile ? (
              <NewMessageMobile setNewVisible={setNewVisible} />
            ) : (
              <NewMessage setNewVisible={setNewVisible} />
            )}
          </FakeWindow>
        )}
        {newTodoVisible && (
          <FakeWindow
            title="NEW TO-DO"
            width={1024}
            height={620}
            x={(window.innerWidth - 1024) / 2}
            y={(window.innerHeight - 620) / 2}
            color={"#94bae8"}
            setPopUpVisible={setNewTodoVisible}
          >
            {isTabletOrMobile ? (
              <NewTodoMobile setNewTodoVisible={setNewTodoVisible} />
            ) : (
              <NewTodo setNewTodoVisible={setNewTodoVisible} />
            )}
          </FakeWindow>
        )}
      </>
    )
  );
};

export default MessagesBox;
