import React, { useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useMessageExternalPost } from "../../../hooks/reactquery/mutations/messagesMutations";
import { MessageAttachmentType, MessageExternalType } from "../../../types/api";
import { UserPatientType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { handleUploadAttachment } from "../../../utils/files/handleUploadAttachment";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import MessagesAttachments from "../../Staff/Messaging/Internal/MessagesAttachments";
import AttachFilesButton from "../../UI/Buttons/AttachFilesButton";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Input from "../../UI/Inputs/Input";
import CircularProgressMedium from "../../UI/Progress/CircularProgressMedium";
import PatientStaffContacts from "./PatientStaffContacts";

type NewMessagePatientProps = {
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewMessagePatient = ({ setNewVisible }: NewMessagePatientProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserPatientType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [attachments, setAttachments] = useState<
    Partial<MessageAttachmentType>[]
  >([]);
  const [recipientId, setRecipientId] = useState(0);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  //Queries
  const messagePost = useMessageExternalPost();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const isContactChecked = (id: number) => recipientId === id;

  const handleCheckContact = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    if (checked) {
      setRecipientId(id);
    } else {
      setRecipientId(0);
    }
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
    if (recipientId === 0) {
      toast.error("Please choose a recipient", { containerId: "A" });
      return;
    }
    setProgress(true);
    let attach_ids = [];
    if (attachments.length > 0) {
      attach_ids = await xanoPost("/messages_attachments", "patient", {
        attachments_array: attachments,
      });
    }
    //create the message
    const messageToPost: Partial<MessageExternalType> = {
      from_patient_id: user.id,
      to_staff_id: recipientId,
      subject: subject,
      body: body,
      attachments_ids: attach_ids,
      read_by_patients_ids: [user.id],
      date_created: nowTZTimestamp(),
      type: "External",
    };
    messagePost.mutate(messageToPost, {
      onSuccess: () => {
        setNewVisible(false);
        socket?.emit("message", {
          route: "UNREAD EXTERNAL",
          action: "update",
          content: {
            userId: messageToPost.to_staff_id,
          },
        });
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
      "messages_patient_attachment_"
    );
  };

  return (
    <div className="new-message new-message--patient">
      <div className="new-message__contacts">
        <PatientStaffContacts
          isContactChecked={isContactChecked}
          handleCheckContact={handleCheckContact}
        />
      </div>
      <div className="new-message__form">
        <div className="new-message__form-recipients">
          <Input
            value={
              recipientId ? staffIdToTitleAndName(staffInfos, recipientId) : ""
            }
            id="to"
            label="To:"
            readOnly={true}
            placeholder="Recipient"
          />
        </div>
        <div className="new-message__form-subject">
          <Input
            value={subject}
            id="subject"
            onChange={handleChangeSubject}
            label="Subject:"
            placeholder="Subject"
          />
        </div>
        <div className="new-message__form-attach">
          <AttachFilesButton onClick={handleAttach} attachments={attachments} />
        </div>
        <div className="new-message__form-body">
          <textarea value={body} onChange={handleChange} autoFocus />
          {attachments.length > 0 && (
            <MessagesAttachments
              attachments={attachments}
              handleRemoveAttachment={handleRemoveAttachment}
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
    </div>
  );
};

export default NewMessagePatient;
