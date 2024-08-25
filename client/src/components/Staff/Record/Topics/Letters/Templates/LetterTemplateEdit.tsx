import React, { useState } from "react";
import { toast } from "react-toastify";
import useClinicContext from "../../../../../../hooks/context/useClinicContext";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import { useLettersTemplatePut } from "../../../../../../hooks/reactquery/mutations/lettersTemplatesMutations";
import { useSites } from "../../../../../../hooks/reactquery/queries/sitesQueries";
import {
  DemographicsType,
  DoctorType,
  LetterTemplateType,
  StaffType,
} from "../../../../../../types/api";
import { UserStaffType } from "../../../../../../types/app";
import { nowTZTimestamp } from "../../../../../../utils/dates/formatDates";
import { toRecipientInfos } from "../../../../../../utils/letters/toRecipientInfos";
import CancelButton from "../../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../../UI/Buttons/SaveButton";
import DoctorAbsoluteIcon from "../../../../../UI/Icons/DoctorAbsoluteIcon";
import UserPlusAbsoluteIcon from "../../../../../UI/Icons/UserPlusAbsoluteIcon";
import Input from "../../../../../UI/Inputs/Input";
import SiteSelect from "../../../../../UI/Lists/SiteSelect";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import PatientChartHealthSearch from "../../../../Billing/PatientChartHealthSearch";
import ReferringOHIPSearch from "../../../../Billing/ReferringOHIPSearch";

type LetterTemplateEditProps = {
  setEditTemplateVisible: React.Dispatch<React.SetStateAction<boolean>>;
  template: LetterTemplateType;
};

const LetterTemplateEdit = ({
  setEditTemplateVisible,
  template,
}: LetterTemplateEditProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { clinic } = useClinicContext();
  const [recipientInfos, setRecipientInfos] = useState(
    template.recipient_infos
  );
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description);
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [siteSelectedId, setSiteSelectedId] = useState(template.site_id);
  const [refOHIPSearchVisible, setRefOHIPSearchVisible] = useState(false);
  const [patientSearchVisible, setPatientSearchVisible] = useState(false);
  const [progress, setProgress] = useState(false);
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();
  const letterTemplatePut = useLettersTemplatePut();

  const handleChangeRecipient = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRecipientInfos(e.target.value);
  };
  const handleChangeSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };
  const handleChangeBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  const handleClickRefOHIP = (doctor: DoctorType | StaffType) => {
    setRecipientInfos(toRecipientInfos(doctor, sites ?? [], clinic));
    setRefOHIPSearchVisible(false);
  };

  const handleClickPatient = (patient: DemographicsType) => {
    setRecipientInfos(toRecipientInfos(patient, sites ?? [], clinic));
    setPatientSearchVisible(false);
  };

  const handleSave = async () => {
    //Validation
    if (!name) {
      toast.error("Template name field is required", { containerId: "A" });
      return;
    }
    if (!body) {
      toast.error("Your template body is empty", { containerId: "A" });
      return;
    }
    setProgress(true);
    //create the message template
    const letterTemplateToPut = {
      id: template.id,
      name,
      description,
      author_id: user.id,
      subject,
      body,
      recipient_infos: recipientInfos,
      date_created: nowTZTimestamp(),
      site_id: siteSelectedId,
    };
    letterTemplatePut.mutate(letterTemplateToPut, {
      onSuccess: () => {
        setEditTemplateVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };
  const handleCancel = () => {
    setEditTemplateVisible(false);
  };
  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSiteSelectedId(parseInt(e.target.value));
  };

  if (isPendingSites)
    return (
      <div className="letters__template-form">
        <LoadingParagraph />
      </div>
    );
  if (errorSites)
    return (
      <div className="letters__template-form">
        <ErrorParagraph errorMsg={errorSites.message} />
      </div>
    );

  return (
    <div className="letters__template-form">
      <div className="letters__template-form-name">
        <Input
          label="Template name*:"
          value={name}
          onChange={handleNameChange}
          autoFocus
          id="letter-template-name"
        />
      </div>
      <div className="letters__template-form-description">
        <Input
          label="Description:"
          value={description}
          onChange={handleDescriptionChange}
          id="letter-template-description"
        />
      </div>
      <div className="letters__template-form-site">
        <SiteSelect
          handleSiteChange={handleSiteChange}
          sites={sites}
          value={siteSelectedId}
          label="Site:"
        />
      </div>
      <div className="letters__template-form-subheader">
        <div className="letters__template-form-recipient">
          <label>Addressed to:</label>
          <textarea
            rows={5}
            value={recipientInfos}
            onChange={handleChangeRecipient}
            autoComplete="off"
          />
          <DoctorAbsoluteIcon
            top={5}
            right={5}
            onClick={() => setRefOHIPSearchVisible(true)}
          />
          <UserPlusAbsoluteIcon
            right={20}
            top={5}
            onClick={() => setPatientSearchVisible(true)}
          />
        </div>
        <div className="letters__template-form-subject">
          <Input
            label="Subject:"
            value={subject}
            onChange={handleChangeSubject}
            id="letter-template-subject"
          />
        </div>
      </div>
      <div className="letters__template-form-body">
        <textarea
          name="body"
          value={body}
          onChange={handleChangeBody}
          autoComplete="off"
        />
      </div>
      <div className="letters__template-form-btns">
        <SaveButton onClick={handleSave} disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
      {refOHIPSearchVisible && (
        <FakeWindow
          title="DOCTORS DATABASE"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#848484"
          setPopUpVisible={setRefOHIPSearchVisible}
        >
          <ReferringOHIPSearch handleClickRefOHIP={handleClickRefOHIP} />
        </FakeWindow>
      )}
      {patientSearchVisible && (
        <FakeWindow
          title="PATIENTS DATABASE"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#848484"
          setPopUpVisible={setPatientSearchVisible}
        >
          <PatientChartHealthSearch handleClickPatient={handleClickPatient} />
        </FakeWindow>
      )}
    </div>
  );
};

export default LetterTemplateEdit;
