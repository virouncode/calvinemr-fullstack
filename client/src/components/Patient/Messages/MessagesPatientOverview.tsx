import { useMediaQuery } from "@mui/material";
import React from "react";
import { MessageExternalType } from "../../../types/api";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import MessagePatientThumbnail from "./MessagePatientThumbnail";
import MessagePatientThumbnailMobile from "./MessagePatientThumbnailMobile";
import MessagesPatientOverviewToolbar from "./MessagesPatientOverviewToolbar";

type MessagesPatientOverviewProps = {
  messages: MessageExternalType[];
  isFetchingNextPage: boolean;
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  msgsSelectedIds: number[];
  setMsgsSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  section: string;
  targetRef: (node: Element | null) => void;
  search: string;
};

const MessagesPatientOverview = ({
  messages,
  isFetchingNextPage,
  setCurrentMsgId,
  msgsSelectedIds,
  setMsgsSelectedIds,
  section,
  targetRef,
  search,
}: MessagesPatientOverviewProps) => {
  const emptySectionMessages = (sectionName: string) => {
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
        return "";
    }
  };
  const isTabletOrMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <MessagesPatientOverviewToolbar section={section} />
      {messages && messages.length > 0
        ? messages.map((item, index) =>
            index === messages.length - 1 ? (
              isTabletOrMobile ? (
                <MessagePatientThumbnailMobile
                  key={item.id}
                  message={item}
                  setCurrentMsgId={setCurrentMsgId}
                  setMsgsSelectedIds={setMsgsSelectedIds}
                  msgsSelectedIds={msgsSelectedIds}
                  section={section}
                  targetRef={targetRef}
                />
              ) : (
                <MessagePatientThumbnail
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
              <MessagePatientThumbnailMobile
                key={item.id}
                message={item}
                setCurrentMsgId={setCurrentMsgId}
                setMsgsSelectedIds={setMsgsSelectedIds}
                msgsSelectedIds={msgsSelectedIds}
                section={section}
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
