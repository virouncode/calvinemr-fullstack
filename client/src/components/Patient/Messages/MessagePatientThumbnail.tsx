import React from "react";
import { toast } from "react-toastify";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useMessageExternalPut } from "../../../hooks/reactquery/mutations/messagesMutations";
import {
  DemographicsType,
  MessageAttachmentType,
  MessageExternalType,
} from "../../../types/api";
import { UserPatientType } from "../../../types/app";
import { timestampToDateTimeStrTZ } from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/names/toPatientName";
import Checkbox from "../../UI/Checkbox/Checkbox";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import ExclamationIcon from "../../UI/Icons/ExclamationIcon";
import PaperclipIcon from "../../UI/Icons/PaperclipIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";

type MessagePatientThumbnailProps = {
  message: MessageExternalType;
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  setMsgsSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  msgsSelectedIds: number[];
  section: string;
  lastItemRef?: ((node: Element | null) => void) | null;
};

const MessagePatientThumbnail = ({
  message,
  setCurrentMsgId,
  setMsgsSelectedIds,
  msgsSelectedIds,
  section,
  lastItemRef = null,
}: MessagePatientThumbnailProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserPatientType };
  const { staffInfos } = useStaffInfosContext();
  const { socket } = useSocketContext();
  //Queries
  const messagePut = useMessageExternalPut();

  const handleMsgClick = async () => {
    if (!(message.read_by_patients_ids ?? []).includes(user?.id)) {
      //create and replace message with read by user id
      const messageToPut: MessageExternalType = {
        ...message,
        read_by_patients_ids: [
          ...(message.read_by_patients_ids ?? []),
          user?.id,
        ],
        attachments_ids: (
          message.attachments_ids as { attachment: MessageAttachmentType }[]
        ).map(({ attachment }) => attachment.id as number),
        previous_messages_ids: (
          message.previous_messages_ids as {
            previous_message: MessageExternalType;
          }[]
        ).map(({ previous_message }) => previous_message.id),
        to_patients_ids: (
          message.to_patients_ids as { to_patient_infos: DemographicsType }[]
        ).map(({ to_patient_infos }) => to_patient_infos.patient_id),
      };
      messagePut.mutate(messageToPut);
      if (user?.unreadNbr !== 0) {
        const newUnreadNbr = user?.unreadNbr - 1;
        socket?.emit("message", {
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

  const handleCheckMsg = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const isMsgSelected = (id: number) => {
    return msgsSelectedIds.includes(id);
  };

  const handleDeleteMsg = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to remove this message ?",
      })
    ) {
      const messageToPut: MessageExternalType = {
        ...message,
        deleted_by_patients_ids: [
          ...(message.deleted_by_patients_ids ?? []),
          user.id,
        ],
        attachments_ids: (
          message.attachments_ids as { attachment: MessageAttachmentType }[]
        ).map(({ attachment }) => attachment.id as number),
        previous_messages_ids: (
          message.previous_messages_ids as {
            previous_message: MessageExternalType;
          }[]
        ).map(({ previous_message }) => previous_message.id),
        to_patients_ids: (
          message.to_patients_ids as { to_patient_infos: DemographicsType }[]
        ).map(({ to_patient_infos }) => to_patient_infos.patient_id),
      };
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
        !message.read_by_patients_ids?.includes(user.id)
      ) {
        const newUnreadNbr = user.unreadNbr - 1;
        socket?.emit("message", {
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
        (message.to_patients_ids as { to_patient_infos: DemographicsType }[])
          .map(({ to_patient_infos }) => to_patient_infos.patient_id)
          .includes(user.id) &&
        !(message.read_by_patients_ids ?? []).includes(user.id)
          ? "message-thumbnail message-thumbnail--unread"
          : "message-thumbnail"
      }
      ref={lastItemRef}
    >
      {/*========== FROM =============*/}
      <div className="message-thumbnail__from">
        <Checkbox
          id={message.id?.toString()}
          onChange={handleCheckMsg}
          checked={isMsgSelected(message.id)}
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
        {message.high_importance && <ExclamationIcon mr={5} />}
        <div className="message-thumbnail__subject-text">
          {message.subject} - {message.body}
        </div>
        {message.attachments_ids?.length !== 0 && (
          <PaperclipIcon clickable={false} ml={5} />
        )}
      </div>
      {/*========== DATE =============*/}
      <div className="message-thumbnail__date message-thumbnail__date--external">
        {timestampToDateTimeStrTZ(message.date_created)}
      </div>
      {/*========== LOGOS =============*/}
      <div className="message-thumbnail__logos">
        {section !== "Deleted messages" && (
          <TrashIcon onClick={handleDeleteMsg} />
        )}
      </div>
    </div>
  );
};

export default MessagePatientThumbnail;
