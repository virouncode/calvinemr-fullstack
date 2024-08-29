import { uniqueId } from "lodash";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../../api/xanoCRUD/xanoPost";
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
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import PaperclipIcon from "../../../UI/Icons/PaperclipIcon";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessageExternal from "../External/MessageExternal";
import Message from "./Message";
import MessagesAttachments from "./MessagesAttachments";
import MessagesTemplates from "./Templates/MessagesTemplates";

type ReplyMessageProps = {
  setReplyVisible: React.Dispatch<React.SetStateAction<boolean>>;
  allPersons: boolean;
  message: MessageType;
  previousMsgs: (MessageType | MessageExternalType)[] | undefined;
  patientName: string;
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  section: string;
};

const ReplyMessage = ({
  setReplyVisible,
  allPersons,
  message,
  previousMsgs,
  patientName,
  setCurrentMsgId,
  section,
}: ReplyMessageProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [body, setBody] = useState("");
  const [important, setImportant] = useState(false);
  const [attachments, setAttachments] = useState<MessageAttachmentType[]>([]);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  //Queries
  const messagePost = useMessagePost(user.id, section);

  const handleSelectTemplate = (template: MessageTemplateType) => {
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
    setReplyVisible(false);
  };
  const handleSend = async () => {
    setProgress(true);
    let attach_ids: number[] = [];
    if (attachments.length > 0) {
      const response: number[] = await xanoPost(
        "/messages_attachments",
        "staff",
        { attachments_array: attachments }
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
    const messageToPost: Partial<MessageType> = {
      from_id: user.id,
      to_staff_ids: allPersons
        ? [...new Set([...message.to_staff_ids, message.from_id])].filter(
            (id) => id !== user.id
          )
        : [message.from_id],
      subject: previousMsgs?.length
        ? `Re: ${message.subject.slice(message.subject.indexOf(":") + 1)}`
        : `Re: ${message.subject}`,
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
        setReplyVisible(false);
        setCurrentMsgId(0);
        setProgress(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleImportanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setImportant(value);
  };

  const handleAttach = () => {
    const input = document.createElement("input") as HTMLInputElement;
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
            {
              content,
            }
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
    <div className="reply-message__form">
      <div className="reply-message__title">
        <p>
          <strong>To: </strong>
          {allPersons
            ? [...new Set([...message.to_staff_ids, message.from_id])]
                .filter((staffId) => staffId !== user.id)
                .map((staffId) => staffIdToTitleAndName(staffInfos, staffId))
                .join(" / ")
            : staffIdToTitleAndName(staffInfos, message.from_id)}
        </p>
      </div>
      <div className="reply-message__subject">
        <strong>Subject:</strong>
        {previousMsgs?.length
          ? `\u00A0Re: ${message.subject.slice(
              message.subject.indexOf(":") + 1
            )}`
          : `\u00A0Re: ${message.subject}`}
      </div>

      {patientName && (
        <div className="reply-message__patient">
          <strong>About patient:</strong> {"\u00A0" + patientName}
        </div>
      )}
      <div className="reply-message__attach">
        <strong>Attach files</strong>
        <PaperclipIcon onClick={handleAttach} />
        {attachments.map((attachment) => (
          <span key={attachment.file?.name} style={{ marginLeft: "5px" }}>
            {attachment.alias},
          </span>
        ))}
      </div>
      <div className="reply-message__importance">
        <div className="reply-message__importance-check">
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
      <div className="reply-message__body">
        <textarea
          value={body}
          onChange={handleChange}
          id="body-area"
          ref={textareaRef}
          autoFocus
        />
        <div className="reply-message__history">
          <Message
            message={message as MessageType}
            key={message.id}
            index={0}
            section={section}
          />
          {previousMsgs &&
            previousMsgs.map((message, index) =>
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
          cardWidth="17%"
          addable={false}
        />
      </div>
      <div className="reply-message__btns">
        <SaveButton
          onClick={handleSend}
          disabled={isLoadingFile || progress}
          label="Send"
        />
        <CancelButton onClick={handleCancel} disabled={progress} />
        {isLoadingFile && <CircularProgressMedium />}
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

export default ReplyMessage;
