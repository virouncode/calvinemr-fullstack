import { useState } from "react";
import { toast } from "react-toastify";
import useClinicContext from "../../../../../../hooks/context/useClinicContext";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import { useLettersTemplatePost } from "../../../../../../hooks/reactquery/mutations/lettersTemplatesMutations";
import { useSites } from "../../../../../../hooks/reactquery/queries/sitesQueries";
import { nowTZTimestamp } from "../../../../../../utils/dates/formatDates";
import { toRecipientInfos } from "../../../../../../utils/letters/toRecipientInfos";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import PatientChartHealthSearch from "../../../../Billing/PatientChartHealthSearch";
import ReferringOHIPSearch from "../../../../Billing/ReferringOHIPSearch";
import SiteSelect from "../../../../EventForm/SiteSelect";

const LetterTemplateForm = ({ setNewTemplateVisible }) => {
  const { user } = useUserContext();
  const { clinic } = useClinicContext();
  const [recipientInfos, setRecipientInfos] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [siteSelectedId, setSiteSelectedId] = useState(user.site_id);
  const [refOHIPSearchVisible, setRefOHIPSearchVisible] = useState(false);
  const [patientSearchVisible, setPatientSearchVisible] = useState(false);
  const [progress, setProgress] = useState(false);
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();
  const letterTemplatePost = useLettersTemplatePost();

  const handleChangeRecipient = (e) => {
    setRecipientInfos(e.target.value);
  };
  const handleChangeSubject = (e) => {
    setSubject(e.target.value);
  };
  const handleChangeBody = (e) => {
    setBody(e.target.value);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleClickRefOHIP = (e, doctor) => {
    setRecipientInfos(toRecipientInfos(doctor, sites, clinic));
    setRefOHIPSearchVisible(false);
  };

  const handleClickPatient = (e, patient) => {
    setRecipientInfos(toRecipientInfos(patient, sites, clinic));
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
    const letterTemplateToPost = {
      name,
      description,
      author_id: user.id,
      subject,
      body,
      recipient_infos: recipientInfos,
      date_created: nowTZTimestamp(),
      site_id: siteSelectedId,
    };
    letterTemplatePost.mutate(letterTemplateToPost, {
      onSuccess: () => {
        setNewTemplateVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };
  const handleCancel = () => {
    setNewTemplateVisible(false);
  };
  const handleSiteChange = (e) => {
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
        <label htmlFor="letter-template-name">Template name*: </label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          autoComplete="off"
          autoFocus
          id="letter-template-name"
        />
      </div>
      <div className="letters__template-form-description">
        <label htmlFor="letter-template-decription">Description: </label>
        <input
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          autoComplete="off"
          id="letter-template-decription"
        />
      </div>
      <SiteSelect
        handleSiteChange={handleSiteChange}
        sites={sites}
        value={siteSelectedId}
      />
      <div className="letters__template-form-subheader">
        <div className="letters__template-form-recipient">
          <label>Addressed to:</label>
          <textarea
            rows="5"
            value={recipientInfos}
            onChange={handleChangeRecipient}
            autoComplete="off"
          />
          <i
            style={{
              cursor: "pointer",
              position: "absolute",
              right: "5px",
              top: "5px",
            }}
            className="fa-solid fa-user-doctor no-print"
            onClick={() => setRefOHIPSearchVisible(true)}
          ></i>
          <i
            style={{
              cursor: "pointer",
              position: "absolute",
              right: "20px",
              top: "5px",
            }}
            className="fa-solid fa-user-plus no-print"
            onClick={() => setPatientSearchVisible(true)}
          ></i>
        </div>
        <div className="letters__template-form-subject">
          <label htmlFor="letter-template-subject">Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={handleChangeSubject}
            autoComplete="off"
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
        <button onClick={handleSave} disabled={progress} className="save-btn">
          Save
        </button>
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

export default LetterTemplateForm;
