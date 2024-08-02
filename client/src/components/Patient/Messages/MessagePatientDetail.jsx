import { useState } from "react";
import NewWindow from "react-new-window";
import { toast } from "react-toastify";
import useUserContext from "../../../hooks/context/useUserContext";
import { useMessageExternalPut } from "../../../hooks/reactquery/mutations/messagesMutations";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import MessageExternal from "../../Staff/Messaging/External/MessageExternal";
import MessagesExternalPrintPU from "../../Staff/Messaging/External/MessagesExternalPrintPU";
import MessagesAttachments from "../../Staff/Messaging/Internal/MessagesAttachments";
import MessagePatientDetailToolbar from "./MessagePatientDetailToolbar";
import ReplyMessagePatient from "./ReplyMessagePatient";

const MessagePatientDetail = ({
  setCurrentMsgId,
  message,
  section,
  printVisible,
  setPrintVisible,
}) => {
  const { user } = useUserContext();
  const [replyVisible, setReplyVisible] = useState(false);
  const previousMsgs = message.previous_messages_ids
    ?.map(({ previous_message }) => previous_message)
    ?.sort((a, b) => b.date_created - a.date_created);

  const attachments = message.attachments_ids.map(
    ({ attachment }) => attachment
  );
  const messagePut = useMessageExternalPut();

  const handleClickBack = (e) => {
    setCurrentMsgId(0);
  };

  const handleDeleteMsg = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this message ?",
      })
    ) {
      const messageToPut = {
        ...message,
        deleted_by_patients_ids: [...message.deleted_by_patients_ids, user.id],
        attachments_ids: message.attachments_ids.map(
          ({ attachment }) => attachment.id
        ),
        previous_messages_ids: message.previous_messages_ids.map(
          ({ previous_message }) => previous_message.id
        ),
        to_patients_ids: message.to_patients_ids.map(
          ({ to_patient_infos }) => to_patient_infos.id
        ),
      };
      // delete messageToPut.to_patient_infos;
      // delete messageToPut.form_patient_infos;
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

  const handleClickReply = (e) => {
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
          <MessagesAttachments
            attachments={attachments}
            deletable={false}
            cardWidth="15%"
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
            <MessagesExternalPrintPU
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
              <button onClick={handleClickReply}>Reply</button>
            )}
          </div>
        )}
      </>
    )
  );
};

export default MessagePatientDetail;
