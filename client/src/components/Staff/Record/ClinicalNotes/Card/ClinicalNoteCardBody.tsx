import React from "react";
import { ClinicalNoteType } from "../../../../../types/api";
import MicrophoneIcon from "../../../../UI/Icons/MicrophoneIcon";

type ClinicalNoteCardBodyProps = {
  clinicalNote: ClinicalNoteType;
  inputText: string;
  editVisible: boolean;
  handleChangeText: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  isListening: boolean;
  handleStopSpeech: () => void;
  handleStartSpeech: () => void;
};

const ClinicalNoteCardBody = ({
  clinicalNote,
  inputText,
  editVisible,
  handleChangeText,
  textareaRef,
  isListening,
  handleStopSpeech,
  handleStartSpeech,
}: ClinicalNoteCardBodyProps) => {
  return (
    <div className="clinical-notes__card-body">
      {!editVisible ? (
        <p>{clinicalNote.MyClinicalNotesContent}</p>
      ) : (
        <>
          {isListening ? (
            <MicrophoneIcon
              onClick={handleStopSpeech}
              color="red"
              top={30}
              right={40}
            />
          ) : (
            <MicrophoneIcon
              onClick={handleStartSpeech}
              color="black"
              top={30}
              right={40}
            />
          )}
          <textarea
            name="MyClinicalNotesContent"
            cols={90}
            rows={20}
            onChange={handleChangeText}
            value={inputText}
            autoFocus
            ref={textareaRef}
          />
        </>
      )}
    </div>
  );
};

export default ClinicalNoteCardBody;
