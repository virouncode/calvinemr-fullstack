import React from "react";
import MicrophoneIcon from "../../../../../UI/Icons/MicrophoneIcon";

type LetterBodyProps = {
  body: string;
  bodyRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  setBody: React.Dispatch<React.SetStateAction<string>>;
  handleStartSpeech: () => void;
  handleStopSpeech: () => void;
  isListening: boolean;
  inputTextBeforeSpeech: React.MutableRefObject<string>;
};

const LetterBody = ({
  body,
  bodyRef,
  setBody,
  handleStartSpeech,
  handleStopSpeech,
  isListening,
  inputTextBeforeSpeech,
}: LetterBodyProps) => {
  const handleChangeBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
