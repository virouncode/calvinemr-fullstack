import React from "react";
import CalvinAIChatMessage from "./CalvinAIChatMessage";
import CalvinAIDisclaimer from "./CalvinAIDisclaimer";

type CalvinAIChatContentProps = {
  messages: { role: string; content: string }[];
  msgEndRef: React.MutableRefObject<HTMLDivElement | null>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  isLoading: boolean;
};

const CalvinAIChatContent = ({
  messages,
  msgEndRef,
  contentRef,
  isLoading,
}: CalvinAIChatContentProps) => {
  return (
    <div className="calvinai__chat-content" ref={contentRef}>
      <CalvinAIDisclaimer />
      {messages.map((message, i) => (
        <CalvinAIChatMessage
          role={message.role}
          key={i}
          message={message}
          isLoading={isLoading}
        />
      ))}
      <div ref={msgEndRef}></div>
    </div>
  );
};
export default CalvinAIChatContent;
