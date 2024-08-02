
import { toast } from "react-toastify";
import SiteSelect from "../../../../EventForm/SiteSelect";
import LetterAddAttachments from "./LetterAddAttachments";
import LetterAddPatientRecords from "./LetterAddPatientRecords";
import LetterAddReports from "./LetterAddReports";

const LetterOptions = ({
  sites,
  siteSelectedId,
  setSiteSelectedId,
  handleCancel,
  date,
  setDate,
  name,
  setName,
  description,
  setDescription,
  setTemplatesVisible,
  setPreviewVisible,
  topicsSelected,
  setTopicsSelected,
  setBody,
  handleAttach,
  isLoadingFile,
  attachments,
  setAttachments,
  handleRemoveAttachment,
  reportsAddedIds,
  setReportsAddedIds,
  patientId,
}) => {
  const isTopicSelected = (topic) => {
    return topicsSelected.includes(topic);
  };
  const handleCheckTopic = (e) => {
    const name = e.target.name;
    const checked = e.target.checked;
    if (checked) {
      setTopicsSelected([...topicsSelected, name]);
    } else {
      setTopicsSelected(
        topicsSelected.filter((topicName) => topicName !== name)
      );
    }
  };
  const handleSiteChange = (e) => {
    setSiteSelectedId(parseInt(e.target.value));
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  const handlePreview = () => {
    if (!name) {
      toast.error("Name field is mandatory", { containerId: "A" });
      return;
    }
    setBody((b) => b.trimEnd().replace(/\n+$/, ""));
    setPreviewVisible(true);
  };

  return (
    <div className="letter__options">
      <SiteSelect
        handleSiteChange={handleSiteChange}
        sites={sites}
        value={siteSelectedId}
      />
      <div className="letter__options-name">
        <label htmlFor="letter-name">Name</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          id="letter-name"
        />
      </div>
      <div className="letter__options-date">
        <label htmlFor="letter-date">Date</label>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          id="letter-date"
        />
      </div>
      <div className="letter__options-description">
        <label htmlFor="letter-description">Description</label>
        <input
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          id="letter-description"
        />
      </div>
      <LetterAddPatientRecords
        isTopicSelected={isTopicSelected}
        handleCheckTopic={handleCheckTopic}
      />
      <LetterAddReports
        setAttachments={setAttachments}
        reportsAddedIds={reportsAddedIds}
        setReportsAddedIds={setReportsAddedIds}
        patientId={patientId}
      />
      <LetterAddAttachments
        handleAttach={handleAttach}
        isLoadingFile={isLoadingFile}
        attachments={attachments}
        handleRemoveAttachment={handleRemoveAttachment}
      />

      <div
        className="letter__options-template"
        onClick={() => setTemplatesVisible(true)}
      >
        Use template
      </div>
      <div className="letter__options-actions">
        <button onClick={handlePreview} disabled={isLoadingFile}>
          Preview
        </button>
        <button onClick={handleCancel} disabled={isLoadingFile}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LetterOptions;
