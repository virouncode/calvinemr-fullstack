import { toast } from "react-toastify";
import Button from "../../../../../UI/Buttons/Button";
import CancelButton from "../../../../../UI/Buttons/CancelButton";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";
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
      <div className="letter__options-site">
        <SiteSelect
          handleSiteChange={handleSiteChange}
          sites={sites}
          value={siteSelectedId}
          label="Site"
        />
      </div>
      <div className="letter__options-name">
        <Input
          label="Name"
          value={name}
          onChange={handleNameChange}
          id="letter-name"
        />
      </div>
      <div className="letter__options-date">
        <InputDate
          label="Date"
          value={date}
          onChange={handleDateChange}
          id="letter-date"
        />
      </div>
      <div className="letter__options-description">
        <Input
          label="Description"
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
        <Button
          onClick={handlePreview}
          disabled={isLoadingFile}
          label="Preview"
        />
        <CancelButton onClick={handleCancel} disabled={isLoadingFile} />
      </div>
    </div>
  );
};

export default LetterOptions;
