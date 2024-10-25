import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useFaxPost } from "../../../hooks/reactquery/mutations/faxMutations";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import {
  ClinicType,
  EdocType,
  FaxTemplateType,
  FaxToPostType,
  MessageAttachmentType,
  PamphletType,
} from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import AttachEdocsPamphletsButton from "../../UI/Buttons/AttachEdocsPamphletsButton";
import AttachFilesButton from "../../UI/Buttons/AttachFilesButton";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Input from "../../UI/Inputs/Input";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import CircularProgressMedium from "../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../UI/Windows/FakeWindow";
import AddEdocsPamphlets from "../Messaging/Internal/AddEdocsPamphlets";
import MessagesAttachments from "../Messaging/Internal/MessagesAttachments";
import FaxContacts from "./Contacts/FaxContacts";
import FaxesTemplates from "./Templates/FaxesTemplates";
import { handleUploadAttachment } from "../../../utils/files/handleUploadAttachment";

type NewFaxProps = {
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initialAttachments?: Partial<MessageAttachmentType>[];
  initialRecipient?: { ToFaxNumber: string };
  reply?: boolean;
};

const NewFaxMobile = ({
  setNewVisible,
  initialAttachments = [],
  initialRecipient,
  reply = false,
}: NewFaxProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const { clinic } = useClinicContext() as { clinic: ClinicType };
  const [attachments, setAttachments] =
    useState<Partial<MessageAttachmentType>[]>(initialAttachments);
  const [edocs, setEdocs] = useState<EdocType[]>([]);
  const [pamphlets, setPamphlets] = useState<PamphletType[]>([]);
  const [toFaxNumbers, setToFaxNumbers] = useState(
    initialRecipient ? [initialRecipient.ToFaxNumber] : []
  );
  const [toNewFaxNumbers, setToNewFaxNumbers] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [addEdocsPamphletsVisible, setAddEdocsPamphletsVisible] =
    useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recipientsRef = useRef<HTMLDivElement | null>(null);
  //Queries
  const { data: sites, isPending, error } = useSites();
  const faxPost = useFaxPost();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBody(e.target.value);
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

  const handleRemoveAttachment = (fileName: string) => {
    setAttachments(
      attachments.filter((attachment) => attachment.file?.name !== fileName)
    );
  };
  const handleRemoveEdoc = (edocId: number) => {
    setEdocs(edocs.filter(({ id }) => id !== edocId));
  };
  const handleRemovePamphlet = (pamphletId: number) => {
    setPamphlets(pamphlets.filter(({ id }) => id !== pamphletId));
  };

  const handleSend = async () => {
    const regex = /^\d{10}$/;
    toFaxNumbers.forEach((toFaxNumber) => {
      if (!regex.test(toFaxNumber)) {
        toast.error(
          `${toFaxNumber} is not a valid fax number, please enter a valid 10-digit fax number`,
          {
            containerId: "A",
          }
        );
        return;
      }
    });
    setProgress(true);
    const attachmentsToPost: Partial<MessageAttachmentType>[] = [
      ...attachments,
      ...(edocs.map((edoc) => ({
        file: edoc.file,
        alias: edoc.name,
        date_created: nowTZTimestamp(),
        created_by_user_type: "staff",
        created_by_id: user.id,
      })) as Partial<MessageAttachmentType>[]),
      ...(pamphlets.map((pamphlet) => ({
        file: pamphlet.file,
        alias: pamphlet.name,
        date_created: nowTZTimestamp(),
        created_by_user_type: "staff",
        created_by_id: user.id,
      })) as Partial<MessageAttachmentType>[]),
    ];
    const faxToPost: FaxToPostType = {
      faxNumbers: toFaxNumbers,
      sCPFromName: staffIdToTitleAndName(staffInfos, user.id),
      sCPToName: "whom it may concern",
      sCPOrganization: `${clinic.name} - ${
        sites?.find(({ id }) => id === user.site_id)?.name ?? ""
      } - phone: ${sites?.find(({ id }) => id === user.site_id)?.phone ?? ""}`,
      sCPSubject: subject,
      sCPComments: body,
      attachments: attachmentsToPost.map((attachment) => ({
        fileURL:
          `${import.meta.env.VITE_XANO_BASE_URL}${attachment.file?.path}` || "",
        fileName: attachment.file?.name || "",
      })),
    };

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
    handleUploadAttachment(
      setIsLoadingFile,
      attachments,
      setAttachments,
      user,
      "fax_attachment_"
    );
  };

  const handleEdocsPamphlets = () => {
    setAddEdocsPamphletsVisible((v) => !v);
  };
  const handleClickRecipients = () => {
    if (recipientsRef.current) {
      recipientsRef.current.style.transform = "translateX(0)";
    }
  };
  const handleChangeToNewFaxNumbers = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setToNewFaxNumbers(e.target.value);
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
    <div className="new-fax-mobile">
      <div className="new-fax-mobile__contacts" ref={recipientsRef}>
        <FaxContacts
          toFaxNumbers={toFaxNumbers}
          setToFaxNumbers={setToFaxNumbers}
          closeCross={true}
          recipientsRef={recipientsRef}
        />
      </div>
      <div className="new-fax-mobile__form">
        <div
          className="new-fax__form-recipients"
          onClick={handleClickRecipients}
        >
          <Input
            value={toFaxNumbers.join(", ")}
            readOnly={true}
            id="to"
            label="To:"
            placeholder="Choose Recipient(s) from directory"
          />
        </div>
        <div className="new-fax__form-recipients">
          <Input
            value={toNewFaxNumbers}
            onChange={handleChangeToNewFaxNumbers}
            id="to"
            label="To:"
            placeholder="New numbers: xxx-xxx-xxxx, xxx-xxx-xxxx, ..."
          />
        </div>
        <div className="new-fax__form-attach">
          <AttachFilesButton onClick={handleAttach} attachments={attachments} />
        </div>
        <div className="new-fax__form-attach">
          <AttachEdocsPamphletsButton
            onClick={handleEdocsPamphlets}
            edocs={edocs}
            pamphlets={pamphlets}
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
          {(attachments.length > 0 ||
            edocs.length > 0 ||
            pamphlets.length > 0) && (
            <MessagesAttachments
              attachments={attachments}
              edocs={edocs}
              pamphlets={pamphlets}
              handleRemoveAttachment={handleRemoveAttachment}
              handleRemoveEdoc={handleRemoveEdoc}
              handleRemovePamphlet={handleRemovePamphlet}
              deletable={true}
              addable={false}
              cardWidth="30%"
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
      {addEdocsPamphletsVisible && (
        <FakeWindow
          title={`CHOOSE EDOCS/PAMPHLETS TO SEND`}
          width={800}
          height={window.innerHeight}
          x={window.innerWidth - 800}
          y={0}
          color="#8fb4fb"
          setPopUpVisible={setAddEdocsPamphletsVisible}
        >
          <AddEdocsPamphlets
            edocs={edocs}
            pamphlets={pamphlets}
            setEdocs={setEdocs}
            setPamphlets={setPamphlets}
            setAddEdocsPamphletsVisible={setAddEdocsPamphletsVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default NewFaxMobile;
