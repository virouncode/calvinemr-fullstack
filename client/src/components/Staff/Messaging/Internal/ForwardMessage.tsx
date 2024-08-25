import { uniqueId } from "lodash";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessagePost } from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  AttachmentType,
  MessageAttachmentType,
  MessageExternalType,
  MessageTemplateType,
  MessageType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import AttachFilesButton from "../../../UI/Buttons/AttachFilesButton";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import Input from "../../../UI/Inputs/Input";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessageExternal from "../External/MessageExternal";
import StaffContacts from "../StaffContacts";
import Message from "./Message";
import MessagesAttachments from "./MessagesAttachments";
import MessagesTemplates from "./Templates/MessagesTemplates";

type ForwardMessageProps = {
  setForwardVisible: React.Dispatch<React.SetStateAction<boolean>>;
  message: MessageType;
  previousMsgs: (MessageType | MessageExternalType)[];
  patientName: string;
  section: string;
};

const ForwardMessage = ({
  setForwardVisible,
  message,
  previousMsgs,
  patientName,
  section,
}: ForwardMessageProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [attachments, setAttachments] = useState<MessageAttachmentType[]>([]);
  const [recipientsIds, setRecipientsIds] = useState<number[]>([]);
  const [body, setBody] = useState("");
  const [important, setImportant] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
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
    let attach_ids: number[] = [];
    if (attachments.length > 0) {
      const response: number[] = await xanoPost(
        "/messages_attachments",
        "staff",
        {
          attachments_array: attachments,
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
      onSuccess: () => {
        setForwardVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
    for (const to_staff_id of recipientsIds) {
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
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg";
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
          const response: AttachmentType = await xanoPost(
            "/upload/attachment",
            "staff",
            { content }
          );
          if (!response.type) response.type = "document";
          setAttachments([
            ...attachments,
            {
              file: response,
              alias: file.name,
              date_created: nowTZTimestamp(),
              created_by_id: user.id,
              created_by_user_type: "staff",
              id: uniqueId("messages_attachment_"),
            },
          ]); //meta, mime, name, path, size, type
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

  const handleRemoveAttachment = (fileName: string) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file?.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  return (
    <div className="forward-message">
      <div className="forward-message__contacts">
        <StaffContacts
          recipientsIds={recipientsIds}
          setRecipientsIds={setRecipientsIds}
        />
      </div>
      <div className="forward-message__form">
        <div className="forward-message__recipients">
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
        <div className="forward-message__subject">
          <strong>Subject:</strong>
          {previousMsgs.length
            ? `\u00A0Fwd: ${message.subject.slice(
                message.subject.indexOf(":") + 1
              )}`
            : `\u00A0Fwd: ${message.subject}`}
        </div>
        {patientName && (
          <div className="forward-message__patient">
            <strong>About patient: {"\u00A0"}</strong> {patientName}
          </div>
        )}
        <div className="forward-message__attach">
          <AttachFilesButton onClick={handleAttach} attachments={attachments} />
        </div>
        <div className="forward-message__importance">
          <div className="forward-message__importance-check">
            <Checkbox
              name="high_importance"
              id="importance"
              onChange={handleImportanceChange}
              checked={important}
              label="High importance"
            />
            import MessagesTemplates from './Templates/MessagesTemplates';
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
        <div className="forward-message__body">
          <textarea
            value={body}
            onChange={handleChange}
            ref={textareaRef}
            autoFocus
          />
          <div className="forward-message__history">
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
          <MessagesAttachments
            attachments={attachments}
            handleRemoveAttachment={handleRemoveAttachment}
            deletable={true}
            cardWidth="30%"
            addable={false}
          />
        </div>
        <div className="forward-message__btns">
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
          color="#93b5e9"
          setPopUpVisible={setTemplatesVisible}
        >
          <MessagesTemplates handleSelectTemplate={handleSelectTemplate} />
        </FakeWindow>
      )}
    </div>
  );
};

export default ForwardMessage;
