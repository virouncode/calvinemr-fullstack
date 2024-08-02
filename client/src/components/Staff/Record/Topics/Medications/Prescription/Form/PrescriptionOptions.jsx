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
      <button onClick={handlePreview} disabled={progress}>
        Preview
      </button>
      <button onClick={handleAsk} disabled={progress}>
        Check interactions
      </button>
      <button onClick={handleCancel} disabled={progress}>
        Cancel
      </button>
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
