import { useRef, useState } from "react";
import { toast } from "react-toastify";

import xanoDelete from "../../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessagePut } from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
} from "../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../utils/names/toPatientName";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import Patients from "../Patients";
import MessagesAttachments from "./MessagesAttachments";
import TodosTemplates from "./TodosTemplates";

const EditTodo = ({ setEditTodoVisible, todo }) => {
  const { user } = useUserContext();
  const todoAttachments = todo.attachments_ids.map(
    ({ attachment }) => attachment
  );
  const [attachments, setAttachments] = useState(todoAttachments);

  const [attachmentsToRemoveIds, setAttachmentsToRemoveIds] = useState([]);
  const [attachmentsToAdd, setAttachmentsToAdd] = useState([]);
  const [subject, setSubject] = useState(todo.subject);
  const [body, setBody] = useState(todo.body);
  const [important, setImportant] = useState(todo.high_importance);
  const [patient, setPatient] = useState({
    id: todo.related_patient_id,
    name: toPatientName(todo.patient_infos),
  });
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const textareaRef = useRef(null);
  const messagePut = useMessagePut(user.id, "To-dos");

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const handleChangeDueDate = (e) => {
    const value = e.target.value;
    setDueDate(value);
  };

  const isPatientChecked = (id) => patient.id === id;

  const handleSelectTemplate = (e, template) => {
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

  const handleCancel = () => {
    setEditTodoVisible(false);
  };

  const handleImportanceChange = (e) => {
    const value = e.target.checked;
    setImportant(value);
  };

  const handleRemoveAttachment = (fileName) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file.name !== fileName
    );
    setAttachments(updatedAttachments);
    if (todoAttachments.find(({ file }) => file.name === fileName)) {
      setAttachmentsToRemoveIds([
        ...attachmentsToRemoveIds,
        todoAttachments.find(({ file }) => file.name === fileName).id,
      ]);
    }
  };

  const handleSave = async () => {
    setProgress(true);
    //Remove deleted attachments
    if (attachmentsToRemoveIds.length) {
      for (let id of attachmentsToRemoveIds) {
        await xanoDelete(`/messages_attachments/${id}`, "staff");
      }
    }
    let attachmentsToAddIds = [];
    if (attachmentsToAdd.length > 0) {
      attachmentsToAddIds = await xanoPost("/messages_attachments", "staff", {
        attachments_array: attachmentsToAdd,
      });
    }
    //create the message
    const messageToPut = {
      from_staff_id: todo.from_staff_id,
      to_staff_id: todo.to_staff_id,
      subject: subject,
      body: body,
      attachments_ids: [
        ...attachmentsToAddIds,
        ...todoAttachments
          .map(({ id }) => id)
          .filter((item) => !attachmentsToRemoveIds.includes(item)),
      ],
      related_patient_id: patient.id,
      done: false,
      date_created: nowTZTimestamp(),
      high_importance: important,
      due_date: dueDate ? dateISOToTimestampTZ(dueDate) : null,
      read: true,
    };

    messagePut.mutate(messageToPut, {
      onSuccess: () => {
        setEditTodoVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
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
            },
          ]); //meta, mime, name, path, size, type
          setAttachmentsToAdd([
            ...attachmentsToAdd,
            {
              file: response,
              alias: file.name,
              date_created: nowTZTimestamp(),
              created_by_id: user.id,
              created_by_user_type: "staff",
            },
          ]);
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
      <div className="new-message__form">
        <div className="new-message__subject">
          <strong>Subject: </strong>
          <input
            type="text"
            placeholder="Subject"
            onChange={handleChangeSubject}
            value={subject}
          />
        </div>
        <div className="new-message__patient">
          <strong>About patient: </strong>
          <input
            type="text"
            placeholder="Patient"
            value={patient.name}
            readOnly
          />
        </div>
        <div className="new-message__attach">
          <strong>Attach files</strong>
          <i
            className="fa-solid fa-paperclip"
            onClick={handleAttach}
            disabled={progress || isLoadingFile}
          />
          {attachments.map((attachment) => (
            <span key={attachment.file.name} style={{ marginLeft: "5px" }}>
              {attachment.alias},
            </span>
          ))}
        </div>
        <div className="new-message__duedate">
          <label htmlFor="due-date">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={handleChangeDueDate}
            id="due-date"
          />
        </div>
        <div className="new-message__importance">
          <div className="new-message__importance-check">
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
        <div className="new-message__body">
          <textarea
            value={body}
            onChange={handleChange}
            ref={textareaRef}
            autoFocus
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
            onClick={handleSave}
            disabled={isLoadingFile || progress}
          />
          <CancelButton onClick={handleCancel} disabled={progress} />
          {isLoadingFile && <CircularProgressMedium />}
        </div>
      </div>
      <div className={"new-message__patients new-message__patients--todo"}>
        <Patients
          handleCheckPatient={handleCheckPatient}
          isPatientChecked={isPatientChecked}
          msgType="Internal"
        />
      </div>

      {templatesVisible && (
        <FakeWindow
          title={`CHOOSE TO-DO TEMPLATE`}
          width={800}
          height={600}
          x={window.innerWidth - 800}
          y={0}
          color="#93b5e9"
          setPopUpVisible={setTemplatesVisible}
        >
          <TodosTemplates handleSelectTemplate={handleSelectTemplate} />
        </FakeWindow>
      )}
    </div>
  );
};

export default EditTodo;
