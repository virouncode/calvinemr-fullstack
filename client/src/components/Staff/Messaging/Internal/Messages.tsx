import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useStaffMessages } from "../../../../hooks/reactquery/queries/messagesQueries";
import useDebounce from "../../../../hooks/useDebounce";
import { MessageType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { filterAndSortMessages } from "../../../../utils/messages/filterAndSortMessages";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import MessagesLeftBar from "../MessagesLeftBar";
import MessagesBox from "./MessagesBox";
import MessagesToolBar from "./MessagesToolBar";

const Messages = () => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { messageId, sectionName } = useParams();
  const [search, setSearch] = useState("");
  const [section, setSection] = useState(sectionName || "Received messages");
  const [newVisible, setNewVisible] = useState(false);
  const [msgsSelectedIds, setMsgsSelectedIds] = useState<number[]>([]);
  const [currentMsgId, setCurrentMsgId] = useState(
    messageId ? parseInt(messageId) : 0
  );
  const [printVisible, setPrintVisible] = useState(false);
  const [selectAllVisible, setSelectAllVisible] = useState(true);
  const [newTodoVisible, setNewTodoVisible] = useState(false);
  const deboundedSearch = useDebounce(search, 300);
  //Queries
  const {
    data: messages,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useStaffMessages(user.id, section, deboundedSearch);

  useEffect(() => {
    if (!messages || !messageId || isPending) return;
    const fetchMessagesUntilMessageId = async () => {
      let results: MessageType[] | undefined = messages.pages.flatMap(
        (page) => page.items
      );
      const messageToFind = results?.find(
        (item) => item.id === parseInt(messageId)
      );
      if (messageToFind) return;
      results = (await fetchNextPage()).data?.pages.flatMap(
        (page) => page.items
      );
    };
    fetchMessagesUntilMessageId();
  }, [messages, messageId, fetchNextPage, isPending]);

  if (error)
    return (
      <div className="messages__container">
        <ErrorParagraph errorMsg={error.message} />E
      </div>
    );

  const messagesDatas = messages
    ? filterAndSortMessages(
        section,
        messages?.pages?.flatMap((page) => page.items),
        user.id
      )
    : [];

  return (
    <div className="messages__container">
      <MessagesToolBar
        search={search}
        setSearch={setSearch}
        newVisible={newVisible}
        setNewVisible={setNewVisible}
        section={section}
        msgsSelectedIds={msgsSelectedIds}
        setMsgsSelectedIds={setMsgsSelectedIds}
        currentMsgId={currentMsgId}
        messages={messagesDatas}
        setPrintVisible={setPrintVisible}
        selectAllVisible={selectAllVisible}
        setSelectAllVisible={setSelectAllVisible}
        newTodoVisible={newTodoVisible}
        setNewTodoVisible={setNewTodoVisible}
      />
      <div className="messages__content">
        <MessagesLeftBar
          msgType="internal"
          section={section}
          setSection={setSection}
          setCurrentMsgId={setCurrentMsgId}
          setMsgsSelectedIds={setMsgsSelectedIds}
          setSelectAllVisible={setSelectAllVisible}
        />
        <MessagesBox
          section={section}
          newVisible={newVisible}
          setNewVisible={setNewVisible}
          newTodoVisible={newTodoVisible}
          setNewTodoVisible={setNewTodoVisible}
          msgsSelectedIds={msgsSelectedIds}
          setMsgsSelectedIds={setMsgsSelectedIds}
          currentMsgId={currentMsgId}
          setCurrentMsgId={setCurrentMsgId}
          isPending={isPending}
          messages={messagesDatas}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isFetching={isFetching}
          printVisible={printVisible}
          setPrintVisible={setPrintVisible}
          search={search}
        />
      </div>
    </div>
  );
};

export default Messages;
