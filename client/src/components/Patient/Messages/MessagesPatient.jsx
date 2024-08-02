import { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { usePatientExternalMessages } from "../../../hooks/reactquery/queries/messagesQueries";
import { filterAndSortExternalMessages } from "../../../utils/messages/filterAndSortExternalMessages";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import MessagesPatientBox from "./MessagesPatientBox";
import MessagesPatientLeftBar from "./MessagesPatientLeftBar";
import MessagesPatientToolBar from "./MessagesPatientToolbar";

const MessagesPatient = () => {
  //HOOKS
  const { user } = useUserContext();
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("Received messages");
  const [newVisible, setNewVisible] = useState(false);
  const [msgsSelectedIds, setMsgsSelectedIds] = useState([]);
  const [currentMsgId, setCurrentMsgId] = useState(0);
  const [printVisible, setPrintVisible] = useState(false);
  const [selectAllVisible, setSelectAllVisible] = useState(true);
  const {
    data: messages,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePatientExternalMessages(user.id, section, search);

  if (error)
    return (
      <div className="messages-container">
        <ErrorParagraph errorMsg={error.message} />E
      </div>
    );

  const messagesDatas = messages
    ? filterAndSortExternalMessages(
        section,
        messages?.pages?.flatMap((page) => page.items),
        "patient",
        user.id
      )
    : null;

  return (
    <div className="messages-container messages-container--patient">
      <MessagesPatientToolBar
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
      />
      <div className="messages-content">
        <MessagesPatientLeftBar
          section={section}
          setSection={setSection}
          setCurrentMsgId={setCurrentMsgId}
          setMsgsSelectedIds={setMsgsSelectedIds}
          setSelectAllVisible={setSelectAllVisible}
        />
        <MessagesPatientBox
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

export default MessagesPatient;
