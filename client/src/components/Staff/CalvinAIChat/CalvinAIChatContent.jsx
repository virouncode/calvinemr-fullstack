import CalvinAIChatMessage from "./CalvinAIChatMessage";
import CalvinAIDisclaimer from "./CalvinAIDisclaimer";

const CalvinAIChatContent = ({
  messages,
  msgEndRef,
  contentRef,
  isLoading,
}) => {
  return (
    <div className="calvinai-chat__content" ref={contentRef}>
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
