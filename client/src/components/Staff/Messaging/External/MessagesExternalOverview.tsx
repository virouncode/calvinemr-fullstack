import { useMediaQuery } from "@mui/material";
import React from "react";
import { MessageExternalType } from "../../../../types/api";
import EmptyParagraph from "../../../UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import MessageExternalThumbnail from "./MessageExternalThumbnail";
import MessageExternalThumbnailMobile from "./MessageExternalThumbnailMobile";
import MessagesExternalOverviewToolbar from "./MessagesExternalOverviewToolbar";

type MessagesExternalOverviewProps = {
  messages: MessageExternalType[];
  isFetchingNextPage: boolean;
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  msgsSelectedIds: number[];
  setMsgsSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  section: string;
  targetRef?: (node: Element | null) => void;
  search: string;
};

const MessagesExternalOverview = ({
  messages,
  isFetchingNextPage,
  setCurrentMsgId,
  msgsSelectedIds,
  setMsgsSelectedIds,
  section,
  targetRef,
  search,
}: MessagesExternalOverviewProps) => {
  const emptySectionMessages = (sectionName: string) => {
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
        return "";
    }
  };
  const isTabletOrMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <MessagesExternalOverviewToolbar section={section} />
      {messages && messages.length > 0
        ? messages.map((item, index) =>
            index === messages.length - 1 ? (
              isTabletOrMobile ? (
                <MessageExternalThumbnailMobile
                  key={item.id}
                  message={item}
                  setCurrentMsgId={setCurrentMsgId}
                  setMsgsSelectedIds={setMsgsSelectedIds}
                  msgsSelectedIds={msgsSelectedIds}
                  section={section}
                  targetRef={targetRef}
                />
              ) : (
                <MessageExternalThumbnail
                  key={item.id}
                  message={item}
                  setCurrentMsgId={setCurrentMsgId}
                  setMsgsSelectedIds={setMsgsSelectedIds}
                  msgsSelectedIds={msgsSelectedIds}
                  section={section}
                  targetRef={targetRef}
                />
              )
            ) : isTabletOrMobile ? (
              <MessageExternalThumbnailMobile
                key={item.id}
                message={item}
                setCurrentMsgId={setCurrentMsgId}
                setMsgsSelectedIds={setMsgsSelectedIds}
                msgsSelectedIds={msgsSelectedIds}
                section={section}
                targetRef={targetRef}
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
