import axios from "axios";
import { uniqueId } from "lodash";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useClinicContext from "../../../../hooks/context/useClinicContext";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessageExternalPost } from "../../../../hooks/reactquery/mutations/messagesMutations";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../utils/names/toPatientName";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessagesAttachments from "../Internal/MessagesAttachments";
import MessageExternal from "./MessageExternal";
import MessagesExternalTemplates from "./MessagesExternalTemplates";

axios.defaults.withCredentials = true;

const ReplyMessageExternal = ({
  setReplyVisible,
  message,
  previousMsgs,
  setCurrentMsgId,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { clinic } = useClinicContext();
  const [body, setBody] = useState("");
  const [important, setImportant] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const textareaRef = useRef(null);
  const messagePost = useMessageExternalPost();

  const handleSelectTemplate = (e, template) => {
    setBody((b) =>
      b ? b + "\n\n" + template.body + "\n" : template.body + "\n"
    );
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(
      textareaRef.current.value.length,
      textareaRef.current.value.length
    );
  };

  const handleCancel = () => {
    setReplyVisible(false);
  };
  const handleSend = async () => {
    setProgress(true);
    let attach_ids;
    if (attachments.length > 0) {
      const response = await xanoPost("/messages_attachments", "staff", {
        attachments_array: attachments,
      });
      attach_ids = [
        ...message.attachments_ids.map(({ attachment }) => attachment.id),
        ...response,
      ];
    } else {
      attach_ids = [
        ...message.attachments_ids.map(({ attachment }) => attachment.id),
      ];
    }

    const messageToPost = {
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
    socket.emit("message", {
      route: "UNREAD EXTERNAL",
      action: "update",
      content: {
        userId: message.from_patient_id,
      },
    });

    //EMAIL ALERT
    try {
      await axios.post(`/api/mailgun`, {
        to_email: message.from_patient_infos.Email, //to be changed to patient email
        subject: `${clinic.name} - New message - DO NO REPLY`,
        text: `
Hello ${toPatientName(message.from_patient_infos)},

You have a new message, please login to your patient portal.

Please do not reply to this email, as this address is automated and not monitored. 

Best wishes, 
Powered by CalvinEMR`,
      });
    } catch (err) {
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
          from: clinic.name,
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

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleImportanceChange = (e) => {
    const value = e.target.checked;
    setImportant(value);
  };

  const handleAttach = (e) => {
    let input = e.nativeEvent.view.document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpeg, .jpg, .png, .gif, .tif, .pdf, .svg";
    // ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx";
    input.onchange = (e) => {
      // getting a hold of the file reference
      let file = e.target.files[0];
      if (file.size > 25000000) {
        toast.error(
          "The file is over 25Mb, please choose another one or send a link",
          { containerId: "A" }
        );
        return;
      }
      setIsLoadingFile(true);
      // setting up the reader`
      let reader = new FileReader();
      reader.readAsDataURL(file);
      // here we tell the reader what to do when it's done reading...
      reader.onload = async (e) => {
        let content = e.target.result; // this is the content!
        try {
          const response = await xanoPost(
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
          toast.error(`Error: unable to load file: ${err.message}`, {
            containerId: "A",
          });
          setIsLoadingFile(false);
        }
      };
    };
    input.click();
  };

  const handleRemoveAttachment = (fileName) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file.name !== fileName
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
        <strong>Attach files</strong>
        <i className="fa-solid fa-paperclip" onClick={handleAttach}></i>
        {attachments.map((attachment) => (
          <span key={attachment.file.name} style={{ marginLeft: "5px" }}>
            {attachment.alias},
          </span>
        ))}
      </div>
      <div className="reply-message__importance">
        <div className="reply-message__importance-check">
          <input
            type="checkbox"
            name="high_importance"
            id="importance"
            style={{ marginRight: "5px" }}
            onChange={handleImportanceChange}
            checked={important}
          />
          <label htmlFor="importance">High importance</label>
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
