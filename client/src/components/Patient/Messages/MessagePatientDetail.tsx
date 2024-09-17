import React, { useState } from "react";
import NewWindow from "react-new-window";
import { toast } from "react-toastify";
import useUserContext from "../../../hooks/context/useUserContext";
import { useMessageExternalPut } from "../../../hooks/reactquery/mutations/messagesMutations";
import {
  DemographicsType,
  MessageAttachmentType,
  MessageExternalType,
} from "../../../types/api";
import { UserPatientType } from "../../../types/app";
import MessageExternal from "../../Staff/Messaging/External/MessageExternal";
import MessagesExternalAttachments from "../../Staff/Messaging/External/MessagesExternalAttachments";
import MessagesExternalPrint from "../../Staff/Messaging/External/MessagesExternalPrint";
import Button from "../../UI/Buttons/Button";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import MessagePatientDetailToolbar from "./MessagePatientDetailToolbar";
import ReplyMessagePatient from "./ReplyMessagePatient";

type MessagePatientDetailProps = {
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  message: MessageExternalType;
  section: string;
  printVisible: boolean;
  setPrintVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const MessagePatientDetail = ({
  setCurrentMsgId,
  message,
  section,
  printVisible,
  setPrintVisible,
}: MessagePatientDetailProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserPatientType };
  const [replyVisible, setReplyVisible] = useState(false);
  const previousMsgs: MessageExternalType[] = message
    ? (
        message.previous_messages_ids as {
          previous_message: MessageExternalType;
        }[]
      )
        .map(({ previous_message }) => previous_message)
        .sort((a, b) => b.date_created - a.date_created)
    : [];

  const attachments: MessageAttachmentType[] = message
    ? (message.attachments_ids as { attachment: MessageAttachmentType }[]).map(
        ({ attachment }) => attachment
      )
    : [];
  //Queries
  const messagePut = useMessageExternalPut();

  const handleClickBack = () => {
    setCurrentMsgId(0);
  };

  const handleDeleteMsg = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this message ?",
      })
    ) {
      const messageToPut: MessageExternalType = {
        ...message,
        deleted_by_patients_ids: [
          ...(message?.deleted_by_patients_ids ?? []),
          user.id,
        ],
        attachments_ids: (
          message?.attachments_ids as { attachment: MessageAttachmentType }[]
        ).map(({ attachment }) => attachment.id as number),
        previous_messages_ids: (
          message?.previous_messages_ids as {
            previous_message: MessageExternalType;
          }[]
        ).map(({ previous_message }) => previous_message.id),
        to_patients_ids: (
          message?.to_patients_ids as { to_patient_infos: DemographicsType }[]
        ).map(({ to_patient_infos }) => to_patient_infos.patient_id),
      };

      messagePut.mutate(messageToPut, {
        onSuccess: () => {
          toast.success("Message deleted successfully", {
            containerId: "A",
          });
          setCurrentMsgId(0);
        },
        onError: (error) => {
          toast.error(`Error: unable to delete message: ${error.message}`, {
            containerId: "A",
          });
        },
      });
    }
  };

  const handleClickReply = () => {
    setReplyVisible(true);
  };

  return (
    message && (
      <>
        <MessagePatientDetailToolbar
          message={message}
          section={section}
          handleClickBack={handleClickBack}
          handleDeleteMsg={handleDeleteMsg}
        />
        <div className="message-detail__content">
          <MessageExternal message={message} key={message.id} index={0} />
          {previousMsgs &&
            previousMsgs.length > 0 &&
            previousMsgs.map((message, index) => (
              <MessageExternal
                message={message}
                key={message.id}
                index={index + 1}
              />
            ))}
          <MessagesExternalAttachments
            attachments={attachments}
            deletable={false}
            addable={false}
            message={message}
          />
        </div>
        {printVisible && (
          <NewWindow
            title={`Message(s) / Subject: ${message.subject}`}
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 793.7,
              height: 1122.5,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPrintVisible(false)}
          >
            <MessagesExternalPrint
              message={message}
              previousMsgs={previousMsgs}
              attachments={attachments}
            />
          </NewWindow>
        )}
        {replyVisible && (
          <ReplyMessagePatient
            setReplyVisible={setReplyVisible}
            message={message}
            previousMsgs={previousMsgs}
            setCurrentMsgId={setCurrentMsgId}
          />
        )}
        {section !== "Deleted messages" && !replyVisible && (
          <div className="message-detail__btns">
            {section !== "Sent messages" && (
              <Button onClick={handleClickReply} label="Reply" />
            )}
          </div>
        )}
      </>
    )
  );
};

export default MessagePatientDetail;
