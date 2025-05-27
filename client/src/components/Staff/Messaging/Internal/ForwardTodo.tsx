import axios from "axios";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import useClinicContext from "../../../../hooks/context/useClinicContext";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  useMessagesPostBatch,
  useTodoDelete,
} from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  MessageAttachmentType,
  TodoTemplateType,
  TodoType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../utils/dates/formatDates";
import { toEmailAlertStaffText } from "../../../../utils/messages/toEmailAlertStaffText";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import { confirmAlert } from "../../../UI/Confirm/ConfirmGlobal";
import Input from "../../../UI/Inputs/Input";
import InputDate from "../../../UI/Inputs/InputDate";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import StaffContacts from "../StaffContacts";
import MessagesAttachments from "./MessagesAttachments";
import TodosTemplates from "./Templates/TodosTemplates";

type ForwardTodoProps = {
  setForwardTodoVisible: React.Dispatch<React.SetStateAction<boolean>>;
  todo: TodoType;
  patientName: string;
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  section: string;
};

const ForwardTodo = ({
  setForwardTodoVisible,
  todo,
  patientName,
  setCurrentMsgId,
  section,
}: ForwardTodoProps) => {
  //Hooks
  const { clinic } = useClinicContext();
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [recipientsIds, setRecipientsIds] = useState<number[]>([]);
  const [body, setBody] = useState(todo.body);
  const [important, setImportant] = useState(todo.high_importance);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [dueDate, setDueDate] = useState(timestampToDateISOTZ(todo.due_date));
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  //Queries
  const todosPost = useMessagesPostBatch(user.id, section);
  const todoDelete = useTodoDelete(user.id);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleSelectTemplate = (template: TodoTemplateType) => {
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

  const handleChangeDueDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDueDate(value);
  };

  const handleCancel = () => {
    setForwardTodoVisible(false);
  };

  const handleImportanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setImportant(value);
  };

  const handleSend = async () => {
    if (!recipientsIds.length) {
      toast.error("Please choose at least one recipient", { containerId: "A" });
      return;
    }
    try {
      setProgress(true);
      const todosToPost: Partial<TodoType>[] = [];
      const emailsToPost: { to: string; subject: string; text: string }[] = [];
      const senderName = staffIdToTitleAndName(staffInfos, user.id);
      for (const recipientId of recipientsIds) {
        const todoToPost: Partial<TodoType> = {
          from_staff_id: user.id,
          to_staff_id: recipientId,
          subject: `Fwd: ${todo.subject}`,
          body: body,
          related_patient_id: todo.related_patient_id || 0,
          attachments_ids: (
            todo.attachments_ids as { attachment: MessageAttachmentType }[]
          ).map(({ attachment }) => attachment.id as number),
          date_created: nowTZTimestamp(),
          done: todo.done,
          due_date: dueDate ? dateISOToTimestampTZ(dueDate) : null,
          read: recipientId === user.id,
          high_importance: todo.high_importance,
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
            setForwardTodoVisible(false);
            toast.success("Forwarded successfully", { containerId: "A" });
          }
        },
      });
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to forward to-do: ${err.message}`, {
          containerId: "A",
        });
    } finally {
      setProgress(false);
    }
    if (
      await confirmAlert({
        content: "Remove this to-do from your account ?",
        no: "No",
      })
    ) {
      setProgress(true);
      todoDelete.mutate(todo.id, {
        onSuccess: () => {
          setCurrentMsgId(0);
          if (todo.related_patient_id) {
            socket?.emit("message", {
              key: ["patientRecord", todo.related_patient_id],
            });
          }
          setProgress(false);
        },
        onError: () => {
          setProgress(false);
        },
      });
    }
  };

  return (
    <div className="forward-message">
      <div className="forward-message__contacts">
        <StaffContacts
          recipientsIds={recipientsIds}
          setRecipientsIds={setRecipientsIds}
        />
      </div>
      <div className="forward-message__form">
        <div className="forward-message__form-recipients">
          <Input
            label="To:"
            id="to"
            placeholder="Recipients"
            value={staffInfos
              .filter(({ id }) => recipientsIds.includes(id))
              .map((staff) => staffIdToTitleAndName(staffInfos, staff.id))
              .join(" / ")}
            readOnly={true}
          />
        </div>
        <div className="forward-message__form-subject">
          <strong>Subject:</strong>
          {`\u00A0Fwd: ${todo.subject}`}
        </div>
        {patientName && (
          <div className="forward-message__form-patient">
            <strong>About patient:{"\u00A0"}</strong>
            {patientName}
          </div>
        )}
        <div className="forward-message__form-duedate">
          <InputDate
            value={dueDate}
            onChange={handleChangeDueDate}
            id="due-date"
            label="Due date"
          />
        </div>
        <div className="forward-message__form-importance">
          <div className="forward-message__form-importance-check">
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
        <div className="forward-message__form-body">
          <textarea
            value={body}
            onChange={handleChange}
            ref={textareaRef}
            autoFocus
          />
          <MessagesAttachments
            attachments={(
              todo.attachments_ids as { attachment: MessageAttachmentType }[]
            ).map(({ attachment }) => attachment)}
            deletable={false}
            cardWidth="30%"
            addable={false}
          />
        </div>
        <div className="forward-message__form-btns">
          <SaveButton onClick={handleSend} disabled={progress} label="Send" />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
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

export default ForwardTodo;
