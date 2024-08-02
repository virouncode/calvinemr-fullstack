import { useRef } from "react";
import { toast } from "react-toastify";
import userLogo from "../../../../../assets/img/doctorLogo.png";
import botLogo from "../../../../../assets/img/logoCarreTest.png";
import { copyClinicalNoteToClipboard } from "../../../../../utils/js/copyToClipboard";

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
          <button
            onClick={handleCopyToClipboard}
            disabled={isLoading}
            style={{ marginRight: "5px" }}
          >
            Copy to clipboard
          </button>
          <button onClick={handleCopyToClinicalNote} disabled={isLoading}>
            Copy to new clinical note version
          </button>
        </div>
      )}
    </div>
  );
};

export default CalvinAIClinicalMessage;
