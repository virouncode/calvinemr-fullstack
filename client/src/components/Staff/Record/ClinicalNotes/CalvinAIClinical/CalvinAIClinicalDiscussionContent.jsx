
import CalvinAIDisclaimer from "../../../CalvinAIChat/CalvinAIDisclaimer";
import CalvinAIClinicalMessage from "./CalvinAIClinicalMessage";

const CalvinAIClinicalDiscussionContent = ({
  messages,
  msgEndRef,
  contentRef,
  isLoading,
  setEditVisible,
  setAIContent,
  setAIVisible,
}) => {
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
          setAIContent={setAIContent}
          setAIVisible={setAIVisible}
        />
      ))}
      <div ref={msgEndRef}></div>
    </div>
  );
};
export default CalvinAIClinicalDiscussionContent;
