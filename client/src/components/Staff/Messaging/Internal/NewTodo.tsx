import axios from "axios";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../../api/xanoCRUD/xanoPost";
import useClinicContext from "../../../../hooks/context/useClinicContext";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessagesPostBatch } from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  DemographicsType,
  EdocType,
  MessageAttachmentType,
  PamphletType,
  TodoTemplateType,
  TodoType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
} from "../../../../utils/dates/formatDates";
import { handleUploadAttachment } from "../../../../utils/files/handleUploadAttachment";
import { titleToCategory } from "../../../../utils/messages/titleToCategory";
import { toEmailAlertStaffText } from "../../../../utils/messages/toEmailAlertStaffText";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import AttachEdocsPamphletsButton from "../../../UI/Buttons/AttachEdocsPamphletsButton";
import AttachFilesButton from "../../../UI/Buttons/AttachFilesButton";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import Input from "../../../UI/Inputs/Input";
import InputDate from "../../../UI/Inputs/InputDate";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import Patients from "../Patients";
import StaffContacts from "../StaffContacts";
import AddEdocsPamphlets from "./AddEdocsPamphlets";
import MessagesAttachments from "./MessagesAttachments";
import TodosTemplates from "./Templates/TodosTemplates";

type NewTodoProps = {
  setNewTodoVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initialPatient?: { id: number; name: string };
  initialAttachments?: MessageAttachmentType[];
  initialBody?: string;
};

const NewTodo = ({
  setNewTodoVisible,
  initialPatient = { id: 0, name: "" },
  initialAttachments = [],
  initialBody = "",
}: NewTodoProps) => {
  //Hooks
  const { clinic } = useClinicContext();
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [attachments, setAttachments] =
    useState<Partial<MessageAttachmentType>[]>(initialAttachments);
  const [edocs, setEdocs] = useState<EdocType[]>([]);
  const [pamphlets, setPamphlets] = useState<PamphletType[]>([]);
  const [recipientsIds, setRecipientsIds] = useState([user.id]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(initialBody);
  const [important, setImportant] = useState(false);
  const [patient, setPatient] = useState(initialPatient);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [addEdocsPamphletsVisible, setAddEdocsPamphletsVisible] =
    useState(false);
  const [dueDate, setDueDate] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  //Queries
  const todosPost = useMessagesPostBatch(user.id, "To-dos");

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

  const handleImportanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setImportant(value);
  };

  const handleCancel = () => {
    setNewTodoVisible(false);
  };

  const handleRemoveAttachment = (fileName: string) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file?.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  const handleSend = async () => {
    try {
      setProgress(true);
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
      let attach_ids = [];
      if (attachmentsToPost.length > 0) {
        attach_ids = await xanoPost("/messages_attachments", "staff", {
          attachments_array: attachmentsToPost,
        });
      }
      const todosToPost: Partial<TodoType>[] = [];
      const emailsToPost: { to: string; subject: string; text: string }[] = [];
      const senderName = staffIdToTitleAndName(staffInfos, user.id);
      for (const recipientId of recipientsIds) {
        //create the message
        const todoToPost: Partial<TodoType> = {
          from_staff_id: user.id,
          to_staff_id: recipientId,
          subject: subject,
          body: body,
          attachments_ids: attach_ids,
          related_patient_id: patient.id,
          done: false,
          date_created: nowTZTimestamp(),
          high_importance: important,
          due_date: dueDate ? dateISOToTimestampTZ(dueDate) : null,
          read: recipientId === user.id,
        };
        const staff = staffInfos.find(({ id }) => id === recipientId);
        const emailToPost = {
          to: staff?.email ?? "",
          subject: `${clinic?.name ?? ""} - New message - DO NOT REPLY`,
          text: toEmailAlertStaffText(
            staffIdToTitleAndName(staffInfos, recipientId),
            senderName,
            todoToPost.subject ?? "",
            todoToPost.body ?? ""
          ),
        };
        emailsToPost.push(emailToPost);
        todosToPost.push(todoToPost);
      }
      todosPost.mutate(todosToPost, {
        onSuccess: async () => {
          try {
            await Promise.all(
              emailsToPost.map((email) => axios.post(`/api/mailgun`, email))
            );
          } catch (err) {
            if (err instanceof Error) {
              toast.error(
                `Unable to send email alerts to recipients:${err.message}`,
                { containerId: "A" }
              );
            }
          } finally {
            setNewTodoVisible(false);
          }
        },
      });
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to save to-do: ${err.message}`, {
          containerId: "A",
        });
    } finally {
      setProgress(false);
    }
  };

  const handleAttach = () => {
    handleUploadAttachment(
      setIsLoadingFile,
      attachments,
      setAttachments,
      user,
      "todos_attachment_"
    );
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
    <div className="new-message">
      <div className="new-message__contacts">
        <StaffContacts
          recipientsIds={recipientsIds}
          setRecipientsIds={setRecipientsIds}
          unfoldedCategory={titleToCategory(
            staffInfos.find(({ id }) => id === user.id)?.title ?? ""
          )}
        />
      </div>
      <div className="new-message__form">
        <div className="new-message__form-recipients">
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
        <div className="new-message__form-subject">
          <Input
            value={subject}
            onChange={handleChangeSubject}
            id="subject"
            label="Subject:"
            placeholder="Subject"
          />
        </div>
        <div className="new-message__form-patient">
          <Input
            id="patient"
            label="About patient:"
            placeholder="Patient"
            value={patient.name}
            readOnly
          />
        </div>
        <div className="new-message__form-attach">
          <AttachFilesButton onClick={handleAttach} attachments={attachments} />
        </div>
        <div className="new-message__form-attach">
          <AttachEdocsPamphletsButton
            onClick={handleEdocsPamphlets}
            edocs={edocs}
            pamphlets={pamphlets}
          />
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
        <div className="new-message__form-btns">
          <SaveButton
            onClick={handleSend}
            disabled={isLoadingFile || progress}
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

export default NewTodo;
