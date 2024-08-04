import Button from "../../../../../../UI/Buttons/Button";
import SaveButton from "../../../../../../UI/Buttons/SaveButton";
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
      <SaveButton onClick={handleSave} disabled={progress || prescription} />
      <Button
        onClick={handlePrint}
        disabled={progress}
        label={prescription ? "Print" : "Save & Print"}
        className={prescription ? "" : "save-btn"}
      />
      <Button
        onClick={handleSend}
        disabled={progress}
        label={prescription ? "Send (External)" : "Save & Send (External)"}
        className={prescription ? "" : "save-btn"}
      />
      <Button
        onClick={handleFax}
        disabled={progress}
        label={prescription ? "Fax" : "Save & Fax"}
        className={prescription ? "" : "save-btn"}
      />
      <Button onClick={handleBack} disabled={progress} label="Back" />
      {progress && <CircularProgressMedium />}
    </div>
  );
};

export default PrescriptionOptionsPreview;
