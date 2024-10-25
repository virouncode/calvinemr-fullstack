import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../../api/xanoCRUD/xanoPost";
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

type NewTodoMobileProps = {
  setNewTodoVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initialPatient?: { id: number; name: string };
  initialAttachments?: MessageAttachmentType[];
  initialBody?: string;
};

const NewTodoMobile = ({
  setNewTodoVisible,
  initialPatient = { id: 0, name: "" },
  initialAttachments = [],
  initialBody = "",
}: NewTodoMobileProps) => {
  //Hooks
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
  const [dueDate, setDueDate] = useState("");
  const [addEdocsPamphletsVisible, setAddEdocsPamphletsVisible] =
    useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recipientsRef = useRef<HTMLDivElement | null>(null);
  const patientsRef = useRef<HTMLDivElement | null>(null);
  //Queries
  const messagesPost = useMessagesPostBatch(user.id, "To-dos");

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

  const handleSave = async () => {
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
      const messagesToPost: Partial<TodoType>[] = [];
      for (const recipientId of recipientsIds) {
        //create the message
        const messageToPost: Partial<TodoType> = {
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
        messagesToPost.push(messageToPost);
      }
      messagesPost.mutate(messagesToPost, {
        onSuccess: () => setNewTodoVisible(false),
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
      "todo_attachment_"
    );
  };

  const handleClickRecipients = () => {
    if (recipientsRef.current) {
      recipientsRef.current.style.transform = "translateX(0)";
    }
  };
  const handleClickPatient = () => {
    if (patientsRef.current) {
      patientsRef.current.style.transform = "translateX(0)";
    }
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
    <div className="new-message-mobile">
      <div className="new-message-mobile__contacts" ref={recipientsRef}>
        <StaffContacts
          recipientsIds={recipientsIds}
          setRecipientsIds={setRecipientsIds}
          unfoldedCategory={titleToCategory(
            staffInfos.find(({ id }) => id === user.id)?.title ?? ""
          )}
          closeCross={true}
          recipientsRef={recipientsRef}
        />
      </div>
      <div className="new-message-mobile__form">
        <div
          className="new-message__form-recipients"
          onClick={handleClickRecipients}
        >
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
        <div className="new-message__form-patient" onClick={handleClickPatient}>
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
          <textarea value={body} onChange={handleChange} ref={textareaRef} />
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
            onClick={handleSave}
            disabled={isLoadingFile || progress}
          />
          <CancelButton onClick={handleCancel} disabled={progress} />
          {isLoadingFile && <CircularProgressMedium />}
        </div>
      </div>
      <div className="new-message-mobile__patients" ref={patientsRef}>
        <Patients
          handleCheckPatient={handleCheckPatient}
          isPatientChecked={isPatientChecked}
          msgType="Internal"
          closeCross={true}
          patientsRef={patientsRef}
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

export default NewTodoMobile;
