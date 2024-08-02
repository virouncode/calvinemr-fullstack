import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import MessagePatientThumbnail from "./MessagePatientThumbnail";
import MessagesPatientOverviewToolbar from "./MessagesPatientOverviewToolbar";

const MessagesPatientOverview = ({
  messages,
  isFetchingNextPage,
  setCurrentMsgId,
  msgsSelectedIds,
  setMsgsSelectedIds,
  section,
  lastItemRef,
  search,
}) => {
  const emptySectionMessages = (sectionName) => {
    switch (sectionName) {
      case "Received messages":
        return search ? `No results in inbox messages` : `No inbox messages`;
      case "Sent messages":
        return search ? `No results in sent messages` : `No sent messages`;
      case "Deleted messages":
        return search
          ? `No results in deleted messages`
          : `No deleted messages`;
      default:
        break;
    }
  };
  return (
    <>
      <MessagesPatientOverviewToolbar section={section} />

      {messages && messages.length > 0
        ? messages.map((item, index) =>
            index === messages.length - 1 ? (
              <MessagePatientThumbnail
                key={item.id}
                message={item}
                setCurrentMsgId={setCurrentMsgId}
                setMsgsSelectedIds={setMsgsSelectedIds}
                msgsSelectedIds={msgsSelectedIds}
                section={section}
                lastItemRef={lastItemRef}
              />
            ) : (
              <MessagePatientThumbnail
                key={item.id}
                message={item}
                setCurrentMsgId={setCurrentMsgId}
                setMsgsSelectedIds={setMsgsSelectedIds}
                msgsSelectedIds={msgsSelectedIds}
                section={section}
              />
            )
          )
        : !isFetchingNextPage && (
            <EmptyParagraph text={emptySectionMessages(section)} />
          )}
      {isFetchingNextPage && <LoadingParagraph />}
    </>
  );
};

export default MessagesPatientOverview;
