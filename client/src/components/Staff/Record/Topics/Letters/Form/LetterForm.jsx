import { useRef, useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../../../../api/xanoCRUD/xanoPost";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import { useSites } from "../../../../../../hooks/reactquery/queries/sitesQueries";
import {
  nowTZ,
  nowTZTimestamp,
} from "../../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../../utils/names/toPatientName";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import LetterPreview from "../Preview/LetterPreview";
import LettersTemplates from "../Templates/LettersTemplates";
import LetterOptions from "./LetterOptions";
import LetterPage from "./LetterPage";
import LetterRecordInfosPage from "./LetterRecordInfosPage";

const LetterForm = ({ demographicsInfos, setAddVisible, patientId }) => {
  const { user } = useUserContext();
  const [siteSelectedId, setSiteSelectedId] = useState(user.site_id);
  const [date, setDate] = useState(nowTZ().toISODate());
  const [subject, setSubject] = useState("");
  const [recipientInfos, setRecipientInfos] = useState("whom it may concern");
  const [body, setBody] = useState("");
  const [topicsSelected, setTopicsSelected] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [reportsAddedIds, setReportsAddedIds] = useState([]);
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  const bodyRef = useRef(null);
  const recordInfosBodyRef = useRef(null);

  const handleRemoveAttachment = (e, attachmentAlias) => {
    setAttachments(
      attachments.filter(({ alias }) => alias !== attachmentAlias)
    );
  };

  const handleSelectTemplate = (e, template) => {
    setSubject(template.subject);
    if (template.recipient_infos) {
      setRecipientInfos(template.recipient_infos);
    }
    setSiteSelectedId(template.site_id);
    setBody((b) => {
      if (b) return b + `\n\n${template.body}`;
      else return `${template.body}`;
    });
    bodyRef.current.focus();
    bodyRef.current.setSelectionRange(
      bodyRef.current.value.length,
      bodyRef.current.value.length
    );
  };
  const handleAttach = (e) => {
    let input = e.nativeEvent.view.document.createElement("input");
    input.type = "file";
    input.accept = ".jpeg, .jpg, .png, .pdf";
    input.onchange = (e) => {
      // getting a hold of the file reference
      let file = e.target.files[0];
      if (file.size > 25000000) {
        toast.error(
          "The file is over 25Mb, please choose another one or send a link",
          { containerId: "A" }
        );
        return;
      }
      setIsLoadingFile(true);
      // setting up the reader`
      let reader = new FileReader();
      reader.readAsDataURL(file);
      // here we tell the reader what to do when it's done reading...
      reader.onload = async (e) => {
        let content = e.target.result; // this is the content!
        try {
          const response = await xanoPost("/upload/attachment", "staff", {
            content,
          });
          if (!response.type) response.type = "document";
          setAttachments([
            ...attachments,
            {
              file: response,
              alias: file.name,
              date_created: nowTZTimestamp(),
              created_by_id: user.id,
              created_by_user_type: "staff",
              type: "attachment",
            },
          ]);
          setIsLoadingFile(false);
        } catch (err) {
          toast.error(`Error: unable to load file: ${err.message}`, {
            containerId: "A",
          });
          setIsLoadingFile(false);
        }
      };
    };
    input.click();
  };
  const handleCancel = () => {
    setAddVisible(false);
  };

  if (isPendingSites)
    return (
      <div className="letter__form">
        <LoadingParagraph />
      </div>
    );
  if (errorSites)
    return (
      <div className="letter__form">
        <ErrorParagraph errorMsg={errorSites.message} />
      </div>
    );

  return (
    <>
      <div className="letter__form">
        <div className="letter__container">
          <LetterPage
            sites={sites}
            siteSelectedId={siteSelectedId}
            demographicsInfos={demographicsInfos}
            date={date}
            subject={subject}
            setSubject={setSubject}
            body={body}
            setBody={setBody}
            bodyRef={bodyRef}
            recipientInfos={recipientInfos}
            setRecipientInfos={setRecipientInfos}
          />
          {topicsSelected.length > 0 ? (
            <LetterRecordInfosPage
              topicsSelected={topicsSelected}
              patientId={patientId}
              demographicsInfos={demographicsInfos}
              recordInfosBodyRef={recordInfosBodyRef}
            />
          ) : null}
        </div>
        <LetterOptions
          sites={sites}
          siteSelectedId={siteSelectedId}
          setSiteSelectedId={setSiteSelectedId}
          handleCancel={handleCancel}
          date={date}
          setDate={setDate}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          setTemplatesVisible={setTemplatesVisible}
          setPreviewVisible={setPreviewVisible}
          topicsSelected={topicsSelected}
          setTopicsSelected={setTopicsSelected}
          setBody={setBody}
          handleAttach={handleAttach}
          isLoadingFile={isLoadingFile}
          attachments={attachments}
          setAttachments={setAttachments}
          handleRemoveAttachment={handleRemoveAttachment}
          reportsAddedIds={reportsAddedIds}
          setReportsAddedIds={setReportsAddedIds}
          patientId={patientId}
        />
      </div>
      {previewVisible && (
        <FakeWindow
          title={`NEW LETTER/REFERRAL for ${toPatientName(
            demographicsInfos
          )} PREVIEW`}
          width={1300}
          height={750}
          x={(window.innerWidth - 1300) / 2}
          y={(window.innerHeight - 750) / 2}
          color={"#848484"}
          setPopUpVisible={setPreviewVisible}
        >
          <LetterPreview
            sites={sites}
            siteSelectedId={siteSelectedId}
            demographicsInfos={demographicsInfos}
            date={date}
            subject={subject}
            recipientInfos={recipientInfos}
            body={body}
            bodyRef={bodyRef}
            recordInfosBodyRef={recordInfosBodyRef}
            setPreviewVisible={setPreviewVisible}
            patientId={patientId}
            name={name}
            description={description}
            attachments={attachments}
            isLoadingFile={isLoadingFile}
          />
        </FakeWindow>
      )}
      {templatesVisible && (
        <FakeWindow
          title={`CHOOSE LETTER TEMPLATE`}
          width={800}
          height={600}
          x={window.innerWidth - 800}
          y={0}
          color="#848484"
          setPopUpVisible={setTemplatesVisible}
        >
          <LettersTemplates handleSelectTemplate={handleSelectTemplate} />
        </FakeWindow>
      )}
    </>
  );
};

export default LetterForm;
