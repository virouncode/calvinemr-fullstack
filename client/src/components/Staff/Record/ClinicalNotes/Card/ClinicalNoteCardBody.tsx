import React from "react";
import ReactQuill from "react-quill-new";
import MicrophoneIcon from "../../../../UI/Icons/MicrophoneIcon";

type ClinicalNoteCardBodyProps = {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  editVisible: boolean;
  isListening: boolean;
  handleStopSpeech: () => void;
  handleStartSpeech: () => void;
  quillRef: React.MutableRefObject<ReactQuill | null>;
};

const ClinicalNoteCardBody = ({
  inputText,
  setInputText,
  editVisible,
  isListening,
  handleStopSpeech,
  handleStartSpeech,
  quillRef,
}: ClinicalNoteCardBodyProps) => {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],
    ],
  };
  return (
    <div className="clinical-notes__card-body">
      {editVisible &&
        (isListening ? (
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
        ))}
      <div
        className={
          editVisible
            ? "clinical-notes__card-body-quill clinical-notes__card-body-quill--edit"
            : "clinical-notes__card-body-quill"
        }
      >
        <ReactQuill
          theme="snow"
          readOnly={!editVisible}
          value={inputText}
          onChange={setInputText}
          modules={modules}
          style={{ height: "100%" }}
          ref={quillRef}
        />
      </div>
    </div>
  );
};

export default ClinicalNoteCardBody;
