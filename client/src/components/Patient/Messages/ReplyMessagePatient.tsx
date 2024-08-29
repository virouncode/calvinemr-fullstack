import { uniqueId } from "lodash";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useMessageExternalPost } from "../../../hooks/reactquery/mutations/messagesMutations";
import {
  AttachmentType,
  MessageAttachmentType,
  MessageExternalType,
} from "../../../types/api";
import { UserPatientType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import MessageExternal from "../../Staff/Messaging/External/MessageExternal";
import MessagesAttachments from "../../Staff/Messaging/Internal/MessagesAttachments";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import PaperclipIcon from "../../UI/Icons/PaperclipIcon";
import CircularProgressMedium from "../../UI/Progress/CircularProgressMedium";

type ReplyMessagePatientProps = {
  setReplyVisible: React.Dispatch<React.SetStateAction<boolean>>;
  message: MessageExternalType;
  previousMsgs: MessageExternalType[];
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
};

const ReplyMessagePatient = ({
  setReplyVisible,
  message,
  previousMsgs,
  setCurrentMsgId,
}: ReplyMessagePatientProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserPatientType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachmentType[]>([]);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  //Queries
  const messagePost = useMessageExternalPost();

  const handleCancel = () => {
    setReplyVisible(false);
  };
  const handleSend = async () => {
    setProgress(true);
    let attach_ids: number[] = [];
    if (attachments.length > 0) {
      const response = await xanoPost("/messages_attachments", "patient", {
        attachments_array: attachments,
      });
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
    const messageToPost: Partial<MessageExternalType> = {
      from_patient_id: user.id,
      to_staff_id: message.from_staff_id,
      subject: previousMsgs.length
        ? `Re: ${message.subject.slice(message.subject.indexOf(":") + 1)}`
        : `Re: ${message.subject}`,
      body: body,
      attachments_ids: attach_ids,
      read_by_patients_ids: [user.id],
      previous_messages_ids: [...previousMsgs.map(({ id }) => id), message.id],
      date_created: nowTZTimestamp(),
      type: "External",
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
    socket?.emit("message", {
      route: "UNREAD EXTERNAL",
      action: "update",
      content: {
        userId: messageToPost.to_staff_id,
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
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
            "patient",
            { content }
          );
          if (!response.type) response.type = "document";
          setAttachments([
            ...attachments,
            {
              file: response,
              alias: file?.name,
              date_created: nowTZTimestamp(),
              created_by_id: user.id,
              created_by_user_type: "patient",
              id: uniqueId("messages_patient_attachment_"),
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
          {staffIdToTitleAndName(staffInfos, message.from_staff_id)}
        </p>
      </div>
      <div className="reply-message__subject">
        <strong>Subject:</strong>
        {previousMsgs.length
          ? `\u00A0Re: ${message.subject.slice(
              message.subject.indexOf(":") + 1
            )}`
          : `\u00A0Re: ${message.subject}`}
      </div>
      <div className="reply-message__attach">
        <strong>Attach files</strong>
        <PaperclipIcon onClick={handleAttach} />
        {attachments.map((attachment) => (
          <span key={attachment.file?.name} style={{ marginLeft: "5px" }}>
            {attachment.alias},
          </span>
        ))}
      </div>
      <div className="reply-message__body">
        <textarea value={body} onChange={handleChange}></textarea>
        <div className="reply-message__history">
          <MessageExternal message={message} key={message.id} index={0} />
          {previousMsgs.map((message, index) => (
            <MessageExternal
              message={message}
              key={message.id}
              index={index + 1}
            />
          ))}
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
    </div>
  );
};

export default ReplyMessagePatient;
