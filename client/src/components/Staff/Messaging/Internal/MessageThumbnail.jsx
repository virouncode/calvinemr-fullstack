import { useState } from "react";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  useMessagePut,
  useTodoDelete,
} from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  nowTZTimestamp,
  timestampToDateStrTZ,
  timestampToDateTimeStrTZ,
} from "../../../../utils/dates/formatDates";
import { staffIdListToTitleAndName } from "../../../../utils/names/staffIdListToTitleAndName";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";
import DoneButton from "../../../UI/Buttons/DoneButton";
import UndoneButton from "../../../UI/Buttons/UndoneButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import EditTodo from "./EditTodo";

const MessageThumbnail = ({
  message,
  setCurrentMsgId,
  setMsgsSelectedIds,
  msgsSelectedIds,
  section,
  lastItemRef = null,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [editTodoVisible, setEditTodoVisible] = useState(false);
  const messagePut = useMessagePut(user.id, section);
  const todoDelete = useTodoDelete(user.id, section);
  const navigate = useNavigate();

  const handleMsgClick = async () => {
    if (section !== "To-dos" && !message.read_by_staff_ids?.includes(user.id)) {
      //create and replace message with read by user id
      const messageToPut = {
        ...message,
        read_by_staff_ids: [...message.read_by_staff_ids, user.id],
        attachments_ids: message.attachments_ids.map(
          ({ attachment }) => attachment.id
        ), //reformatted because off add-on
      };
      delete messageToPut.patient_infos; //from add-On
      messagePut.mutate(messageToPut);
      if (user.unreadMessagesNbr !== 0) {
        const newUnreadMessagesNbr = user.unreadMessagesNbr - 1;
        socket.emit("message", {
          route: "USER",
          action: "update",
          content: {
            id: user.id,
            data: {
              ...user,
              unreadMessagesNbr: newUnreadMessagesNbr,
              unreadNbr:
                newUnreadMessagesNbr +
                user.unreadMessagesExternalNbr +
                user.unreadTodosNbr,
            },
          },
        });
      }
    }
    if (section === "To-dos" && !message.read) {
      const messageToPut = {
        ...message,
        read: true,
        attachments_ids: message.attachments_ids.map(
          ({ attachment }) => attachment.id
        ), //reformatted because off add-on
      };
      delete messageToPut.patient_infos; //from add-On
      messagePut.mutate(messageToPut);
      if (user.unreadTodosNbr !== 0) {
        const newUnreadTodosNbr = user.unreadTodosNbr - 1;
        socket.emit("message", {
          route: "USER",
          action: "update",
          content: {
            id: user.id,
            data: {
              ...user,
              unreadTodosNbr: newUnreadTodosNbr,
              unreadNbr:
                newUnreadTodosNbr +
                user.unreadMessagesExternalNbr +
                user.unreadMessagesNbr,
            },
          },
        });
      }
    }
    setCurrentMsgId(message.id);
  };

  const handleEdit = () => {
    setEditTodoVisible(true);
  };

  const handleCheckMsg = (e) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    if (checked) {
      if (!msgsSelectedIds.includes(id)) {
        setMsgsSelectedIds([...msgsSelectedIds, id]);
      }
    } else {
      let msgsSelectedIdsUpdated = [...msgsSelectedIds];
      msgsSelectedIdsUpdated = msgsSelectedIdsUpdated.filter(
        (messageId) => messageId !== id
      );
      setMsgsSelectedIds(msgsSelectedIdsUpdated);
    }
  };

  const isMsgSelected = (id) => {
    return msgsSelectedIds.includes(parseInt(id));
  };

  const handleDeleteMsg = async () => {
    if (
      await confirmAlert({
        content: `Do you really want to delete this ${
          section === "To-dos" ? "to-do" : "message"
        } ?`,
      })
    ) {
      if (section === "To-dos") {
        todoDelete.mutate(message.id, {
          onSuccess: () => setMsgsSelectedIds([]),
        });
        if (user.unreadTodosNbr !== 0 && !message.read) {
          const newUnreadTodosNbr = user.unreadTodosNbr - 1;
          socket.emit("message", {
            route: "USER",
            action: "update",
            content: {
              id: user.id,
              data: {
                ...user,
                unreadTodosNbr: newUnreadTodosNbr,
                unreadNbr:
                  newUnreadTodosNbr +
                  user.unreadMessagesExternalNbr +
                  user.unreadMessagesNbr,
              },
            },
          });
        }
      } else {
        const messageToPut = {
          ...message,
          deleted_by_staff_ids: [...message.deleted_by_staff_ids, user.id],
          attachments_ids: message.attachments_ids.map(
            ({ attachment }) => attachment.id
          ), //reformatted because off add-on
        };
        delete messageToPut.patient_infos; //from add-on
        messagePut.mutate(messageToPut, {
          onSuccess: () => {
            toast.success("Message deleted successfully", {
              containerId: "A",
            });
            setMsgsSelectedIds([]);
          },
          onError: (error) => {
            toast.error(`Error: unable to delete message: ${error.message}`, {
              containerId: "A",
            });
          },
        });
        if (
          user.unreadMessagesNbr !== 0 &&
          !messageToPut.read_by_staff_ids?.includes(user.id)
        ) {
          const newUnreadMessagesNbr = user.unreadMessagesNbr - 1;
          socket.emit("message", {
            route: "USER",
            action: "update",
            content: {
              id: user.id,
              data: {
                ...user,
                unreadMessagesNbr: newUnreadMessagesNbr,
                unreadNbr:
                  newUnreadMessagesNbr +
                  user.unreadMessagesExternalNbr +
                  user.unreadTodosNbr,
              },
            },
          });
        }
      }
    }
  };

  const handleDone = async (e) => {
    e.stopPropagation();
    const messageToPut = {
      ...message,
      attachments_ids: message.attachments_ids.map(
        ({ attachment }) => attachment.id
      ),
      done: true,
    };
    delete messageToPut.patient_infos;
    messagePut.mutate(messageToPut);
  };

  const handleUndone = async (e) => {
    e.stopPropagation();

    const messageToPut = {
      ...message,
      attachments_ids: message.attachments_ids.map(
        ({ attachment }) => attachment.id
      ),
      done: false,
    };
    delete messageToPut.patient_infos;
    messagePut.mutate(messageToPut);
  };

  const handleClickPatient = () => {
    navigate(`/staff/patient-record/${message.related_patient_id}`);
  };

  return (
    <div
      className={
        section !== "To-dos"
          ? message.to_staff_ids?.includes(user.id) &&
            !message.read_by_staff_ids?.includes(user.id)
            ? "message-thumbnail message-thumbnail--unread"
            : "message-thumbnail"
          : !message.read
          ? "message-thumbnail message-thumbnail--unread"
          : "message-thumbnail"
      }
      ref={lastItemRef}
    >
      {/*========== FROM =============*/}

      <div className="message-thumbnail__from">
        <Checkbox
          id={message.id}
          onChange={handleCheckMsg}
          checked={isMsgSelected(message.id)}
        />
        <div
          onClick={handleMsgClick}
          className="message-thumbnail__from-author"
        >
          {section === "To-dos"
            ? staffIdToTitleAndName(staffInfos, message.from_staff_id)
            : section !== "Sent messages"
            ? staffIdToTitleAndName(staffInfos, message.from_id)
            : staffIdListToTitleAndName(staffInfos, message.to_staff_ids)}
        </div>
      </div>

      {/*========== SUBJECT =============*/}
      <div
        className={
          section === "To-dos"
            ? "message-thumbnail__subject message-thumbnail__subject--todo"
            : "message-thumbnail__subject"
        }
        onClick={handleMsgClick}
      >
        {message.high_importance && (
          <i className="fa-solid fa-circle-exclamation message-thumbnail__subject-exclamation" />
        )}
        <div
          className={
            section === "To-dos"
              ? "message-thumbnail__subject-text message-thumbnail__subject-text--todo"
              : "message-thumbnail__subject-text"
          }
          style={{
            textDecoration:
              section === "To-dos" && message.done && "line-through",
          }}
        >
          {message.subject} - {message.body}
        </div>
        {message.attachments_ids.length !== 0 && (
          <i
            className="fa-solid fa-paperclip message-thumbnail__subject-attachment"
            style={{ marginLeft: "5px" }}
          />
        )}
        {section === "To-dos" && (
          <div className="message-thumbnail__subject-btn">
            {message.done ? (
              <UndoneButton onClick={handleUndone} />
            ) : (
              <DoneButton onClick={handleDone} />
            )}
          </div>
        )}
      </div>

      {/*========== RELATED PATIENT =============*/}
      <div className="message-thumbnail__patient" onClick={handleClickPatient}>
        {toPatientName(message.patient_infos)}
      </div>
      {/*========== DATE =============*/}
      <div
        className={
          section !== "To-dos"
            ? "message-thumbnail__date"
            : "message-thumbnail__date message-thumbnail__date--todo"
        }
      >
        {timestampToDateTimeStrTZ(message.date_created)}
      </div>
      {section === "To-dos" && (
        <div
          className="message-thumbnail__duedate"
          style={{
            color:
              message.due_date && nowTZTimestamp() > message.due_date && "red",
          }}
        >
          {timestampToDateStrTZ(message.due_date)}
        </div>
      )}
      {/*========== LOGOS =============*/}
      <div
        className={
          section !== "To-dos"
            ? "message-thumbnail__logos"
            : "message-thumbnail__logos message-thumbnail__logos--todo"
        }
      >
        {section === "To-dos" && (
          <i
            className="fa-regular fa-pen-to-square"
            style={{ marginRight: "5px", cursor: "pointer" }}
            onClick={handleEdit}
          />
        )}
        {section !== "Deleted messages" && (
          <i
            className="fa-solid fa-trash  message-thumbnail__trash"
            style={{ cursor: "pointer" }}
            onClick={handleDeleteMsg}
          ></i>
        )}
      </div>
      {editTodoVisible && (
        <FakeWindow
          title="EDIT TO-DO"
          width={1000}
          height={600}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 600) / 2}
          color={"#94bae8"}
          setPopUpVisible={setEditTodoVisible}
        >
          <EditTodo setEditTodoVisible={setEditTodoVisible} todo={message} />
        </FakeWindow>
      )}
    </div>
  );
};

export default MessageThumbnail;
