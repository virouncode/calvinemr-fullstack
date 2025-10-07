import React from "react";
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
import { timestampToDateStrTZ } from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/names/toPatientName";
import Checkbox from "../../UI/Checkbox/Checkbox";
import ExclamationIcon from "../../UI/Icons/ExclamationIcon";
import PaperclipIcon from "../../UI/Icons/PaperclipIcon";

type MessagePatientThumbnailMobileProps = {
  message: MessageExternalType;
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  setMsgsSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  msgsSelectedIds: number[];
  section: string;
  targetRef?: ((node: Element | null) => void) | null;
};

const MessagePatientThumbnailMobile = ({
  message,
  setCurrentMsgId,
  setMsgsSelectedIds,
  msgsSelectedIds,
  section,
  targetRef = null,
}: MessagePatientThumbnailMobileProps) => {
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
      setMsgsSelectedIds(
        msgsSelectedIds.filter((messageId) => messageId !== id)
      );
    }
  };

  const isMsgSelected = (id: number) => {
    return msgsSelectedIds.includes(id);
  };

  return (
    <div
      className={
        (message.to_patients_ids as { to_patient_infos: DemographicsType }[])
          .map(({ to_patient_infos }) => to_patient_infos.patient_id)
          .includes(user.id) &&
        !(message.read_by_patients_ids ?? []).includes(user.id)
          ? "message__thumbnail-mobile message__thumbnail-mobile--unread"
          : "message__thumbnail-mobile"
      }
      ref={targetRef}
    >
      {/*========== FROM =============*/}
      <div className="message__thumbnail-mobile-title">
        <div className="message__thumbnail-mobile-title-from">
          <Checkbox
            id={message.id?.toString()}
            onChange={handleCheckMsg}
            checked={isMsgSelected(message.id)}
          />
          <div
            onClick={handleMsgClick}
            className="message__thumbnail-mobile-title-from-author"
          >
            {section !== "Sent messages" //messages reçus ou effacés
              ? message.from_patient_id //le from est un patient ou un staff
                ? toPatientName(message.from_patient_infos)
                : staffIdToTitleAndName(staffInfos, message.from_staff_id)
              : /*messages envoyés, le "To" est un staff*/
                staffIdToTitleAndName(staffInfos, message.to_staff_id)}
          </div>
          {message.attachments_ids?.length !== 0 && (
            <div className="message__thumbnail-mobile-title-paperclip">
              <PaperclipIcon clickable={false} ml={5} />
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

export default MessagePatientThumbnailMobile;
