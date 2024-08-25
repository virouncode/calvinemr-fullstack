import React from "react";
import { AIMessageType } from "../../../../../types/app";
import CalvinAIDisclaimer from "../../../CalvinAIChat/CalvinAIDisclaimer";
import CalvinAIClinicalMessage from "./CalvinAIClinicalMessage";

type CalvinAIClinicalDiscussionContentProps = {
  messages: AIMessageType[];
  msgEndRef: React.MutableRefObject<HTMLDivElement | null>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  isLoading: boolean;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setAIRewritedText: React.Dispatch<React.SetStateAction<string>>;
  setAIVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const CalvinAIClinicalDiscussionContent = ({
  messages,
  msgEndRef,
  contentRef,
  isLoading,
  setEditVisible,
  setAIRewritedText,
  setAIVisible,
}: CalvinAIClinicalDiscussionContentProps) => {
  return (
    <div className="calvinai-discussion__content" ref={contentRef}>
      <CalvinAIDisclaimer />
      {messages.map((message, i) => (
        <CalvinAIClinicalMessage
          role={message.role}
          key={i}
          message={message}
          isLoading={isLoading}
          setEditVisible={setEditVisible}
          setAIRewritedText={setAIRewritedText}
          setAIVisible={setAIVisible}
        />
      ))}
      <div ref={msgEndRef}></div>
    </div>
  );
};
export default CalvinAIClinicalDiscussionContent;
