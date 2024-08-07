import SendIcon from "@mui/icons-material/Send";
import { Button } from "@mui/material";
import TypingDots from "../../UI/Buttons/TypingDots";
import MicrophoneIcon from "../../UI/Icons/MicrophoneIcon";

const CalvinAIInput = ({
  handleChangeInput,
  value,
  handleAskGPT,
  isLoading,
  inputTextRef,
  isListening,
  handleStopSpeech,
  handleStartSpeech,
}) => {
  return (
    <div className="calvinai-chat__input">
      {isListening ? (
        <MicrophoneIcon
          onClick={handleStopSpeech}
          color="red"
          top={15}
          right={30}
        />
      ) : (
        <MicrophoneIcon
          onClick={handleStartSpeech}
          top={15}
          right={30}
          color="black"
        />
      )}
      <textarea
        className="calvinai-chat__textarea"
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
          className="calvinai-chat__send-btn"
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
