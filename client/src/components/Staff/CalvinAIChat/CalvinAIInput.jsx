import SendIcon from "@mui/icons-material/Send";
import { Button } from "@mui/material";
import TypingDots from "../../UI/Buttons/TypingDots";

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
        <i
          className="fa-solid fa-microphone"
          onClick={handleStopSpeech}
          style={{
            cursor: "pointer",
            color: "red",
            position: "absolute",
            top: "15px",
            right: "30px",
          }}
        />
      ) : (
        <i
          className="fa-solid fa-microphone"
          onClick={handleStartSpeech}
          style={{
            cursor: "pointer",
            position: "absolute",
            top: "15px",
            right: "30px",
          }}
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
