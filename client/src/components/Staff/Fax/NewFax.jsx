import { uniqueId } from "lodash";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useFaxPost } from "../../../hooks/reactquery/mutations/faxMutations";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import AttachFilesButton from "../../UI/Buttons/AttachFilesButton";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Input from "../../UI/Inputs/Input";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import CircularProgressMedium from "../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../UI/Windows/FakeWindow";
import FaxAttachmentCard from "./FaxAttachmentCard";
import FaxContacts from "./FaxContacts";
import FaxesTemplates from "./FaxesTemplates";

const NewFax = ({
  setNewVisible,
  initialAttachment = null,
  initialBody = null,
  initialRecipient = null,
  reply = false,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const { clinic } = useClinicContext();
  const { data: sites, isPending, error } = useSites();

  const [attachment, setAttachment] = useState(initialAttachment);
  const [toFaxNumber, setToFaxNumber] = useState(
    initialRecipient?.ToFaxNumber || ""
  );
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(initialBody || "");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const textareaRef = useRef(null);
  const faxPost = useFaxPost();

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleChangeToFaxNumber = (e) => {
    const value = e.target.value;
    setToFaxNumber(value);
  };

  const handleChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const handleSelectTemplate = (e, template) => {
    if (template.subject) setSubject(template.subject);
    setBody((b) =>
      b ? b + "\n\n" + template.body + "\n" : template.body + "\n"
    );
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(
      textareaRef.current.value.length,
      textareaRef.current.value.length
    );
  };

  const handleCancel = () => {
    setNewVisible(false);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleSend = async () => {
    const regex = /^\d{10}$/;
    if (!regex.test(toFaxNumber)) {
      toast.error("Please enter a valid 10-digit fax number", {
        containerId: "A",
      });
      return;
    }
    setProgress(true);

    const faxToPost = {
      sToFaxNumber: `1${toFaxNumber}`,
      sCPFromName: staffIdToTitleAndName(staffInfos, user.id),
      sCPToName: "whom it may concern",
      sCPOrganization: `${clinic.name} - ${
        sites.find(({ id }) => id === user.site_id).name
      } - phone: ${sites.find(({ id }) => id === user.site_id).phone}`,
      sCPSubject: subject,
      sCPComments: body,
      sFileName_1: attachment.file.name,
      fileURL: `${import.meta.env.VITE_XANO_BASE_URL}${attachment.file.path}`,
    };
    faxPost.mutate(faxToPost, {
      onSuccess: () => {
        setProgress(false);
        setNewVisible(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleAttach = (e) => {
    let input = e.nativeEvent.view.document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpeg, .jpg, .png, .gif, .tif, .pdf, .svg";
    // ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx";
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
          setAttachment({
            file: response,
            alias: file.name,
            date_created: nowTZTimestamp(),
            created_by_id: user.id,
            created_by_user_type: "staff",
            id: uniqueId("messages_attachment_"),
          }); //meta, mime, name, path, size, type
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

  const handleClickPharmacy = (e, pharmacy) => {
    setToFaxNumber(pharmacy.FaxNumber.phoneNumber.replaceAll("-", ""));
  };
  const handleClickDoctor = (e, doctor) => {
    setToFaxNumber(doctor.FaxNumber.phoneNumber.replaceAll("-", ""));
  };
  const handleClickOther = (e, other) => {
    setToFaxNumber(other.fax_number.replaceAll("-", ""));
  };

  if (isPending)
    return (
      <div className="new-fax">
        <LoadingParagraph />
      </div>
    );
  if (error)
    return (
      <div className="new-fax">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  return (
    <div className="new-fax">
      <div className="new-fax__contacts">
        <FaxContacts
          handleClickDoctor={handleClickDoctor}
          handleClickPharmacy={handleClickPharmacy}
          handleClickOther={handleClickOther}
        />
      </div>
      <div className="new-fax__form">
        <div className="new-fax__recipients">
          <Input
            value={toFaxNumber}
            onChange={handleChangeToFaxNumber}
            id="to"
            label="To:"
            placeholder="Please enter a 10-digit fax number or select a contact..."
          />
        </div>
        <div className="new-fax__subject">
          <Input
            value={subject}
            onChange={handleChangeSubject}
            id="subject"
            label="Subject:"
            placeholder="Subject"
          />
        </div>
        <div className="new-fax__attach">
          <AttachFilesButton
            onClick={handleAttach}
            attachments={attachment ? [attachment] : []}
          />
        </div>
        <div className="new-fax__importance">
          <div>
            <strong
              onClick={() => setTemplatesVisible((v) => !v)}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Use Template
            </strong>
          </div>
        </div>
        <div className="new-fax__body">
          <textarea
            value={body}
            onChange={handleChange}
            autoFocus
            ref={textareaRef}
            placeholder={
              reply
                ? "We've attached the fax you are replying to, you can remove it by clicking on the x..."
                : ""
            }
          />
          {attachment && (
            <FaxAttachmentCard
              attachment={attachment}
              handleRemoveAttachment={handleRemoveAttachment}
              deletable={true}
            />
          )}
        </div>
        <div className="new-fax__btns">
          <SaveButton
            onClick={handleSend}
            disabled={progress || isLoadingFile}
            label="Send"
          />
          <CancelButton onClick={handleCancel} disabled={progress} />
          {(isLoadingFile || progress) && <CircularProgressMedium />}
        </div>
      </div>
      {templatesVisible && (
        <FakeWindow
          title={`CHOOSE FAX TEMPLATE(S)`}
          width={800}
          height={600}
          x={window.innerWidth - 800}
          y={0}
          color="#93b5e9"
          setPopUpVisible={setTemplatesVisible}
        >
          <FaxesTemplates handleSelectTemplate={handleSelectTemplate} />
        </FakeWindow>
      )}
    </div>
  );
};

export default NewFax;
