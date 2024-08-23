import React from "react";
import { AttachmentType } from "../../../../../../types/api";
import Button from "../../../../../UI/Buttons/Button";
import CircularProgressMedium from "../../../../../UI/Progress/CircularProgressMedium";

type LetterOptionsPreviewProps = {
  handleSave: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<AttachmentType | undefined>;
  handlePrint: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  handleFax: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  handleSend: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: "Internal" | "External"
  ) => Promise<void>;
  progress: boolean;
  setPreviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingFile: boolean;
  letter: AttachmentType | null;
};

const LetterOptionsPreview = ({
  handleSave,
  handlePrint,
  handleFax,
  handleSend,
  progress,
  setPreviewVisible,
  isLoadingFile,
  letter,
}: LetterOptionsPreviewProps) => {
  const handleCancel = () => {
    setPreviewVisible(false);
  };

  return (
    <div className="letter__options">
      <div className="letter__options-actions">
        <Button
          onClick={handleSave}
          disabled={progress || isLoadingFile || !!letter}
          className={letter ? "" : "save-btn"}
          label="Save"
        />
        <Button
          onClick={handlePrint}
          disabled={progress || isLoadingFile}
          className={letter ? "" : "save-btn"}
          label={letter ? "Print" : "Save & Print"}
        />
        <Button
          onClick={handleFax}
          disabled={progress || isLoadingFile}
          className={letter ? "" : "save-btn"}
          label={letter ? "Fax" : "Save & Fax"}
        />
        <Button
          onClick={handleCancel}
          disabled={progress || isLoadingFile}
          label="Back"
        />
      </div>
      <div className="letter__options-actions">
        <Button
          onClick={(e) => handleSend(e, "Internal")}
          disabled={progress || isLoadingFile}
          className={letter ? "" : "save-btn"}
          label={letter ? "Send (Internal)" : "Save & Send (Internal)"}
        />
        <Button
          onClick={(e) => handleSend(e, "External")}
          disabled={progress || isLoadingFile}
          className={letter ? "" : "save-btn"}
          label={letter ? "Send (External)" : "Save & Send (External)"}
        />
        {progress && <CircularProgressMedium />}
      </div>
      <div className="letter__options-disclaimer">
        <p>The selected attachments and reports will be added</p>
      </div>
    </div>
  );
};

export default LetterOptionsPreview;
