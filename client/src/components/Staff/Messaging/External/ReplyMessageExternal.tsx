import axios from "axios";
import { uniqueId } from "lodash";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../../api/xanoCRUD/xanoPost";
import useClinicContext from "../../../../hooks/context/useClinicContext";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessageExternalPost } from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  AttachmentType,
  EdocType,
  MessageAttachmentType,
  MessageExternalTemplateType,
  MessageExternalType,
  PamphletType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../utils/names/toPatientName";
import { formatToE164Canadian } from "../../../../utils/phone/formatToE164Canadian";
import AttachEdocsPamphletsButton from "../../../UI/Buttons/AttachEdocsPamphletsButton";
import AttachFilesButton from "../../../UI/Buttons/AttachFilesButton";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import Input from "../../../UI/Inputs/Input";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import AddEdocsPamphlets from "../Internal/AddEdocsPamphlets";
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
  const [edocs, setEdocs] = useState<EdocType[]>([]);
  const [pamphlets, setPamphlets] = useState<PamphletType[]>([]);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [addEdocsPamphletsVisible, setAddEdocsPamphletsVisible] =
    useState(false);
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
    const patientPhone = formatToE164Canadian(
      message.from_patient_infos?.PhoneNumber.find(
        (phone) => phone._phoneNumberType === "C"
      )?.phoneNumber ?? ""
    );
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
      },
      onSettled: () => {
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
        subject: `${clinic?.name ?? ""} - New message - DO NOT REPLY`,
        text: `Hello ${toPatientName(message.from_patient_infos)},

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
          to: patientPhone, //to be changed to patient cell_phone
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

  const handleAttach = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpeg, .jpg, .png, .pdf";
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
    <div className="reply-message">
      <div className="reply-message__recipients">
        <Input
          label="To:"
          id="to"
          placeholder="Recipient(s)"
          value={toPatientName(message.from_patient_infos)}
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
      <div className="reply-message__attach">
        <AttachEdocsPamphletsButton
          onClick={handleEdocsPamphlets}
          edocs={edocs}
          pamphlets={pamphlets}
        />
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
          color="#8fb4fb"
          setPopUpVisible={setTemplatesVisible}
        >
          <MessagesExternalTemplates
            handleSelectTemplate={handleSelectTemplate}
          />
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

export default ReplyMessageExternal;
