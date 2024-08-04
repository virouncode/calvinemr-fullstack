import { useRef } from "react";
import { toast } from "react-toastify";
import userLogo from "../../../../../assets/img/doctorLogo.png";
import botLogo from "../../../../../assets/img/logoCarreTest.png";
import { copyClinicalNoteToClipboard } from "../../../../../utils/js/copyToClipboard";
import Button from "../../../../UI/Buttons/Button";

const CalvinAIClinicalMessage = ({
  role,
  message,
  isLoading,
  setEditVisible,
  setAIContent,
  setAIVisible,
}) => {
  const handleCopyToClipboard = async (e) => {
    e.stopPropagation();
    try {
      await copyClinicalNoteToClipboard(textRef);
      toast.success("Copied !", { containerId: "A" });
    } catch (err) {
      toast.error(`Unable to copy: ${err.message}`, { containerId: "A" });
    }
  };
  const handleCopyToClinicalNote = () => {
    setEditVisible(true);
    setAIContent(message.content);
    setAIVisible(false);
  };
  const textRef = useRef(null);
  return (
    <div className="calvinai-discussion__card">
      <div className="calvinai-discussion__card-content">
        {role === "user" ? (
          <img
            src={userLogo}
            alt="user logo"
            className="calvinai-discussion__img-user"
          />
        ) : (
          <img
            src={botLogo}
            alt="bot logo"
            className="calvinai-discussion__img-bot"
          />
        )}
        <p className="calvinai-discussion__message" ref={textRef}>
          {message.content}
        </p>
      </div>
      {role !== "user" && (
        <div className="calvinai-discussion__card-btns">
          <Button
            onClick={handleCopyToClipboard}
            disabled={isLoading}
            label="Copy to clipboard"
          />
          <Button
            onClick={handleCopyToClinicalNote}
            disabled={isLoading}
            label="Copy to new clinical note version"
          />
        </div>
      )}
    </div>
  );
};

export default CalvinAIClinicalMessage;
