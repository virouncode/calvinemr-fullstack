import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { timestampToDateStrTZ } from "../../../../utils/dates/formatDates";
import { staffIdListToTitleAndName } from "../../../../utils/names/staffIdListToTitleAndName";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import DoneButton from "../../../UI/Buttons/DoneButton";
import UndoneButton from "../../../UI/Buttons/UndoneButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import ExclamationIcon from "../../../UI/Icons/ExclamationIcon";
import PaperclipIcon from "../../../UI/Icons/PaperclipIcon";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import EditTodo from "./EditTodo";

type MessageThumbnailMobileProps = {
  message: MessageType | TodoType;
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  setMsgsSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  msgsSelectedIds: number[];
  section: string;
  lastItemRef?: (node: Element | null) => void;
};

const MessageThumbnailMobile = ({
  message,
  setCurrentMsgId,
  setMsgsSelectedIds,
  msgsSelectedIds,
  section,
  lastItemRef,
}: MessageThumbnailMobileProps) => {
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
    }
    setCurrentMsgId(message.id);
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
            ? "message__thumbnail-mobile message__thumbnail-mobile--unread"
            : "message__thumbnail-mobile"
          : !(message as TodoType).read
          ? "message__thumbnail-mobile message__thumbnail-mobile--todo message__thumbnail-mobile--unread"
          : "message__thumbnail-mobile message__thumbnail-mobile--todo"
      }
      ref={lastItemRef}
    >
      {/*========== FROM =============*/}
      <div className="message__thumbnail-mobile-title">
        <div className="message__thumbnail-mobile-title-from">
          <Checkbox
            id={message.id.toString()}
            onChange={handleCheckMsg}
            checked={isMsgSelected(message.id)}
          />
          <div
            className="message__thumbnail-mobile-title-from-author"
            onClick={handleMsgClick}
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
          {message.attachments_ids.length !== 0 && (
            <div className="message__thumbnail-mobile-title-paperclip">
              <PaperclipIcon ml={5} clickable={false} />
            </div>
          )}
        </div>
        <div className="message__thumbnail-mobile-title-date">
          {timestampToDateStrTZ(message.date_created)}
        </div>
      </div>

      {/*========== SUBJECT =============*/}
      <div
        className="message__thumbnail-mobile-subject"
        onClick={handleMsgClick}
      >
        {message.high_importance && (
          <div className="message__thumbnail-mobile-subject-exclamation">
            <ExclamationIcon mr={5} />
          </div>
        )}
        <div
          className="message__thumbnail-mobile-subject-text"
          style={{
            textDecoration:
              section === "To-dos" && (message as TodoType).done
                ? "line-through"
                : "none",
          }}
        >
          {message.subject}
        </div>

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
      {/*========== BODY =============*/}
      <div className="message__thumbnail-mobile-body" onClick={handleMsgClick}>
        {message.body}
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

export default MessageThumbnailMobile;
