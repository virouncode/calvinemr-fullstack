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
  EdocType,
  MessageAttachmentType,
  MessageExternalType,
  MessageTemplateType,
  MessageType,
  PamphletType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { handleUploadAttachment } from "../../../../utils/files/handleUploadAttachment";
import { toEmailAlertStaffText } from "../../../../utils/messages/toEmailAlertStaffText";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import AttachEdocsPamphletsButton from "../../../UI/Buttons/AttachEdocsPamphletsButton";
import AttachFilesButton from "../../../UI/Buttons/AttachFilesButton";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import Input from "../../../UI/Inputs/Input";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessageExternal from "../External/MessageExternal";
import StaffContacts from "../StaffContacts";
import AddEdocsPamphlets from "./AddEdocsPamphlets";
import Message from "./Message";
import MessagesAttachments from "./MessagesAttachments";
import MessagesTemplates from "./Templates/MessagesTemplates";

type ForwardMessageMobileProps = {
  setForwardVisible: React.Dispatch<React.SetStateAction<boolean>>;
  message: MessageType;
  previousMsgs: (MessageType | MessageExternalType)[];
  patientName: string;
  section: string;
};

const ForwardMessageMobile = ({
  setForwardVisible,
  message,
  previousMsgs,
  patientName,
  section,
}: ForwardMessageMobileProps) => {
  //Hooks
  const { clinic } = useClinicContext();
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [attachments, setAttachments] = useState<
    Partial<MessageAttachmentType>[]
  >([]);
  const [edocs, setEdocs] = useState<EdocType[]>([]);
  const [pamphlets, setPamphlets] = useState<PamphletType[]>([]);
  const [recipientsIds, setRecipientsIds] = useState<number[]>([]);
  const [body, setBody] = useState("");
  const [important, setImportant] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [addEdocsPamphletsVisible, setAddEdocsPamphletsVisible] =
    useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recipientsRef = useRef<HTMLDivElement | null>(null);
  //Queries
  const messagePost = useMessagePost(user.id, section);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleImportanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setImportant(value);
  };

  const handleSelectTemplate = (template: MessageTemplateType) => {
    if (template.to_staff_ids.length) setRecipientsIds(template.to_staff_ids);
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
    setForwardVisible(false);
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
      const response: number[] = await xanoPost(
        "/messages_attachments",
        "staff",
        {
          attachments_array: attachmentsToPost,
        }
      );
      attach_ids = [
        ...(
          message.attachments_ids as { attachment: MessageAttachmentType }[]
        ).map(({ attachment }) => attachment.id as number),
        ...response,
      ];
    } else {
      attach_ids = [
        ...(
          message.attachments_ids as { attachment: MessageAttachmentType }[]
        ).map(({ attachment }) => attachment.id as number),
      ];
    }
    //create the message
    const messageToPost: Partial<MessageType> = {
      from_id: user.id,
      to_staff_ids: recipientsIds,
      subject: previousMsgs.length
        ? `Fwd: ${message.subject.slice(message.subject.indexOf(":") + 1)}`
        : `Fwd: ${message.subject}`,
      body: body,
      attachments_ids: attach_ids,
      related_patient_id: message.related_patient_id || 0,
      read_by_staff_ids: [user.id],
      previous_messages: [
        ...message.previous_messages,
        { message_type: "Internal", id: message.id },
      ],
      date_created: nowTZTimestamp(),
      type: "Internal",
      high_importance: important,
    };
    messagePost.mutate(messageToPost, {
      onSuccess: async () => {
        const emailsToPost: { to: string; subject: string; text: string }[] =
          [];
        const senderName = staffIdToTitleAndName(staffInfos, user.id);
        for (const to_staff_id of recipientsIds) {
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
          setForwardVisible(false);
        }
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
      "messages_attachment_"
    );
  };

  const handleRemoveAttachment = (fileName: string) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file?.name !== fileName
    );
    setAttachments(updatedAttachments);
  };
  const handleClickRecipients = () => {
    if (recipientsRef.current) {
      recipientsRef.current.style.transform = "translateX(0)";
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
    <div className="forward-message-mobile">
      <div className="forward-message-mobile__contacts" ref={recipientsRef}>
        <StaffContacts
          recipientsIds={recipientsIds}
          setRecipientsIds={setRecipientsIds}
          closeCross={true}
          recipientsRef={recipientsRef}
        />
      </div>
      <div className="forward-message-mobile__form">
        <div
          className="forward-message-mobile__form-recipients"
          onClick={handleClickRecipients}
        >
          <Input
            id="to"
            label="To:"
            placeholder="Recipients"
            value={staffInfos
              .filter(({ id }) => recipientsIds.includes(id))
              .map((staff) => staffIdToTitleAndName(staffInfos, staff.id))
              .join(" / ")}
            readOnly={true}
          />
        </div>
        <div className="forward-message-mobile__form-subject">
          <Input
            value={
              previousMsgs.length
                ? `\u00A0Fwd: ${message.subject.slice(
                    message.subject.indexOf(":") + 1
                  )}`
                : `\u00A0Fwd: ${message.subject}`
            }
            readOnly={true}
            id="subject"
            label="Subject:"
            placeholder="Subject"
          />
        </div>
        {patientName && (
          <div className="forward-message-mobile__form-patient">
            <Input
              id="relatedPatient"
              label="About Patient:"
              placeholder="Patient"
              value={patientName}
              readOnly
            />
          </div>
        )}
        <div className="forward-message-mobile__form-attach">
          <AttachFilesButton onClick={handleAttach} attachments={attachments} />
        </div>
        <div className="forward-message-mobile__form-attach">
          <AttachEdocsPamphletsButton
            onClick={handleEdocsPamphlets}
            edocs={edocs}
            pamphlets={pamphlets}
          />
        </div>
        <div className="forward-message-mobile__form-importance">
          <div className="forward-message-mobile__form-importance-check">
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
        <div className="forward-message__form-body">
          <textarea value={body} onChange={handleChange} ref={textareaRef} />
          <div className="forward-message__form-history">
            <Message
              message={message}
              key={message.id}
              index={0}
              section={section}
            />
            {previousMsgs.map((message, index) =>
              message.type === "Internal" ? (
                <Message
                  message={message as MessageType}
                  key={message.id}
                  index={index + 1}
                  section={section}
                />
              ) : (
                <MessageExternal
                  message={message as MessageExternalType}
                  key={message.id}
                  index={index + 1}
                />
              )
            )}
          </div>
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
        <div className="forward-message-mobile__form-btns">
          <SaveButton
            onClick={handleSend}
            disabled={isLoadingFile || progress}
            label="Send"
          />
          <CancelButton onClick={handleCancel} disabled={progress} />
          {isLoadingFile && <CircularProgressMedium />}
        </div>
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

export default ForwardMessageMobile;
