import React, { useRef } from "react";
import { toast } from "react-toastify";
import userLogo from "../../../assets/img/doctorLogo.png";
import botLogo from "../../../assets/img/logoCarreTest.png";
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
