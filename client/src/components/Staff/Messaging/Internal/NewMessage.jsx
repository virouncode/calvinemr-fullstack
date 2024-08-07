import { uniqueId } from "lodash";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessagePost } from "../../../../hooks/reactquery/mutations/messagesMutations";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import AttachFilesButton from "../../../UI/Buttons/AttachFilesButton";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import Input from "../../../UI/Inputs/Input";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import Patients from "../Patients";
import StaffContacts from "../StaffContacts";
import MessagesAttachments from "./MessagesAttachments";
import MessagesTemplates from "./MessagesTemplates";

const NewMessage = ({
  setNewVisible,
  initialPatient = { id: 0, name: "" },
  initialAttachments = [],
  initialBody = null,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [attachments, setAttachments] = useState(initialAttachments);
  const [recipientsIds, setRecipientsIds] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(initialBody || "");
  const [important, setImportant] = useState(false);
  const [patient, setPatient] = useState(initialPatient);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const textareaRef = useRef(null);
  const messagePost = useMessagePost(user.id, "Received messages");

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const isPatientChecked = (id) => {
    return patient.id === id ? true : false;
  };

  const handleSelectTemplate = (e, template) => {
    if (template.to_staff_ids.length) setRecipientsIds(template.to_staff_ids);
    if (template.subject) setSubject(template.subject);
    setBody((b) =>
      b ? b + "\n\n" + template.body + "\n" : template.body + "\n"
    );
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(
      textareaRef.current.value.length,
      textareaRef.current.value.length
    );
  };

  const handleCheckPatient = (e) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    const name = e.target.name;
    if (checked) {
      setPatient({ id, name });
    } else {
      setPatient({ id: 0, name: "" });
    }
  };

  const handleImportanceChange = (e) => {
    const value = e.target.checked;
    setImportant(value);
  };

  const handleCancel = () => {
    setNewVisible(false);
  };

  const handleRemoveAttachment = (fileName) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  const handleSend = async () => {
    if (!recipientsIds.length) {
      toast.error("Please choose at least one recipient", { containerId: "A" });
      return;
    }
    setProgress(true);
    let attach_ids = [];
    if (attachments.length > 0) {
      attach_ids = await xanoPost("/messages_attachments", "staff", {
        attachments_array: attachments,
      });
    }
    const messageToPost = {
      from_id: user.id,
      to_staff_ids: recipientsIds,
      subject: subject,
      body: body,
      attachments_ids: attach_ids,
      related_patient_id: patient.id,
      read_by_staff_ids: [user.id],
      date_created: nowTZTimestamp(),
      high_importance: important,
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
    for (const to_staff_id of messageToPost.to_staff_ids) {
      if (to_staff_id !== user.id) {
        socket.emit("message", {
          route: "UNREAD",
          action: "update",
          content: {
            userId: to_staff_id,
          },
        });
      }
    }
  };

  const handleAttach = (e) => {
    let input = e.nativeEvent.view.document.createElement("input");
    input.type = "file";
    input.accept = ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg";
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
          const response = await xanoPost("/upload/attachment", "staff", {
            content,
          });
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
    <div className="new-message">
      <div className="new-message__contacts">
        <StaffContacts
          recipientsIds={recipientsIds}
          setRecipientsIds={setRecipientsIds}
        />
      </div>
      <div className="new-message__form">
        <div className="new-message__recipients">
          <Input
            label="To:"
            id="to"
            placeholder="Recipient(s)"
            value={staffInfos
              .filter(({ id }) => recipientsIds.includes(id))
              .map((staff) => staffIdToTitleAndName(staffInfos, staff.id))
              .join(" / ")}
            readOnly={true}
          />
        </div>
        <div className="new-message__subject">
          <Input
            value={subject}
            onChange={handleChangeSubject}
            id="subject"
            label="Subject:"
            placeholder="Subject"
          />
        </div>
        <div className="new-message__patient">
          <Input
            id="patient"
            label="About patient:"
            placeholder="Patient"
            value={patient.name}
            readOnly
          />
        </div>
        <div className="new-message__attach">
          <AttachFilesButton onClick={handleAttach} attachments={attachments} />
        </div>
        <div className="new-message__importance">
          <div className="new-message__importance-check">
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
        <div className="new-message__body">
          <textarea
            value={body}
            onChange={handleChange}
            autoFocus
            ref={textareaRef}
          />
          <MessagesAttachments
            attachments={attachments}
            handleRemoveAttachment={handleRemoveAttachment}
            deletable={true}
            addable={false}
          />
        </div>
        <div className="new-message__btns">
          <SaveButton
            onClick={handleSend}
            disabled={isLoadingFile || progress}
            label="Send"
          />
          <CancelButton onClick={handleCancel} disabled={progress} />
          {isLoadingFile && <CircularProgressMedium />}
        </div>
      </div>
      <div className="new-message__patients">
        <Patients
          handleCheckPatient={handleCheckPatient}
          isPatientChecked={isPatientChecked}
          msgType="Internal"
        />
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

export default NewMessage;
