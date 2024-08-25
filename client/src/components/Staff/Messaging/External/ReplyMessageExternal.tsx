import axios from "axios";
import { uniqueId } from "lodash";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useClinicContext from "../../../../hooks/context/useClinicContext";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessageExternalPost } from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  AttachmentType,
  MessageAttachmentType,
  MessageExternalTemplateType,
  MessageExternalType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../utils/names/toPatientName";
import AttachFilesButton from "../../../UI/Buttons/AttachFilesButton";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessagesAttachments from "../Internal/MessagesAttachments";
import MessageExternal from "./MessageExternal";
import MessagesExternalTemplates from "./Templates/MessagesExternalTemplates";

axios.defaults.withCredentials = true;

type ReplyMessageExternalProps = {
  setReplyVisible: React.Dispatch<React.SetStateAction<boolean>>;
  message: MessageExternalType;
  previousMsgs: MessageExternalType[];
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
};

const ReplyMessageExternal = ({
  setReplyVisible,
  message,
  previousMsgs,
  setCurrentMsgId,
}: ReplyMessageExternalProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { clinic } = useClinicContext();
  const [body, setBody] = useState("");
  const [important, setImportant] = useState(false);
  const [attachments, setAttachments] = useState<MessageAttachmentType[]>([]);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  //Queries
  const messagePost = useMessageExternalPost();

  const handleSelectTemplate = (template: MessageExternalTemplateType) => {
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

    const messageToPost: Partial<MessageExternalType> = {
      from_staff_id: user.id,
      to_patients_ids: [message.from_patient_id],
      subject: previousMsgs.length
        ? `Re: ${message.subject.slice(message.subject.indexOf(":") + 1)}`
        : `Re: ${message.subject}`,
      body: body,
      attachments_ids: attach_ids,
      read_by_staff_id: user.id,
      previous_messages_ids: [...previousMsgs.map(({ id }) => id), message.id],
      date_created: nowTZTimestamp(),
      type: "External",
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
    socket?.emit("message", {
      route: "UNREAD EXTERNAL",
      action: "update",
      content: {
        userId: message.from_patient_id,
      },
    });

    //EMAIL ALERT
    try {
      await axios.post(`/api/mailgun`, {
        to_email: message.from_patient_infos?.Email ?? "", //to be changed to patient email
        subject: `${clinic?.name ?? ""} - New message - DO NO REPLY`,
        text: `
Hello ${toPatientName(message.from_patient_infos)},

You have a new message, please login to your patient portal.

Please do not reply to this email, as this address is automated and not monitored. 

Best wishes, 
Powered by CalvinEMR`,
      });
    } catch (err) {
      if (err instanceof Error)
        toast.error(
          `Error: unable to send email alert to ${toPatientName(
            message.from_patient_infos
          )}: ${err.message}`,
          {
            containerId: "A",
          }
        );
    }
    try {
      await axios({
        url: `/api/twilio`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          from: clinic?.name ?? "",
          to: "+33683267962", //to be changed to patient cell_phone
          body: `
Hello ${toPatientName(message.from_patient_infos)},
          
You have a new message, please login to your patient portal.

Please do not reply to this sms, as this number is automated and not monitored. 
          
Best wishes,
Powered by Calvin EMR`,
        },
      });
      setProgress(false);
    } catch (err) {
      if (err instanceof Error)
        toast.error(
          `Error: unable to send SMS alert to ${toPatientName(
            message.from_patient_infos
          )}: ${err.message}`,
          {
            containerId: "A",
          }
        );
      setProgress(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleImportanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setImportant(value);
  };

  const handleAttach = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const input = e.nativeEvent.view?.document.createElement(
      "input"
    ) as HTMLInputElement;
    input.type = "file";
    input.accept = ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg";
    // ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx";
    input.onchange = (event) => {
      // getting a hold of the file reference
      const e = event as unknown as React.ChangeEvent<HTMLInputElement>;
      const file = e.target.files?.[0];
      if (file) {
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
                id: uniqueId("messages_external_attachment_"),
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
      }
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
          {toPatientName(message.from_patient_infos)}
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
        <AttachFilesButton onClick={handleAttach} attachments={attachments} />
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
          import MessagesExternalTemplates from
          './Templates/MessagesExternalTemplates';
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
          ref={textareaRef}
          autoFocus
        />
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
          <MessagesExternalTemplates
            handleSelectTemplate={handleSelectTemplate}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default ReplyMessageExternal;
