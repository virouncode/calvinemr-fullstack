import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useMessageExternalPost } from "../../../hooks/reactquery/mutations/messagesMutations";
import { MessageAttachmentType, MessageExternalType } from "../../../types/api";
import { UserPatientType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { handleUploadAttachment } from "../../../utils/files/handleUploadAttachment";
import { toEmailAlertStaffText } from "../../../utils/messages/toEmailAlertStaffText";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/names/toPatientName";
import MessageExternal from "../../Staff/Messaging/External/MessageExternal";
import MessagesAttachments from "../../Staff/Messaging/Internal/MessagesAttachments";
import AttachFilesButton from "../../UI/Buttons/AttachFilesButton";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Input from "../../UI/Inputs/Input";
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
  const { clinic } = useClinicContext();
  const { user } = useUserContext() as { user: UserPatientType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<
    Partial<MessageAttachmentType>[]
  >([]);
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
      onSuccess: async () => {
        socket?.emit("message", {
          route: "UNREAD EXTERNAL",
          action: "update",
          content: {
            userId: messageToPost.to_staff_id,
          },
        });
        const senderName = toPatientName(user.demographics);
        const staff = staffInfos.find(({ id }) => id === message.from_staff_id);
        const emailToPost = {
          to: staff?.email ?? "",
          subject: `${clinic?.name ?? ""} - New message - DO NOT REPLY`,
          text: toEmailAlertStaffText(
            staffIdToTitleAndName(staffInfos, message.from_staff_id),
            senderName,
            messageToPost.subject ?? "",
            messageToPost.body ?? ""
          ),
        };
        try {
          await axios.post(`/api/mailgun`, emailToPost);
        } catch (err) {
          if (err instanceof Error) {
            toast.error(
              `Unable to send email alert to recipient:${err.message}`,
              { containerId: "A" }
            );
          }
        } finally {
          setReplyVisible(false);
          setCurrentMsgId(0);
        }
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleAttach = () => {
    handleUploadAttachment(
      setIsLoadingFile,
      attachments,
      setAttachments,
      user,
      "messages_patient_attachment_"
    );
  };

  const handleRemoveAttachment = (fileName: string) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file?.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  return (
    <div className="reply-message">
      <div className="reply-message__btns">
        <SaveButton
          onClick={handleSend}
          disabled={isLoadingFile || progress}
          label="Send"
        />
        <CancelButton onClick={handleCancel} disabled={progress} />
        {isLoadingFile && <CircularProgressMedium />}
      </div>
      <div className="reply-message__recipients">
        <Input
          label="To:"
          id="to"
          value={staffIdToTitleAndName(staffInfos, message.from_staff_id)}
          placeholder="Recipient(s)"
          readOnly={true}
        />
      </div>
      <div className="reply-message__subject">
        <Input
          value={
            previousMsgs.length
              ? `\u00A0Re: ${message.subject.slice(
                  message.subject.indexOf(":") + 1
                )}`
              : `\u00A0Re: ${message.subject}`
          }
          id="subject"
          label="Subject:"
          placeholder="Subject"
          readOnly={true}
        />
      </div>
      <div className="reply-message__attach">
        <AttachFilesButton onClick={handleAttach} attachments={attachments} />
      </div>
      <div className="reply-message__body">
        <textarea value={body} onChange={handleChange} autoFocus />
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
        {attachments.length > 0 && (
          <MessagesAttachments
            attachments={attachments}
            handleRemoveAttachment={handleRemoveAttachment}
            deletable={true}
            cardWidth="17%"
            addable={false}
          />
        )}
      </div>
    </div>
  );
};

export default ReplyMessagePatient;
