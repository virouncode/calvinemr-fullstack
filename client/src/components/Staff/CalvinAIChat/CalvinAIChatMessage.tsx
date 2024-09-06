import React, { useRef } from "react";
import { toast } from "react-toastify";
import userLogo from "../../../assets/img/doctorLogo.png";
import botLogo from "../../../assets/img/logoCarre.png";
import { copyCalvinAIMsgToClipboard } from "../../../utils/js/copyToClipboard";
import Button from "../../UI/Buttons/Button";

type CalvinAIChatMessageProps = {
  role: string;
  message: {
    role: string;
    content: string;
  };
  isLoading: boolean;
};

const CalvinAIChatMessage = ({
  role,
  message,
  isLoading,
}: CalvinAIChatMessageProps) => {
  //Hooks
  const textRef = useRef<HTMLParagraphElement | null>(null);

  const handleCopyToClipboard = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    try {
      await copyCalvinAIMsgToClipboard(textRef);
      toast.success("Copied !", { containerId: "A" });
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Unable to copy: ${err.message}`, { containerId: "A" });
    }
  };

  return (
    <div className="calvinai__chat-card">
      <div className="calvinai__chat-card-content">
        {role === "user" ? (
          <img
            src={userLogo}
            alt="user logo"
            className="calvinai__chat-img-user"
          />
        ) : (
          <img
            src={botLogo}
            alt="bot logo"
            className="calvinai__chat-img-bot"
          />
        )}

        <p className="calvinai__chat-message" ref={textRef}>
          {message.content}
        </p>
      </div>
      {role !== "user" && (
        <div className="calvinai__chat-card-btns">
          <Button
            onClick={handleCopyToClipboard}
            disabled={isLoading}
            label="Copy to clipboard"
          />
        </div>
      )}
    </div>
  );
};

export default CalvinAIChatMessage;
