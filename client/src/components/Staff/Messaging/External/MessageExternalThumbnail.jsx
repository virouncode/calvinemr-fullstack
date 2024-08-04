import { toast } from "react-toastify";

import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessageExternalPut } from "../../../../hooks/reactquery/mutations/messagesMutations";
import { timestampToDateTimeStrTZ } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";

const MessageExternalThumbnail = ({
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
  const messagePut = useMessageExternalPut();

  const handleMsgClick = async () => {
    if (!message.read_by_staff_id) {
      //create and replace message with read by user id
      const messageToPut = {
        ...message,
        read_by_staff_id: user.id,
        attachments_ids: message.attachments_ids.map(
          ({ attachment }) => attachment.id
        ), //reformatted because of Add-on
        previous_messages_ids: message.previous_messages_ids.map(
          ({ previous_message }) => previous_message.id
        ), //reformatted because of Add-on
      };
      // delete messageToPut.to_patient_infos; //From Add-On
      // delete messageToPut.from_patient_infos; //From Add-on
      messagePut.mutate(messageToPut);
      if (user.unreadMessagesExternalNbr !== 0) {
        const newUnreadMessagesExternalNbr = user.unreadMessagesExternalNbr - 1;
        socket.emit("message", {
          route: "USER",
          action: "update",
          content: {
            id: user.id,
            data: {
              ...user,
              unreadMessagesExternalNbr: newUnreadMessagesExternalNbr,
              unreadNbr: newUnreadMessagesExternalNbr + user.unreadMessagesNbr,
            },
          },
        });
      }
    }
    setCurrentMsgId(message.id);
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
        content: "Do you really want to remove this message ?",
      })
    ) {
      const messageToPut = {
        ...message,
        deleted_by_staff_id: user.id,
        attachments_ids: message.attachments_ids.map(
          ({ attachment }) => attachment.id
        ), //Reformatted beause of Add-On
        previous_messages_ids: message.previous_messages_ids.map(
          ({ previous_message }) => previous_message.id
        ), //Reformatted beause of Add-On
        to_patients_ids: message.to_patients_ids.map(
          ({ to_patient_infos }) => to_patient_infos.id
        ),
      };
      // delete messageToPut.to_patient_infos; //From Add-On
      // delete messageToPut.from_patient_infos; //From Add-On
      messagePut.mutate(messageToPut, {
        onSuccess: () => {
          setMsgsSelectedIds([]);
          toast.success("Message deleted successfully", {
            containerId: "A",
          });
        },
        onError: (error) => {
          toast.error(`Error: unable to delete message: ${error.message}`, {
            containerId: "A",
          });
        },
      });
      //Remove one from the unread messages nbr counter
      if (user.unreadMessagesExternalNbr !== 0 && !message.read_by_staff_id) {
        const newUnreadMessagesExternalNbr = user.unreadMessagesExternalNbr - 1;
        socket.emit("message", {
          route: "USER",
          action: "update",
          content: {
            id: user.id,
            data: {
              ...user,
              unreadMessagesExternalNbr: newUnreadMessagesExternalNbr,
              unreadNbr: newUnreadMessagesExternalNbr + user.unreadMessagesNbr,
            },
          },
        });
      }
    }
  };

  return (
    <div
      className={
        message.to_staff_id &&
        message.to_staff_id === user.id &&
        !message.read_by_staff_id
          ? "message-thumbnail message-thumbnail--unread"
          : "message-thumbnail"
      }
      ref={lastItemRef}
    >
      {/*========== FROM =============*/}
      <div className="message-thumbnail__from">
        <input
          className="message-thumbnail__from-checkbox"
          type="checkbox"
          id={message.id}
          checked={isMsgSelected(message.id)}
          onChange={handleCheckMsg}
        />
        <div
          onClick={handleMsgClick}
          className="message-thumbnail__from-author"
        >
          {section !== "Sent messages" //messages reçus ou effacés
            ? message.from_patient_id //le "From" est un patient
              ? toPatientName(message.from_patient_infos)
              : staffIdToTitleAndName(staffInfos, message.from_staff_id)
            : /*messages envoyés, le "To" est forcément un patient*/
              message.to_patients_ids
                .map(({ to_patient_infos }) => toPatientName(to_patient_infos))
                .join(" / ")}
        </div>
      </div>
      {/*========== SUBJECT =============*/}
      <div
        className="message-thumbnail__subject message-thumbnail__subject--external"
        onClick={handleMsgClick}
      >
        {message.high_importance && (
          <i className="fa-solid fa-circle-exclamation message-thumbnail__subject-exclamation" />
        )}
        <div className="message-thumbnail__subject-text">
          {message.subject} - {message.body}
        </div>
        {message.attachments_ids.length !== 0 && (
          <i className="fa-solid fa-paperclip message-thumbnail__subject-attachment" />
        )}
      </div>
      {/*========== DATE =============*/}
      <div className="message-thumbnail__date message-thumbnail__date--external">
        {timestampToDateTimeStrTZ(message.date_created)}
      </div>
      {/*========== LOGOS =============*/}
      <div className="message-thumbnail__logos">
        {section !== "Deleted messages" && (
          <i
            className="fa-solid fa-trash  message-thumbnail__trash"
            style={{ cursor: "pointer" }}
            onClick={handleDeleteMsg}
          />
        )}
      </div>
    </div>
  );
};

export default MessageExternalThumbnail;
