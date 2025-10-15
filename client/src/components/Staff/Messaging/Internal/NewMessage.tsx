import axios from "axios";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../../api/xanoCRUD/xanoPost";
import useClinicContext from "../../../../hooks/context/useClinicContext";
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
import { handleUploadAttachment } from "../../../../utils/files/handleUploadAttachment";
import { toEmailAlertStaffText } from "../../../../utils/messages/toEmailAlertStaffText";
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

type NewMessageProps = {
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initialPatient?: { id: number; name: string };
  initialAttachments?: Partial<MessageAttachmentType>[] | undefined;
  initialBody?: string;
};

const NewMessage = ({
  setNewVisible,
  initialPatient = { id: 0, name: "" },
  initialAttachments = [],
  initialBody = "",
}: NewMessageProps) => {
  //Hooks
  const { clinic } = useClinicContext();
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
    let attach_ids: number[] = [];
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
      onSuccess: async () => {
        const emailsToPost: { to: string; subject: string; text: string }[] =
          [];
        const senderName = staffIdToTitleAndName(staffInfos, user.id);
        for (const to_staff_id of messageToPost.to_staff_ids ?? []) {
          if (to_staff_id !== user.id) {
            socket?.emit("message", {
              route: "UNREAD",
              action: "update",
              content: {
                userId: to_staff_id,
              },
            });
            const staff = staffInfos.find(({ id }) => id === to_staff_id);
            if (!staff) continue; //No staff found -> no email sent
            const emailToPost = {
              to: staff.email,
              subject: `${clinic?.name ?? ""} - New message - DO NOT REPLY`,
              text: toEmailAlertStaffText(
                staffIdToTitleAndName(staffInfos, to_staff_id),
                senderName,
                messageToPost.subject ?? "",
                messageToPost.body ?? ""
              ),
            };
            emailsToPost.push(emailToPost);
          }
        }
        try {
          await Promise.all(
            emailsToPost.map((email) => axios.post(`/api/mailgun`, email))
          );
        } catch (err) {
          if (err instanceof Error) {
            toast.error(
              `Unable to send email alerts to recipients:${err.message}`,
              { containerId: "A" }
            );
          }
        } finally {
          setProgress(false);
          setNewVisible(false);
        }
      },
      onError: () => {
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
      "messages_attachment_"
    );
  };

  const handleEdocsPamphlets = () => {
    setAddEdocsPamphletsVisible((v) => !v);
  };

  return (
    <div className="new-message">
      <div className="new-message__contacts">
        <StaffContacts
          recipientsIds={recipientsIds}
          setRecipientsIds={setRecipientsIds}
        />
      </div>
      <div className="new-message__form">
        <div className="new-message__form-recipients">
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
        <div className="new-message__form-patient">
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
          <textarea
            value={body}
            onChange={handleChange}
            autoFocus
            ref={textareaRef}
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
      <div className="new-message__patients">
        <Patients
          handleCheckPatient={handleCheckRelatedPatient}
          isPatientChecked={isPatientChecked}
          msgType="Internal"
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

export default NewMessage;
