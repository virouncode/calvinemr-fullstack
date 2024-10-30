import React from "react";
import ReactQuill, { DeltaStatic, EmitterSource } from "react-quill-new";
import { ClinicalNoteAttachmentType } from "../../../../../types/api";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import MicrophoneIcon from "../../../../UI/Icons/MicrophoneIcon";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import ClinicalNoteAttachments from "./ClinicalNoteAttachments";

type ClinicalNoteFormBodyProps = {
  errMsg: string;
  isListening: boolean;
  handleStartSpeech: () => void;
  handleStopSpeech: () => void;
  inputText: string;
  attachments: ClinicalNoteAttachmentType[];
  handleRemoveAttachment: (fileName: string) => void;
  patientId: number;
  quillRef: React.MutableRefObject<ReactQuill | null>;
  handleBodyChange: (
    value: string,
    delta: DeltaStatic,
    source: EmitterSource,
    editor: ReactQuill.UnprivilegedEditor
  ) => void;
};

const ClinicalNoteFormBody = ({
  errMsg,
  isListening,
  handleStartSpeech,
  handleStopSpeech,
  inputText,
  attachments,
  handleRemoveAttachment,
  patientId,
  quillRef,
  handleBodyChange,
}: ClinicalNoteFormBodyProps) => {
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
    <div className="clinical-notes__form-body">
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      {isListening ? (
        <MicrophoneIcon
          onClick={handleStopSpeech}
          color="red"
          top={30}
          right={30}
        />
      ) : (
        <MicrophoneIcon
          onClick={handleStartSpeech}
          color="black"
          top={30}
          right={30}
        />
      )}
      <div className="clinical-notes__form-body-quill">
        <ReactQuill
          theme="snow"
          value={inputText}
          onChange={handleBodyChange}
          modules={modules}
          style={{ height: "100%" }}
          ref={quillRef}
        />
      </div>
      {attachments.length > 0 && (
        <ClinicalNoteAttachments
          attachments={attachments}
          handleRemoveAttachment={handleRemoveAttachment}
          deletable={true}
          addable={false}
          patientId={patientId}
          date={nowTZTimestamp()}
        />
      )}
    </div>
  );
};

export default ClinicalNoteFormBody;
