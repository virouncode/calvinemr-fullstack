import { uniqueId } from "lodash";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useFaxPost } from "../../../hooks/reactquery/mutations/faxMutations";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import {
  ClinicType,
  DoctorType,
  FaxContactType,
  FaxTemplateType,
  FaxToPostType,
  MessageAttachmentType,
  PharmacyType,
} from "../../../types/api";
import { UserStaffType } from "../../../types/app";
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
import FaxContacts from "./Contacts/FaxContacts";
import FaxAttachmentCard from "./FaxAttachmentCard";
import FaxesTemplates from "./Templates/FaxesTemplates";

type NewFaxProps = {
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initialAttachment?: Partial<MessageAttachmentType>;
  initialRecipient?: { ToFaxNumber: string };
  reply?: boolean;
};

const NewFax = ({
  setNewVisible,
  initialAttachment,
  initialRecipient,
  reply = false,
}: NewFaxProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const { clinic } = useClinicContext() as { clinic: ClinicType };
  const [attachment, setAttachment] =
    useState<Partial<MessageAttachmentType> | null>(initialAttachment ?? null);
  const [toFaxNumber, setToFaxNumber] = useState(
    initialRecipient?.ToFaxNumber || ""
  );
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  //Queries
  const { data: sites, isPending, error } = useSites();
  const faxPost = useFaxPost();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBody(e.target.value);
  };

  const handleChangeToFaxNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToFaxNumber(value);
  };

  const handleChangeSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleSelectTemplate = (template: FaxTemplateType) => {
    if (template.subject) setSubject(template.subject);
    setBody((b) =>
      b ? b + "\n\n" + template.body + "\n" : template.body + "\n"
    );
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
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

    const faxToPost: FaxToPostType = {
      sToFaxNumber: `1${toFaxNumber}`,
      sCPFromName: staffIdToTitleAndName(staffInfos, user.id),
      sCPToName: "whom it may concern",
      sCPOrganization: `${clinic.name} - ${
        sites?.find(({ id }) => id === user.site_id)?.name ?? ""
      } - phone: ${sites?.find(({ id }) => id === user.site_id)?.phone ?? ""}`,
      sCPSubject: subject,
      sCPComments: body,
    };
    if (attachment) {
      faxToPost.sFileName_1 = (
        attachment as Partial<MessageAttachmentType>
      ).file?.name;
      faxToPost.fileURL = `${import.meta.env.VITE_XANO_BASE_URL}${
        (attachment as Partial<MessageAttachmentType>).file?.path
      }`;
    }
    faxPost.mutate(faxToPost, {
      onSuccess: () => {
        setNewVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  const handleAttach = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpeg, .jpg, .png, .pdf";
    // ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx";
    input.onchange = (event) => {
      // getting a hold of the file reference
      const e = event as unknown as React.ChangeEvent<HTMLInputElement>;
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 25000000) {
        toast.error(
          "The file is over 25Mb, please choose another one or send a link",
          { containerId: "A" }
        );
        return;
      }
      setIsLoadingFile(true);
      // setting up the reader`
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // here we tell the reader what to do when it's done reading...
      reader.onload = async (e) => {
        const content = e.target?.result; // this is the content!
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
          if (err instanceof Error)
            toast.error(`Error: unable to load file: ${err.message}`, {
              containerId: "A",
            });
          setIsLoadingFile(false);
        }
      };
    };
    input.click();
  };

  const handleClickPharmacy = (pharmacy: PharmacyType) => {
    setToFaxNumber(pharmacy.FaxNumber.phoneNumber.replace(/-/g, ""));
  };
  const handleClickDoctor = (doctor: DoctorType) => {
    setToFaxNumber(doctor.FaxNumber.phoneNumber.replace(/-/g, ""));
  };
  const handleClickOther = (other: FaxContactType) => {
    setToFaxNumber(other.fax_number.replace(/-/g, ""));
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
        <div className="new-fax__form-recipients">
          <Input
            value={toFaxNumber}
            onChange={handleChangeToFaxNumber}
            id="to"
            label="To:"
            placeholder="Please enter a 10-digit fax number or select a contact..."
          />
        </div>
        <div className="new-fax__form-subject">
          <Input
            value={subject}
            onChange={handleChangeSubject}
            id="subject"
            label="Subject:"
            placeholder="Subject"
          />
        </div>
        <div className="new-fax__form-attach">
          <AttachFilesButton
            onClick={handleAttach}
            attachments={attachment ? [attachment] : []}
          />
        </div>
        <div className="new-fax__form-templates">
          <div>
            <strong
              onClick={() => setTemplatesVisible((v) => !v)}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Use Template
            </strong>
          </div>
        </div>
        <div className="new-fax__form-body">
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
        <div className="new-fax__form-btns">
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
          color="#8fb4fb"
          setPopUpVisible={setTemplatesVisible}
        >
          <FaxesTemplates handleSelectTemplate={handleSelectTemplate} />
        </FakeWindow>
      )}
    </div>
  );
};

export default NewFax;
