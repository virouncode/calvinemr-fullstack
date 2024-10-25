import axios from "axios";
import { uniqueId } from "lodash";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { xanoDelete } from "../../../../api/xanoCRUD/xanoDelete";
import { xanoPost } from "../../../../api/xanoCRUD/xanoPost";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessagePut } from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  AttachmentType,
  DemographicsType,
  MessageAttachmentType,
  TodoTemplateType,
  TodoType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
} from "../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../utils/names/toPatientName";
import AttachFilesButton from "../../../UI/Buttons/AttachFilesButton";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import Input from "../../../UI/Inputs/Input";
import InputDate from "../../../UI/Inputs/InputDate";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import Patients from "../Patients";
import MessagesAttachments from "./MessagesAttachments";
import TodosTemplates from "./Templates/TodosTemplates";

type EditTodoProps = {
  setEditTodoVisible: React.Dispatch<React.SetStateAction<boolean>>;
  todo: TodoType;
};

const EditTodo = ({ setEditTodoVisible, todo }: EditTodoProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const todoAttachments = (
    todo.attachments_ids as { attachment: MessageAttachmentType }[]
  ).map(({ attachment }) => attachment);
  const [attachments, setAttachments] =
    useState<MessageAttachmentType[]>(todoAttachments);
  const [attachmentsToRemoveIds, setAttachmentsToRemoveIds] = useState<
    number[]
  >([]);
  const [attachmentsToAdd, setAttachmentsToAdd] = useState<
    MessageAttachmentType[]
  >([]);
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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  //Queries
  const messagePut = useMessagePut(user.id, "To-dos");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleChangeDueDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDueDate(value);
  };

  const isPatientChecked = (id: number) => patient.id === id;

  const handleSelectTemplate = (template: TodoTemplateType) => {
    if (template.subject) setSubject(template.subject);
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

  const handleCheckPatient = (
    e: React.ChangeEvent<HTMLInputElement>,
    info: DemographicsType
  ) => {
    const checked = e.target.checked;
    if (checked) {
      setPatient({ id: info.patient_id, name: toPatientName(info) });
    } else {
      setPatient({ id: 0, name: "" });
    }
  };

  const handleCancel = () => {
    setEditTodoVisible(false);
  };

  const handleImportanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setImportant(value);
  };

  const handleRemoveAttachment = (fileName: string) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file?.name !== fileName
    );
    setAttachments(updatedAttachments);
    if (todoAttachments.find(({ file }) => file?.name === fileName)) {
      setAttachmentsToRemoveIds([
        ...attachmentsToRemoveIds,
        todoAttachments.find(({ file }) => file?.name === fileName)
          ?.id as number,
      ]);
    }
  };

  const handleSave = async () => {
    setProgress(true);
    //Remove deleted attachments
    if (attachmentsToRemoveIds.length) {
      for (const id of attachmentsToRemoveIds) {
        await xanoDelete(`/messages_attachments/${id}`, "staff");
      }
    }
    let attachmentsToAddIds: number[] = [];
    if (attachmentsToAdd.length > 0) {
      attachmentsToAddIds = await xanoPost("/messages_attachments", "staff", {
        attachments_array: attachmentsToAdd,
      });
    }
    //create the message
    const messageToPut: TodoType = {
      ...todo,
      subject: subject,
      body: body,
      attachments_ids: [
        ...attachmentsToAddIds,
        ...todoAttachments
          .map(({ id }) => id as number)
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
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  const handleAttach = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpeg, .jpg, .png, .pdf";

    input.onchange = async (event) => {
      // getting a hold of the file reference
      const e = event as unknown as React.ChangeEvent<HTMLInputElement>;
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 128000000) {
        toast.error(
          "The file is over 128Mb, please choose another file or send a link",
          { containerId: "A" }
        );
        return;
      }
      setIsLoadingFile(true);
      const formData = new FormData();
      formData.append("content", file);
      try {
        const response = await axios.post(
          import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const fileToUpload: AttachmentType = response.data;
        setAttachments([
          ...attachments,
          {
            file: fileToUpload,
            alias: file.name,
            date_created: nowTZTimestamp(),
            created_by_id: user.id,
            created_by_user_type: "staff",
            id: uniqueId("messages_todo_attachment_"),
          },
        ]); //meta, mime, name, path, size, type
        setAttachmentsToAdd([
          ...attachmentsToAdd,
          {
            file: fileToUpload,
            alias: file.name,
            date_created: nowTZTimestamp(),
            created_by_id: user.id,
            created_by_user_type: "staff",
            id: uniqueId("messages_todo_attachment_"),
          },
        ]);
        setIsLoadingFile(false);
      } catch (err) {
        if (err instanceof Error)
          toast.error(`Error: unable to load file: ${err.message}`, {
            containerId: "A",
          });
        setIsLoadingFile(false);
      }
    };
    input.click();
  };

  return (
    <div className="new-message new-message--external">
      <div className="new-message__form">
        <div className="new-message__form-subject">
          <Input
            value={subject}
            id="subject"
            onChange={handleChangeSubject}
            label="Subject:"
            placeholder="Subject"
          />
        </div>
        <div className="new-message__form-patient">
          <Input
            value={patient.name}
            id="patient"
            label="About patient:"
            placeholder="Patient"
            readOnly={true}
          />
        </div>
        <div className="new-message__form-attach">
          <AttachFilesButton onClick={handleAttach} attachments={attachments} />
        </div>
        <div className="new-message__form-duedate">
          <InputDate
            value={dueDate}
            onChange={handleChangeDueDate}
            id="due-date"
            label="Due date:"
          />
        </div>
        <div className="new-message__form-importance">
          <div className="new-message__form-importance-check">
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
        <div className="new-message__form-body">
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
        <div className="new-message__form-btns">
          <SaveButton
            onClick={handleSave}
            disabled={isLoadingFile || progress}
          />
          <CancelButton onClick={handleCancel} disabled={progress} />
          {isLoadingFile && <CircularProgressMedium />}
        </div>
      </div>
      <div className={"new-message__patients"}>
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
          color="#8fb4fb"
          setPopUpVisible={setTemplatesVisible}
        >
          <TodosTemplates handleSelectTemplate={handleSelectTemplate} />
        </FakeWindow>
      )}
    </div>
  );
};

export default EditTodo;
