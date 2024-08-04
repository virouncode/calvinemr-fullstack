import { useRef, useState } from "react";
import { toast } from "react-toastify";

import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  useMessagePost,
  useTodoDelete,
} from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../utils/dates/formatDates";
import { categoryToTitle } from "../../../../utils/names/categoryToTitle";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import StaffContacts from "../StaffContacts";
import MessagesAttachments from "./MessagesAttachments";
import TodosTemplates from "./TodosTemplates";

const ForwardTodo = ({
  setForwardTodoVisible,
  todo,
  patientName,
  setCurrentMsgId,
  section,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [recipientsIds, setRecipientsIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [body, setBody] = useState(todo.body);
  const [important, setImportant] = useState(todo.high_importance);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [dueDate, setDueDate] = useState(
    timestampToDateISOTZ(todo.due_date) || ""
  );
  const textareaRef = useRef(null);
  const messagePost = useMessagePost(user.id, section);
  const todoDelete = useTodoDelete(user.id);

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const isContactChecked = (id) => recipientsIds.includes(id);
  const isCategoryChecked = (category) => categories.includes(category);

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
  const handleCheckContact = (e) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    const category = e.target.name;
    const categoryContactsIds = staffInfos
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);

    if (checked) {
      let recipientsIdsUpdated = [...recipientsIds, id];
      setRecipientsIds(recipientsIdsUpdated);
      if (
        categoryContactsIds.every((id) => recipientsIdsUpdated.includes(id))
      ) {
        setCategories([...categories, category]);
      }
    } else {
      let recipientsIdsUpdated = [...recipientsIds];
      recipientsIdsUpdated = recipientsIdsUpdated.filter(
        (recipientId) => recipientId !== id
      );
      setRecipientsIds(recipientsIdsUpdated);
      if (categories.includes(category)) {
        let categoriesUpdated = [...categories];
        categoriesUpdated = categoriesUpdated.filter(
          (categoryName) => categoryName !== category
        );
        setCategories(categoriesUpdated);
      }
    }
  };

  const handleCheckCategory = (e) => {
    const category = e.target.id;
    const checked = e.target.checked;
    const categoryContactsIds = staffInfos
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);

    if (checked) {
      setCategories([...categories, category]);
      //All contacts of category

      let recipientsIdsUpdated = [...recipientsIds];
      categoryContactsIds.forEach((id) => {
        if (!recipientsIdsUpdated.includes(id)) {
          recipientsIdsUpdated.push(id);
        }
      });
      setRecipientsIds(recipientsIdsUpdated);
    } else {
      let categoriesUpdated = [...categories];
      categoriesUpdated = categoriesUpdated.filter((name) => name !== category);
      setCategories(categoriesUpdated);

      let recipientsIdsUpdated = [...recipientsIds];
      recipientsIdsUpdated = recipientsIdsUpdated.filter(
        (id) => !categoryContactsIds.includes(id)
      );
      setRecipientsIds(recipientsIdsUpdated);
    }
  };

  const handleChangeDueDate = (e) => {
    const value = e.target.value;
    setDueDate(value);
  };

  const handleCancel = () => {
    setForwardTodoVisible(false);
  };

  const handleImportanceChange = (e) => {
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
      for (let recipientId of recipientsIds) {
        const todoToPost = {
          from_staff_id: user.id,
          to_staff_id: recipientId,
          subject: `Fwd: ${todo.subject}`,
          body: body,
          related_patient_id: todo.related_patient_id || 0,
          attachments_ids: todo.attachments_ids.map(
            ({ attachment }) => attachment.id
          ),
          date_created: nowTZTimestamp(),
          done: todo.done,
          due_date: dueDate ? dateISOToTimestampTZ(dueDate) : null,
          read: recipientId === user.id,
          high_importance: todo.high_importance,
        };
        messagePost.mutate(todoToPost);
        if (recipientId !== user.id) {
          socket.emit("message", {
            route: "UNREAD TO-DO",
            action: "update",
            content: {
              userId: recipientId,
            },
          });
        }
      }
      setForwardTodoVisible(false);
      toast.success("Forwarded successfully", { containerId: "A" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error: unable to forward message: ${err.message}`, {
        containerId: "A",
      });
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
          staffInfos={staffInfos}
          handleCheckContact={handleCheckContact}
          isContactChecked={isContactChecked}
          handleCheckCategory={handleCheckCategory}
          isCategoryChecked={isCategoryChecked}
        />
      </div>
      <div className="forward-message__form">
        <div className="forward-message__recipients">
          <strong>To: </strong>
          <input
            type="text"
            placeholder="Recipients"
            value={staffInfos
              .filter(({ id }) => recipientsIds.includes(id))
              .map((staff) => staffIdToTitleAndName(staffInfos, staff.id))
              .join(" / ")}
            readOnly
          />
        </div>
        <div className="forward-message__subject">
          <strong>Subject:</strong>
          {`\u00A0Fwd: ${todo.subject}`}
        </div>
        {patientName && (
          <div className="forward-message__patient">
            <strong>About patient: {"\u00A0"}</strong> {patientName}
          </div>
        )}
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
        <div className="forward-message__body">
          <textarea
            value={body}
            onChange={handleChange}
            ref={textareaRef}
            autoFocus
          />
          <MessagesAttachments
            attachments={todo.attachments_ids.map(
              ({ attachment }) => attachment
            )}
            deletable={false}
            cardWidth="30%"
            addable={false}
          />
        </div>
        <div className="forward-message__btns">
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
          color="#93b5e9"
          setPopUpVisible={setTemplatesVisible}
        >
          <TodosTemplates handleSelectTemplate={handleSelectTemplate} />
        </FakeWindow>
      )}
    </div>
  );
};

export default ForwardTodo;
