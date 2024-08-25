import React, { useRef } from "react";
import { toast } from "react-toastify";
import userLogo from "../../../../../assets/img/doctorLogo.png";
import botLogo from "../../../../../assets/img/logoCarreTest.png";
import { AIMessageType } from "../../../../../types/app";
import { copyCalvinAIMsgToClipboard } from "../../../../../utils/js/copyToClipboard";
import Button from "../../../../UI/Buttons/Button";

type CalvinAIClinicalMessageProps = {
  role: "user" | "assistant";
  message: AIMessageType;
  isLoading: boolean;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setAIRewritedText: React.Dispatch<React.SetStateAction<string>>;
  setAIVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const CalvinAIClinicalMessage = ({
  role,
  message,
  isLoading,
  setEditVisible,
  setAIRewritedText,
  setAIVisible,
}: CalvinAIClinicalMessageProps) => {
  //Hooks
  const textRef = useRef<HTMLParagraphElement | null>(null);

  const handleCopyToClipboard = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    try {
      await copyCalvinAIMsgToClipboard(
        textRef as React.MutableRefObject<HTMLParagraphElement>
      );
      toast.success("Copied !", { containerId: "A" });
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Unable to copy: ${err.message}`, { containerId: "A" });
    }
  };
  const handleCopyToClinicalNote = () => {
    setEditVisible(true);
    setAIRewritedText(message.content);
    setAIVisible(false);
  };

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
