import React from "react";
import ReactQuill from "react-quill";
import { ClinicalNoteType } from "../../../../../types/api";
import MicrophoneIcon from "../../../../UI/Icons/MicrophoneIcon";

type ClinicalNoteCardBodyProps = {
  clinicalNote: ClinicalNoteType;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
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
  setInputText,
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
          {/* <textarea
            name="MyClinicalNotesContent"
            cols={90}
            rows={20}
            onChange={handleChangeText}
            value={inputText}
            autoFocus
            ref={textareaRef}
          /> */}
          <div className="clinical-notes__form-body-quill">
            <ReactQuill
              theme="snow"
              readOnly={!editVisible}
              value={inputText}
              onChange={setInputText}
              modules={{
                toolbar: editVisible
                  ? [
                      ["bold", "italic", "underline", "strike"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { list: "check" },
                      ],
                      [{ indent: "-1" }, { indent: "+1" }],
                      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
                      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                      [{ align: [] }],
                      ["clean"],
                    ]
                  : false,
              }}
              style={{ height: "100%" }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ClinicalNoteCardBody;
