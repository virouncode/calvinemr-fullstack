
import CircularProgressMedium from "../../../../../UI/Progress/CircularProgressMedium";

const LetterOptionsPreview = ({
  handleSave,
  handlePrint,
  handleFax,
  handleSend,
  progress,
  setPreviewVisible,
  isLoadingFile,
  letter,
}) => {
  const handleCancel = () => {
    setPreviewVisible(false);
  };

  return (
    <div className="letter__options">
      <div className="letter__options-actions">
        <button
          onClick={handleSave}
          disabled={progress || isLoadingFile || letter}
          className={letter ? "" : "save-btn"}
        >
          Save
        </button>
        <button
          onClick={handlePrint}
          disabled={progress || isLoadingFile}
          className={letter ? "" : "save-btn"}
        >
          {letter ? "Print" : "Save & Print"}
        </button>
        <button
          onClick={handleFax}
          disabled={progress || isLoadingFile}
          className={letter ? "" : "save-btn"}
        >
          {letter ? "Fax" : "Save & Fax"}
        </button>
        <button onClick={handleCancel} disabled={progress || isLoadingFile}>
          Back
        </button>
      </div>
      <div className="letter__options-actions">
        <button
          onClick={(e) => handleSend(e, "Internal")}
          disabled={progress || isLoadingFile}
          className={letter ? "" : "save-btn"}
        >
          {letter ? "Send (Internal)" : "Save & Send (Internal)"}
        </button>
        <button
          onClick={(e) => handleSend(e, "External")}
          disabled={progress || isLoadingFile}
          className={letter ? "" : "save-btn"}
        >
          {letter ? "Send (External)" : "Save & Send (External)"}
        </button>
        {progress && <CircularProgressMedium />}
      </div>
      <div className="letter__options-disclaimer">
        <p>The selected attachments and reports will be added</p>
      </div>
    </div>
  );
};

export default LetterOptionsPreview;
