import React from "react";
import { toast } from "react-toastify";
import {
  LetterAttachmentType,
  SiteType,
  TopicType,
} from "../../../../../../types/api";
import Button from "../../../../../UI/Buttons/Button";
import CancelButton from "../../../../../UI/Buttons/CancelButton";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";
import SiteSelect from "../../../../../UI/Lists/SiteSelect";
import LetterAddAttachments from "./LetterAddAttachments";
import LetterAddPatientRecords from "./LetterAddPatientRecords";
import LetterAddReports from "./LetterAddReports";

type LetterOptionsProps = {
  sites: SiteType[];
  siteSelectedId: number;
  setSiteSelectedId: React.Dispatch<React.SetStateAction<number>>;
  handleCancel: () => void;
  dateStr: string;
  setDateStr: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setTemplatesVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPreviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  topicsSelected: TopicType[];
  setTopicsSelected: React.Dispatch<React.SetStateAction<TopicType[]>>;
  setBody: React.Dispatch<React.SetStateAction<string>>;
  handleAttach: () => void;
  isLoadingFile: boolean;
  attachments: LetterAttachmentType[];
  setAttachments: React.Dispatch<React.SetStateAction<LetterAttachmentType[]>>;
  handleRemoveAttachment: (attachmentAlias: string) => void;
  reportsAddedIds: number[];
  setReportsAddedIds: React.Dispatch<React.SetStateAction<number[]>>;
  patientId: number;
};

const LetterOptions = ({
  sites,
  siteSelectedId,
  setSiteSelectedId,
  handleCancel,
  dateStr,
  setDateStr,
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
}: LetterOptionsProps) => {
  const isTopicSelected = (topic: TopicType) => {
    return topicsSelected.includes(topic);
  };
  const handleCheckTopic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as TopicType;
    const checked = e.target.checked;
    if (checked) {
      setTopicsSelected([...topicsSelected, name]);
    } else {
      setTopicsSelected(
        topicsSelected.filter((topicName) => topicName !== name)
      );
    }
  };
  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSiteSelectedId(parseInt(e.target.value));
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateStr(e.target.value);
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
          value={dateStr}
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
