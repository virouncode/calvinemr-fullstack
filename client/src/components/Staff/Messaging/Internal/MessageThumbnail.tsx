import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { xanoDeleteBatch } from "../../../../api/xanoCRUD/xanoDelete";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  useMessagePut,
  useTodoDelete,
} from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  MessageAttachmentType,
  MessageType,
  TodoType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import {
  nowTZTimestamp,
  timestampToDateStrTZ,
  timestampToDateTimeStrTZ,
} from "../../../../utils/dates/formatDates";
import { staffIdListToTitleAndName } from "../../../../utils/names/staffIdListToTitleAndName";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import DoneButton from "../../../UI/Buttons/DoneButton";
import UndoneButton from "../../../UI/Buttons/UndoneButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import { confirmAlert } from "../../../UI/Confirm/ConfirmGlobal";
import ExclamationIcon from "../../../UI/Icons/ExclamationIcon";
import PaperclipIcon from "../../../UI/Icons/PaperclipIcon";
import PenIcon from "../../../UI/Icons/PenIcon";
import TrashIcon from "../../../UI/Icons/TrashIcon";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import EditTodo from "./EditTodo";

type MessageThumbnailProps = {
  message: MessageType | TodoType;
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  setMsgsSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  msgsSelectedIds: number[];
  section: string;
  lastItemRef?: (node: Element | null) => void;
};

