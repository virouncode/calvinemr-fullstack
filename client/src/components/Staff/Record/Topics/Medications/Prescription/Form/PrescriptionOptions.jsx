import Button from "../../../../../../UI/Buttons/Button";
import CancelButton from "../../../../../../UI/Buttons/CancelButton";
import CircularProgressMedium from "../../../../../../UI/Progress/CircularProgressMedium";
import SiteSelect from "../../../../../EventForm/SiteSelect";

const PrescriptionOptions = ({
  handleAsk,
  handlePreview,
  handleCancel,
  handleSiteChange,
  sites,
  siteSelectedId,
  progress,
}) => {
  return (
    <div className="prescription__actions">
      <Button onClick={handlePreview} disabled={progress} label="Preview" />
      <Button
        onClick={handleAsk}
        disabled={progress}
        label="Check interactions"
      />
      <CancelButton onClick={handleCancel} disabled={progress} />
      <SiteSelect
        handleSiteChange={handleSiteChange}
        value={siteSelectedId}
        sites={sites}
      />
      {progress && <CircularProgressMedium />}
    </div>
  );
};

export default PrescriptionOptions;
