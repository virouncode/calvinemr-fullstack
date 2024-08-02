import EmptyParagraph from "../../../UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import MessageExternalThumbnail from "./MessageExternalThumbnail";
import MessagesExternalOverviewToolbar from "./MessagesExternalOverviewToolbar";

const MessagesExternalOverview = ({
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
        return search
          ? `No results in inbox external messages`
          : `No inbox external messages`;
      case "Sent messages":
        return search
          ? `No sesults in sent external messages`
          : `No sent external messages`;
      case "Deleted messages":
        return search
          ? `No results in deleted external messages`
          : `No deleted external messages`;
      default:
        break;
    }
  };
  return (
    <>
      <MessagesExternalOverviewToolbar section={section} />
      {messages && messages.length > 0
        ? messages.map((item, index) =>
            index === messages.length - 1 ? (
              <MessageExternalThumbnail
                key={item.id}
                message={item}
                setCurrentMsgId={setCurrentMsgId}
                setMsgsSelectedIds={setMsgsSelectedIds}
                msgsSelectedIds={msgsSelectedIds}
                section={section}
                lastItemRef={lastItemRef}
              />
            ) : (
              <MessageExternalThumbnail
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

export default MessagesExternalOverview;