const MessageThumbnail = ({
  message,
  setCurrentMsgId,
  setMsgsSelectedIds,
  msgsSelectedIds,
  section,
  lastItemRef,
}: MessageThumbnailProps) => {
  //Hooks
  const navigate = useNavigate();
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [editTodoVisible, setEditTodoVisible] = useState(false);
  //Queries
  const messagePut = useMessagePut(user.id, section);
  const todoDelete = useTodoDelete(user.id);

  const handleMsgClick = async () => {
    if (
      section !== "To-dos" &&
      !(message as MessageType).read_by_staff_ids?.includes(user.id)
    ) {
      //create and replace message with read by user id
      const messageToPut: MessageType = {
        ...(message as MessageType),
        read_by_staff_ids: [
          ...(message as MessageType).read_by_staff_ids,
          user.id,
        ],
        attachments_ids: (
          message.attachments_ids as { attachment: MessageAttachmentType }[]
        ).map(({ attachment }) => attachment.id as number), //reformatted because off add-on
      };
      delete messageToPut.patient_infos; //from add-On
      messagePut.mutate(messageToPut);
      if (user.unreadMessagesNbr !== 0) {
        const newUnreadMessagesNbr = user.unreadMessagesNbr - 1;
        socket?.emit("message", {
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
    if (section === "To-dos" && !(message as TodoType).read) {
      const messageToPut: TodoType = {
        ...(message as TodoType),
        read: true,
        attachments_ids: (
          message.attachments_ids as { attachment: MessageAttachmentType }[]
        ).map(({ attachment }) => attachment.id as number), //reformatted because off add-on
      };
      delete messageToPut.patient_infos; //from add-On
      messagePut.mutate(messageToPut);
      // if (user.unreadTodosNbr !== 0) {
      //   const newUnreadTodosNbr = user.unreadTodosNbr - 1;
      //   socket?.emit("message", {
      //     route: "USER",
      //     action: "update",
      //     content: {
      //       id: user.id,
      //       data: {
      //         ...user,
      //         unreadTodosNbr: newUnreadTodosNbr,
      //         unreadNbr:
      //           newUnreadTodosNbr +
      //           user.unreadMessagesExternalNbr +
      //           user.unreadMessagesNbr,
      //       },
      //     },
      //   });
      // }
    }
    setCurrentMsgId(message.id);
  };

  const handleEdit = () => {
    setEditTodoVisible(true);
  };

  const handleCheckMsg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    if (checked) {
      if (!msgsSelectedIds.includes(id)) {
        setMsgsSelectedIds([...msgsSelectedIds, id]);
      }
    } else {
      setMsgsSelectedIds(
        msgsSelectedIds.filter((messageId) => messageId !== id)
      );
    }
  };

  const isMsgSelected = (id: number) => {
    return msgsSelectedIds.includes(id);
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
        if (message.attachments_ids.length !== 0) {
          try {
            await xanoDeleteBatch(
              "messages_attachments",
              "staff",
              (
                message.attachments_ids as {
                  attachment: MessageAttachmentType;
                }[]
              ).map(({ attachment }) => attachment.id as number)
            );
          } catch (err) {
            if (err instanceof Error)
              toast.error(`Error: unable to delete attachments${err.message}`, {
                containerId: "A",
              });
          }
        }
        todoDelete.mutate(message.id, {
          onSuccess: () => {
            if (message.related_patient_id) {
              socket?.emit("message", {
                key: ["patientRecord", message.related_patient_id],
              });
            }
            setMsgsSelectedIds([]);
          },
        });
        if (user.unreadTodosNbr !== 0 && !(message as TodoType).read) {
          const newUnreadTodosNbr = user.unreadTodosNbr - 1;
          socket?.emit("message", {
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
        const messageToPut: MessageType = {
          ...(message as MessageType),
          deleted_by_staff_ids: [
            ...(message as MessageType).deleted_by_staff_ids,
            user.id,
          ],
          attachments_ids: (
            message.attachments_ids as { attachment: MessageAttachmentType }[]
          ).map(({ attachment }) => attachment.id as number),
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
          socket?.emit("message", {
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

  const handleDone = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    const messageToPut: TodoType = {
      ...(message as TodoType),
      attachments_ids: (
        message.attachments_ids as { attachment: MessageAttachmentType }[]
      ).map(({ attachment }) => attachment.id as number),
      done: true,
    };
    delete messageToPut.patient_infos;
    messagePut.mutate(messageToPut);
    if (user.unreadTodosNbr !== 0) {
      const newUnreadTodosNbr = user.unreadTodosNbr - 1;
      socket?.emit("message", {
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
  };

  const handleUndone = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    const messageToPut: TodoType = {
      ...(message as TodoType),
      attachments_ids: (
        message.attachments_ids as { attachment: MessageAttachmentType }[]
      ).map(({ attachment }) => attachment.id as number),
      done: false,
    };
    delete messageToPut.patient_infos;
    messagePut.mutate(messageToPut);
    const newUnreadTodosNbr = user.unreadTodosNbr + 1;
    socket?.emit("message", {
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
  };

  const handleClickPatient = () => {
    navigate(`/staff/patient-record/${message.related_patient_id}`);
  };

  return (
    <div
      className={
        section !== "To-dos"
          ? (message as MessageType).to_staff_ids?.includes(user.id) &&
            !(message as MessageType).read_by_staff_ids?.includes(user.id)
            ? "message__thumbnail message__thumbnail--unread"
            : "message__thumbnail"
          : !(message as TodoType).read
          ? "message__thumbnail message__thumbnail--todo message__thumbnail--unread"
          : "message__thumbnail message__thumbnail--todo"
      }
      ref={lastItemRef}
    >
      {/*========== FROM =============*/}

      <div className="message__thumbnail-from">
        <Checkbox
          id={message.id.toString()}
          onChange={handleCheckMsg}
          checked={isMsgSelected(message.id)}
        />
        <div
          onClick={handleMsgClick}
          className="message__thumbnail-from-author"
        >
          {section === "To-dos"
            ? staffIdToTitleAndName(
                staffInfos,
                (message as TodoType).from_staff_id
              )
            : section !== "Sent messages"
            ? staffIdToTitleAndName(
                staffInfos,
                (message as MessageType).from_id
              )
            : staffIdListToTitleAndName(
                staffInfos,
                (message as MessageType).to_staff_ids
              )}
        </div>
      </div>

      {/*========== SUBJECT =============*/}
      <div
        className={
          section === "To-dos"
            ? "message__thumbnail-subject message__thumbnail-subject--todo"
            : "message__thumbnail-subject"
        }
        onClick={handleMsgClick}
      >
        {message.high_importance && (
          <div className="message__thumbnail-subject-exclamation">
            <ExclamationIcon mr={5} />
          </div>
        )}
        <div
          className={
            section === "To-dos"
              ? "message__thumbnail-subject-text message__thumbnail-subject-text--todo"
              : "message__thumbnail-subject-text"
          }
          style={{
            textDecoration:
              section === "To-dos" && (message as TodoType).done
                ? "line-through"
                : "none",
          }}
        >
          {message.subject} - {message.body}
        </div>

        {message.attachments_ids.length !== 0 && (
          <div className="message__thumbnail-subject-paperclip">
            <PaperclipIcon ml={5} clickable={false} />
          </div>
        )}
        {section === "To-dos" && (
          <div className="message__thumbnail-subject-btn">
            {(message as TodoType).done ? (
              <UndoneButton onClick={handleUndone} />
            ) : (
              <DoneButton onClick={handleDone} />
            )}
          </div>
        )}
      </div>

      {/*========== RELATED PATIENT =============*/}
      <div className="message__thumbnail-patient" onClick={handleClickPatient}>
        {toPatientName(message.patient_infos)}
      </div>
      {/*========== DATE =============*/}
      <div
        className={
          section !== "To-dos"
            ? "message__thumbnail-date"
            : "message__thumbnail-date message__thumbnail-date--todo"
        }
      >
        {timestampToDateTimeStrTZ(message.date_created)}
      </div>
      {section === "To-dos" && (
        <div
          className="message__thumbnail-duedate"
          style={{
            color: (message as TodoType).due_date
              ? nowTZTimestamp() > ((message as TodoType).due_date as number)
                ? "red"
                : "#3d375a"
              : "#3d375a",
          }}
        >
          {timestampToDateStrTZ((message as TodoType).due_date)}
        </div>
      )}
      {/*========== LOGOS =============*/}
      <div
        className={
          section !== "To-dos"
            ? "message__thumbnail-logos"
            : "message__thumbnail-logos message__thumbnail-logos--todo"
        }
      >
        {section === "To-dos" && <PenIcon mr={5} onClick={handleEdit} />}
        {section !== "Deleted messages" && (
          <TrashIcon onClick={handleDeleteMsg} />
        )}
      </div>
      {editTodoVisible && (
        <FakeWindow
          title="EDIT TO-DO"
          width={1000}
          height={630}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 630) / 2}
          color={"#94bae8"}
          setPopUpVisible={setEditTodoVisible}
        >
          <EditTodo
            setEditTodoVisible={setEditTodoVisible}
            todo={message as TodoType}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default MessageThumbnail;
