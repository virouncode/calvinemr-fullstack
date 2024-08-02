
import CircularProgressMedium from "../../../../../../UI/Progress/CircularProgressMedium";

const PrescriptionOptionsPreview = ({
  handleSave,
  handlePrint,
  handleSend,
  handleFax,
  setPreviewVisible,
  progress,
  prescription,
}) => {
  const handleBack = (e) => {
    e.preventDefault();
    setPreviewVisible(false);
  };
  return (
    <div className="letter__options-actions">
      <button
        className="save-btn"
        onClick={handleSave}
        disabled={progress || prescription}
      >
        Save
      </button>
      <button
        onClick={handlePrint}
        disabled={progress}
        className={prescription ? "" : "save-btn"}
      >
        {prescription ? "Print" : "Save & Print"}
      </button>
      <button
        onClick={handleSend}
        disabled={progress}
        className={prescription ? "" : "save-btn"}
      >
        {prescription ? "Send (External)" : "Save & Send (External)"}
      </button>
      <button
        onClick={handleFax}
        disabled={progress}
        className={prescription ? "" : "save-btn"}
      >
        {prescription ? "Fax" : "Save & Fax"}
      </button>
      <button onClick={handleBack} disabled={progress}>
        Back
      </button>
      {progress && <CircularProgressMedium />}
    </div>
  );
};

export default PrescriptionOptionsPreview;
