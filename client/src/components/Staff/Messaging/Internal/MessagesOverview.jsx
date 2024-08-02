import EmptyParagraph from "../../../UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import MessageThumbnail from "./MessageThumbnail";
import MessagesOverviewToolbar from "./MessagesOverviewToolbar";

const MessagesOverview = ({
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
          ? `No results in inbox internal messages`
          : `No inbox internal messages`;
      case "Sent messages":
        return search
          ? `No results in sent internal messages`
          : `No sent internal messages`;
      case "Deleted messages":
        return search
          ? `No results in deleted internal messages`
          : `No deleted internal messages`;
      case "To-dos":
        return search ? `No results in to-dos` : `No to-dos`;
      default:
        break;
    }
  };

  return (
    <>
      <MessagesOverviewToolbar section={section} />
      {messages && messages.length > 0
        ? messages.map((item, index) =>
            index === messages.length - 1 ? (
              <MessageThumbnail
                key={item.id}
                message={item}
                setCurrentMsgId={setCurrentMsgId}
                setMsgsSelectedIds={setMsgsSelectedIds}
                msgsSelectedIds={msgsSelectedIds}
                section={section}
                lastItemRef={lastItemRef}
              />
            ) : (
              <MessageThumbnail
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

export default MessagesOverview;
