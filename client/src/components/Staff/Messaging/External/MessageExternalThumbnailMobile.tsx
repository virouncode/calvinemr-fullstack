import React from "react";
import { toast } from "react-toastify";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessageExternalPut } from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  DemographicsType,
  MessageAttachmentType,
  MessageExternalType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { timestampToDateStrTZ } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import { confirmAlert } from "../../../UI/Confirm/ConfirmGlobal";
import ExclamationIcon from "../../../UI/Icons/ExclamationIcon";
import PaperclipIcon from "../../../UI/Icons/PaperclipIcon";

type MessageExternalThumbnailMobileProps = {
  message: MessageExternalType;
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  setMsgsSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  msgsSelectedIds: number[];
  section: string;
  lastItemRef?: (node: Element | null) => void;
};

const MessageExternalThumbnailMobile = ({
  message,
  setCurrentMsgId,
  setMsgsSelectedIds,
  msgsSelectedIds,
  section,
  lastItemRef,
}: MessageExternalThumbnailMobileProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  //Queries
  const messagePut = useMessageExternalPut();

  const handleMsgClick = async () => {
    if (!message.read_by_staff_id) {
      //create and replace message with read by user id
      const messageToPut: MessageExternalType = {
        ...message,
        read_by_staff_id: user.id,
        attachments_ids: (
          message.attachments_ids as { attachment: MessageAttachmentType }[]
        ).map(({ attachment }) => attachment.id as number),
        previous_messages_ids: (
          message.previous_messages_ids as {
            previous_message: MessageExternalType;
          }[]
        ).map(({ previous_message }) => previous_message.id),
      };
      messagePut.mutate(messageToPut);
      if (user.unreadMessagesExternalNbr !== 0) {
        const newUnreadMessagesExternalNbr = user.unreadMessagesExternalNbr - 1;
        socket?.emit("message", {
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
        deleted_by_staff_id: user.id,
        attachments_ids: (
          message.attachments_ids as { attachment: MessageAttachmentType }[]
        ).map(({ attachment }) => attachment.id as number), //Reformatted beause of Add-On
        previous_messages_ids: (
          message.previous_messages_ids as {
            previous_message: MessageExternalType;
          }[]
        ).map(({ previous_message }) => previous_message.id), //Reformatted beause of Add-On
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
      //Remove one from the unread messages nbr counter
      if (user.unreadMessagesExternalNbr !== 0 && !message.read_by_staff_id) {
        const newUnreadMessagesExternalNbr = user.unreadMessagesExternalNbr - 1;
        socket?.emit("message", {
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
          ? "message__thumbnail-mobile message__thumbnail-mobile--unread"
          : "message__thumbnail-mobile"
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
            {section !== "Sent messages" //messages reçus ou effacés
              ? message.from_patient_id //le "From" est un patient
                ? toPatientName(message.from_patient_infos)
                : staffIdToTitleAndName(staffInfos, message.from_staff_id)
              : /*messages envoyés, le "To" est forcément un patient*/
                (
                  message.to_patients_ids as {
                    to_patient_infos: DemographicsType;
                  }[]
                )
                  .map(({ to_patient_infos }) =>
                    toPatientName(to_patient_infos)
                  )
                  .join(" / ")}
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
        <div className="message__thumbnail-mobile-subject-text">
          {message.subject}
        </div>
      </div>
      {/*========== BODY =============*/}
      <div className="message__thumbnail-mobile-body" onClick={handleMsgClick}>
        {message.body}
      </div>
    </div>
  );
};

export default MessageExternalThumbnailMobile;
