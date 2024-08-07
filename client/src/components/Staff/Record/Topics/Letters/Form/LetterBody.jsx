import MicrophoneIcon from "../../../../../UI/Icons/MicrophoneIcon";

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
        <MicrophoneIcon
          onClick={handleStopSpeech}
          color="red"
          top={30}
          right={-20}
        />
      ) : (
        <MicrophoneIcon
          onClick={handleStartSpeech}
          color="black"
          top={30}
          right={-20}
        />
      )}
    </div>
  );
};

export default LetterBody;
