import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessagePost } from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  DemographicsType,
  EdocType,
  MessageAttachmentType,
  MessageTemplateType,
  MessageType,
  PamphletType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import AttachEdocsPamphletsButton from "../../../UI/Buttons/AttachEdocsPamphletsButton";
import AttachFilesButton from "../../../UI/Buttons/AttachFilesButton";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import Input from "../../../UI/Inputs/Input";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import Patients from "../Patients";
import StaffContacts from "../StaffContacts";
import AddEdocsPamphlets from "./AddEdocsPamphlets";
import MessagesAttachments from "./MessagesAttachments";
import MessagesTemplates from "./Templates/MessagesTemplates";
import { handleUploadAttachment } from "../../../../utils/files/handleUploadAttachment";

type NewMessageMobileProps = {
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initialPatient?: { id: number; name: string };
  initialAttachments?: Partial<MessageAttachmentType>[] | undefined;
  initialBody?: string;
};

const NewMessageMobile = ({
  setNewVisible,
  initialPatient = { id: 0, name: "" },
  initialAttachments = [],
  initialBody = "",
}: NewMessageMobileProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [attachments, setAttachments] =
    useState<Partial<MessageAttachmentType>[]>(initialAttachments);
  const [edocs, setEdocs] = useState<EdocType[]>([]);
  const [pamphlets, setPamphlets] = useState<PamphletType[]>([]);
  const [recipientsIds, setRecipientsIds] = useState<number[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(initialBody || "");
  const [important, setImportant] = useState(false);
  const [relatedPatient, setRelatedPatient] = useState(initialPatient);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [addEdocsPamphletsVisible, setAddEdocsPamphletsVisible] =
    useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  //Queries
  const messagePost = useMessagePost(user.id, "Received messages");
  const recipientsRef = useRef<HTMLDivElement | null>(null);
  const patientsRef = useRef<HTMLDivElement | null>(null);
  const edocsPamphletsRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const isPatientChecked = (id: number) => {
    return relatedPatient.id === id;
  };

  const handleSelectTemplate = (template: MessageTemplateType) => {
    if (template.to_staff_ids.length) setRecipientsIds(template.to_staff_ids);
    if (template.subject) setSubject(template.subject);
    setBody((b) =>
      b ? b + "\n" + template.body + "\n" : template.body + "\n"
    );
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  };

  const handleCheckRelatedPatient = (
    e: React.ChangeEvent<HTMLInputElement>,
    info: DemographicsType
  ) => {
    const checked = e.target.checked;
    if (checked) {
      setRelatedPatient({ id: info.patient_id, name: toPatientName(info) });
    } else {
      setRelatedPatient({ id: 0, name: "" });
    }
  };

  const handleImportanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setImportant(value);
  };

  const handleCancel = () => {
    setNewVisible(false);
  };

  const handleRemoveAttachment = (fileName: string) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file?.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  const handleSend = async () => {
    if (!recipientsIds.length) {
      toast.error("Please choose at least one recipient", { containerId: "A" });
      return;
    }
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
    let attach_ids = [];
    if (attachmentsToPost.length > 0) {
      attach_ids = await xanoPost("/messages_attachments", "staff", {
        attachments_array: attachmentsToPost,
      });
    }
    const messageToPost: Partial<MessageType> = {
      from_id: user.id,
      to_staff_ids: recipientsIds,
      subject: subject,
      body: body,
      attachments_ids: attach_ids,
      related_patient_id: relatedPatient.id,
      read_by_staff_ids: [user.id],
      date_created: nowTZTimestamp(),
      high_importance: important,
    };
    messagePost.mutate(messageToPost, {
      onSuccess: () => {
        setProgress(false);
        setNewVisible(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
    for (const to_staff_id of messageToPost.to_staff_ids ?? []) {
      if (to_staff_id !== user.id) {
        socket?.emit("message", {
          route: "UNREAD",
          action: "update",
          content: {
            userId: to_staff_id,
          },
        });
      }
    }
  };

  const handleAttach = () => {
    handleUploadAttachment(
      setIsLoadingFile,
      attachments,
      setAttachments,
      user,
      "messages_attachment_"
    );
  };

  const handleClickRecipients = () => {
    if (recipientsRef.current) {
      recipientsRef.current.style.transform = "translateX(0)";
    }
  };
  const handleClickPatient = () => {
    if (patientsRef.current) {
      patientsRef.current.style.transform = "translateX(0)";
    }
  };

  const handleRemoveEdoc = (edocId: number) => {
    setEdocs(edocs.filter(({ id }) => id !== edocId));
  };
  const handleRemovePamphlet = (pamphletId: number) => {
    setPamphlets(pamphlets.filter(({ id }) => id !== pamphletId));
  };
  const handleEdocsPamphlets = () => {
    setAddEdocsPamphletsVisible((v) => !v);
  };

  return (
    <div className="new-message-mobile">
      <div className="new-message-mobile__contacts" ref={recipientsRef}>
        <StaffContacts
          recipientsIds={recipientsIds}
          setRecipientsIds={setRecipientsIds}
          closeCross={true}
          recipientsRef={recipientsRef}
        />
      </div>
      <div className="new-message-mobile__form">
        <div
          className="new-message__form-recipients"
          onClick={handleClickRecipients}
        >
          <Input
            label="To:"
            id="to"
            placeholder="Recipient(s)"
            value={staffInfos
              .filter(({ id }) => recipientsIds.includes(id))
              .map((staff) => staffIdToTitleAndName(staffInfos, staff.id))
              .join(" / ")}
            readOnly={true}
          />
        </div>
        <div className="new-message__form-subject">
          <Input
            value={subject}
            onChange={handleChangeSubject}
            id="subject"
            label="Subject:"
            placeholder="Subject"
          />
        </div>
        <div className="new-message__form-patient" onClick={handleClickPatient}>
          <Input
            id="relatedPatient"
            label="About Patient:"
            placeholder="Patient"
            value={relatedPatient.name}
            readOnly
          />
        </div>
        <div className="new-message__form-attach">
          <AttachFilesButton onClick={handleAttach} attachments={attachments} />
        </div>
        <div className="new-message__form-attach">
          <AttachEdocsPamphletsButton
            onClick={handleEdocsPamphlets}
            edocs={edocs}
            pamphlets={pamphlets}
          />
        </div>
        <div className="new-message__form-importance">
          <div className="new-message__form-importance-check">
            <Checkbox
              name="high_importance"
              id="importance"
              onChange={handleImportanceChange}
              checked={important}
              label="High importance"
            />
          </div>
          <div>
            <strong
              onClick={() => setTemplatesVisible((v) => !v)}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Use Template
            </strong>
          </div>
        </div>
        <div className="new-message__form-body">
          <textarea value={body} onChange={handleChange} ref={textareaRef} />
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
        <div className="new-message__form-btns">
          <SaveButton
            onClick={handleSend}
            disabled={isLoadingFile || progress}
            label="Send"
          />
          <CancelButton onClick={handleCancel} disabled={progress} />
          {isLoadingFile && <CircularProgressMedium />}
        </div>
      </div>
      <div className="new-message-mobile__patients" ref={patientsRef}>
        <Patients
          handleCheckPatient={handleCheckRelatedPatient}
          isPatientChecked={isPatientChecked}
          msgType="Internal"
          closeCross={true}
          patientsRef={patientsRef}
        />
      </div>
      {templatesVisible && (
        <FakeWindow
          title={`CHOOSE MESSAGE TEMPLATE(S)`}
          width={800}
          height={600}
          x={window.innerWidth - 800}
          y={0}
          color="#8fb4fb"
          setPopUpVisible={setTemplatesVisible}
        >
          <MessagesTemplates handleSelectTemplate={handleSelectTemplate} />
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

export default NewMessageMobile;
