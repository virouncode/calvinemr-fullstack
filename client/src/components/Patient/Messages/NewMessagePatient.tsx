import { uniqueId } from "lodash";
import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
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
  const [attachments, setAttachments] = useState<MessageAttachmentType[]>([]);
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
        setProgress(false);
        setNewVisible(false);
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

  return (
    <div className="new-message new-message--patient">
      <div className="new-message__contacts new-message__contacts--patient">
        <PatientStaffContacts
          isContactChecked={isContactChecked}
          handleCheckContact={handleCheckContact}
        />
      </div>
      <div className="new-message__form new-message__form--patient">
        <div className="new-message__recipients new-message__recipients--patient">
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
        <div className="new-message__subject new-message__subject--patient">
          <Input
            value={subject}
            id="subject"
            onChange={handleChangeSubject}
            label="Subject:"
            placeholder="Subject"
          />
        </div>
        <div className="new-message__attach new-message__attach--patient">
          <AttachFilesButton onClick={handleAttach} attachments={attachments} />
        </div>
        <div className="new-message__body new-message__body--patient">
          <textarea value={body} onChange={handleChange} autoFocus />
          <MessagesAttachments
            attachments={attachments}
            handleRemoveAttachment={handleRemoveAttachment}
            deletable={true}
            addable={false}
          />
        </div>
        <div className="new-message__btns new-message__btns--patient">
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
