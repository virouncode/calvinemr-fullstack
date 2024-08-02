import { toast } from "react-toastify";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useMessageExternalPut } from "../../../hooks/reactquery/mutations/messagesMutations";
import { timestampToDateTimeStrTZ } from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/names/toPatientName";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";

const MessagePatientThumbnail = ({
  message,
  setCurrentMsgId,
  setMsgsSelectedIds,
  msgsSelectedIds,
  section,
  lastItemRef = null,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const { socket } = useSocketContext();
  const messagePut = useMessageExternalPut();

  const handleMsgClick = async (e) => {
    if (!message.read_by_patients_ids.includes(user.id)) {
      //create and replace message with read by user id
      const messageToPut = {
        ...message,
        read_by_patients_ids: [...message.read_by_patients_ids, user.id],
        attachments_ids: message.attachments_ids.map(
          ({ attachment }) => attachment.id
        ), //reformatted because of Add-on
        previous_messages_ids: message.previous_messages_ids.map(
          ({ previous_message }) => previous_message.id
        ),
        to_patients_ids: message.to_patients_ids.map(
          ({ to_patient_infos }) => to_patient_infos.id
        ),
      }; //reformatted because of Add-on
      // delete messageToPut.to_patient_infos; //From Add-On
      // delete messageToPut.from_patient_infos; //From Add-On
      messagePut.mutate(messageToPut);
      if (user.unreadNbr !== 0) {
        const newUnreadNbr = user.unreadNbr - 1;
        socket.emit("message", {
          route: "USER",
          action: "update",
          content: {
            id: user.id,
            data: {
              ...user,
              unreadNbr: newUnreadNbr,
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

  const handleDeleteMsg = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to remove this message ?",
      })
    ) {
      const messageToPut = {
        ...message,
        deleted_by_patients_ids: [...message.deleted_by_patients_ids, user.id],
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
      if (
        user.unreadNbr !== 0 &&
        !message.read_by_patients_ids.includes(user.id)
      ) {
        const newUnreadNbr = user.unreadNbr - 1;
        socket.emit("message", {
          route: "USER",
          action: "update",
          content: {
            id: user.id,
            data: {
              ...user,
              unreadNbr: newUnreadNbr,
            },
          },
        });
      }
    }
  };

  return (
    <div
      className={
        message.to_patients_ids
          .map(({ to_patient_infos }) => to_patient_infos.id)
          .includes(user.id) && !message.read_by_patients_ids.includes(user.id)
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
            ? message.from_patient_id //le from est un patient ou un staff
              ? toPatientName(message.from_patient_infos)
              : staffIdToTitleAndName(staffInfos, message.from_staff_id)
            : /*messages envoyés, le "To" est un staff*/
              staffIdToTitleAndName(staffInfos, message.to_staff_id)}
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

export default MessagePatientThumbnail;
