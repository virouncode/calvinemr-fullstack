

const LetterBody = ({
  body,
  bodyRef,
  setBody,
  handleStartSpeech,
  handleStopSpeech,
  isListening,
  inputTextBeforeSpeech,
}) => {
  const handleChangeBody = (e) => {
    setBody(e.target.value);
    inputTextBeforeSpeech.current = e.target.value;
  };
  return (
    <div className="letter__body">
      <textarea
        name="body"
        autoComplete="off"
        value={body}
        onChange={handleChangeBody}
        ref={bodyRef}
      />
      {isListening ? (
        <i
          className="fa-solid fa-microphone"
          onClick={handleStopSpeech}
          style={{
            cursor: "pointer",
            color: "red",
            position: "absolute",
            top: "30px",
            right: "-20px",
          }}
        />
      ) : (
        <i
          className="fa-solid fa-microphone"
          onClick={handleStartSpeech}
          style={{
            cursor: "pointer",
            position: "absolute",
            top: "30px",
            right: "-20px",
          }}
        />
      )}
    </div>
  );
};

export default LetterBody;
