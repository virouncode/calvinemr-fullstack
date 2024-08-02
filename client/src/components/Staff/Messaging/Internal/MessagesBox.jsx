import useIntersection from "../../../../hooks/useIntersection";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessageDetail from "./MessageDetail";
import MessagesOverview from "./MessagesOverview";
import NewMessage from "./NewMessage";
import NewTodo from "./NewTodo";

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
}) => {
  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
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
        <div className="messages-content__box" ref={rootRef}>
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
              message={messages.find(({ id }) => id === currentMsgId)}
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
