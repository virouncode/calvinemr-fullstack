import { useRef } from "react";
import { toast } from "react-toastify";
import userLogo from "../../../assets/img/doctorLogo.png";
import botLogo from "../../../assets/img/logoCarreTest.png";
import { copyClinicalNoteToClipboard } from "../../../utils/js/copyToClipboard";

const CalvinAIChatMessage = ({ role, message, isLoading }) => {
  const handleCopyToClipboard = async (e) => {
    e.stopPropagation();
    try {
      await copyClinicalNoteToClipboard(textRef);
      toast.success("Copied !", { containerId: "A" });
    } catch (err) {
      toast.error(`Unable to copy: ${err.message}`, { containerId: "A" });
    }
  };
  const textRef = useRef(null);

  return (
    <div className="calvinai-chat__card">
      <div className="calvinai-chat__card-content">
        {role === "user" ? (
          <img
            src={userLogo}
            alt="user logo"
            className="calvinai-chat__img-user"
          />
        ) : (
          <img
            src={botLogo}
            alt="bot logo"
            className="calvinai-chat__img-bot"
          />
        )}

        <p className="calvinai-chat__message" ref={textRef}>
          {message.content}
        </p>
      </div>
      {role !== "user" && (
        <div className="calvinai-chat__card-btns">
          <button onClick={handleCopyToClipboard} disabled={isLoading}>
            Copy to clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default CalvinAIChatMessage;
