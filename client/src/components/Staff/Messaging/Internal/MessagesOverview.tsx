import { useMediaQuery } from "@mui/material";
import React from "react";
import { MessageType, TodoType } from "../../../../types/api";
import EmptyParagraph from "../../../UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import MessagesOverviewToolbar from "./MessagesOverviewToolbar";
import MessageThumbnail from "./MessageThumbnail";
import MessageThumbnailMobile from "./MessageThumbnailMobile";

type MessagesOverviewProps = {
  messages: (MessageType | TodoType)[];
  isFetchingNextPage: boolean;
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  msgsSelectedIds: number[];
  setMsgsSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  section: string;
  lastItemRef: (node: Element | null) => void;
  search: string;
};

const MessagesOverview = ({
  messages,
  isFetchingNextPage,
  setCurrentMsgId,
  msgsSelectedIds,
  setMsgsSelectedIds,
  section,
  lastItemRef,
  search,
}: MessagesOverviewProps) => {
  const emptySectionMessages = (sectionName: string) => {
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
        return "";
    }
  };
  const isTabletOrMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <MessagesOverviewToolbar section={section} />
      {messages && messages.length > 0
        ? messages.map((item, index) =>
            index === messages.length - 1 ? (
              isTabletOrMobile ? (
                <MessageThumbnailMobile
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
                  lastItemRef={lastItemRef}
                />
              )
            ) : isTabletOrMobile ? (
              <MessageThumbnailMobile
                key={item.id}
                message={item}
                setCurrentMsgId={setCurrentMsgId}
                setMsgsSelectedIds={setMsgsSelectedIds}
                msgsSelectedIds={msgsSelectedIds}
                section={section}
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
