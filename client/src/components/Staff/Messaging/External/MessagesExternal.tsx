import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useStaffExternalMessages } from "../../../../hooks/reactquery/queries/messagesQueries";
import { UserStaffType } from "../../../../types/app";
import { filterAndSortExternalMessages } from "../../../../utils/messages/filterAndSortExternalMessages";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import MessagesLeftBar from "../MessagesLeftBar";
import MessagesExternalBox from "./MessagesExternalBox";
import MessagesExternalToolBar from "./MessagesExternalToolbar";
import { MessageExternalType } from "../../../../types/api";

const MessagesExternal = () => {
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
  //Queries
  const {
    data: messages,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useStaffExternalMessages(user.id, section, search);

  useEffect(() => {
    if (!messages || !messageId || isPending) return;
    const fetchMessagesUntilMessageId = async () => {
      let results: MessageExternalType[] | undefined = messages.pages.flatMap(
        (page) => page.items
      );
      while (!results?.find((item) => item.id === parseInt(messageId))) {
        results = (await fetchNextPage()).data?.pages.flatMap(
          (page) => page.items
        );
      }
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
    ? filterAndSortExternalMessages(
        section,
        messages?.pages?.flatMap((page) => page.items),
        "staff",
        user.id
      )
    : [];

  return (
    <div className="messages__container">
      <MessagesExternalToolBar
        search={search}
        setSearch={setSearch}
        setNewVisible={setNewVisible}
        section={section}
        msgsSelectedIds={msgsSelectedIds}
        setMsgsSelectedIds={setMsgsSelectedIds}
        currentMsgId={currentMsgId}
        messages={messagesDatas}
        setPrintVisible={setPrintVisible}
        selectAllVisible={selectAllVisible}
        setSelectAllVisible={setSelectAllVisible}
      />
      <div className="messages__content">
        <MessagesLeftBar
          msgType="external"
          section={section}
          setSection={setSection}
          setCurrentMsgId={setCurrentMsgId}
          setMsgsSelectedIds={setMsgsSelectedIds}
          setSelectAllVisible={setSelectAllVisible}
        />
        <MessagesExternalBox
          section={section}
          newVisible={newVisible}
          setNewVisible={setNewVisible}
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

export default MessagesExternal;
