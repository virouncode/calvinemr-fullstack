import SendIcon from "@mui/icons-material/Send";
import { Button } from "@mui/material";
import React from "react";
import TypingDots from "../../UI/Buttons/TypingDots";
import MicrophoneIcon from "../../UI/Icons/MicrophoneIcon";

type CalvinAIInputProps = {
  handleChangeInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  handleAskGPT: () => void;
  isLoading: boolean;
  inputTextRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  isListening: boolean;
  handleStopSpeech: () => void;
  handleStartSpeech: () => void;
};

const CalvinAIInput = ({
  handleChangeInput,
  value,
  handleAskGPT,
  isLoading,
  inputTextRef,
  isListening,
  handleStopSpeech,
  handleStartSpeech,
}: CalvinAIInputProps) => {
  return (
    <div className="calvinai__chat-input">
      {isListening ? (
        <MicrophoneIcon
          onClick={handleStopSpeech}
          color="red"
          top={10}
          right={20}
        />
      ) : (
        <MicrophoneIcon
          onClick={handleStartSpeech}
          top={10}
          right={20}
          color="black"
        />
      )}
      <textarea
        className="calvinai__chat-textarea"
        placeholder="Type a message..."
        onChange={handleChangeInput}
        value={value}
        rows={10}
        ref={inputTextRef}
      />
      {isLoading ? (
        <TypingDots text="" />
      ) : (
        <Button
          className="calvinai__chat-send-btn"
          variant="contained"
          color="primary"
          onClick={handleAskGPT}
        >
          <SendIcon />
        </Button>
      )}
    </div>
  );
};

export default CalvinAIInput;
