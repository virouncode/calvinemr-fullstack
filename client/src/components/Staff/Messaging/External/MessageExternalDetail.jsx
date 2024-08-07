import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useClinicalNotePost } from "../../../../hooks/reactquery/mutations/clinicalNotesMutations";
import { useMessageExternalPut } from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  nowTZTimestamp,
  timestampToDateTimeSecondsStrTZ,
} from "../../../../utils/dates/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../utils/names/staffIdToName";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import Button from "../../../UI/Buttons/Button";
import { confirmAlert } from "../../../UI/Confirm/ConfirmGlobal";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import NewTodo from "../Internal/NewTodo";
import ForwardMessageExternal from "./ForwardMessageExternal";
import MessageExternal from "./MessageExternal";
import MessageExternalDetailToolbar from "./MessageExternalDetailToolbar";
import MessagesExternalAttachments from "./MessagesExternalAttachments";
import MessagesExternalPrintPU from "./MessagesExternalPrintPU";
import ReplyMessageExternal from "./ReplyMessageExternal";

const MessageExternalDetail = ({
  setCurrentMsgId,
  message,
  section,
  printVisible,
  setPrintVisible,
}) => {
  const { user } = useUserContext();
  const { messageId } = useParams();
  const navigate = useNavigate();
  const { staffInfos } = useStaffInfosContext();
  const [replyVisible, setReplyVisible] = useState(false);
  const [forwardVisible, setForwardVisible] = useState(false);
  const [newTodoVisible, setNewTodoVisible] = useState(false);
  const [allPersons, setAllPersons] = useState(false);
  const messageContentRef = useRef(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    //to hide parameters
    if (messageId) {
      navigate("/staff/messages");
    }
  }, [messageId, navigate]);

  const previousMsgs = message.previous_messages_ids
    .map(({ previous_message }) => previous_message)
    .sort((a, b) => b.date_created - a.date_created);

  const attachments = message.attachments_ids.map(
    ({ attachment }) => attachment
  );
  const messagePut = useMessageExternalPut();
  const clinicalNotePost = useClinicalNotePost();

  const handleClickBack = () => {
    setCurrentMsgId(0);
  };

  const handleClickForward = () => {
    setForwardVisible(true);
  };
  const handleClickTodo = () => {
    setNewTodoVisible(true);
  };

  const handleDeleteMsg = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this message ?",
      })
    ) {
      const messageToPut = {
        ...message,
        deleted_by_staff_id: user.id,
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

  const handleClickReply = () => {
    setReplyVisible(true);
    setAllPersons(false);
  };

  const handleAddToClinicalNotes = async () => {
    setPosting(true);
    //create the attachment with message content
    const element = messageContentRef.current;
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2,
    });
    const dataURL = canvas.toDataURL("image/jpeg");
    let fileToUpload = await xanoPost("/upload/attachment", "staff", {
      content: dataURL,
    });
    if (section === "Received messages") {
      //post attachment and get id
      const datasAttachment = [
        {
          file: fileToUpload,
          alias: `Message from: ${toPatientName(
            message.from_patient_infos
          )} (${timestampToDateTimeSecondsStrTZ(message.date_created)})`,
          date_created: nowTZTimestamp(),
          created_by_staff_id: user.id,
        },
      ];
      const attach_ids = await xanoPost(
        "/clinical_notes_attachments",
        "staff",
        {
          attachments_array: datasAttachment,
        }
      );
      const clinicalNoteToPost = {
        patient_id: message.from_patient_id,
        subject: `Message from: ${toPatientName(
          message.from_patient_infos
        )} (${timestampToDateTimeSecondsStrTZ(message.date_created)})`,
        MyClinicalNotesContent: "See attachment",
        ParticipatingProviders: [
          {
            Name: {
              FirstName: staffIdToFirstName(staffInfos, user.id),
              LastName: staffIdToLastName(staffInfos, user.id),
            },
            OHIPPhysicianId: staffIdToOHIP(staffInfos, user.id),
            DateTimeNoteCreated: nowTZTimestamp(),
          },
        ],
        version_nbr: 1,
        attachments_ids: attach_ids,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
      };
      clinicalNotePost.mutate(clinicalNoteToPost, {
        onSuccess: () => {
          setPosting(false);
          toast.success("Message successfuly added to patient clinical notes", {
            containerId: "A",
          });
        },
        onError: (error) => {
          setPosting(false);
          toast.error(
            `Unable to add message to patient clinical notes: ${error.message}`,
            { containerId: "A" }
          );
        },
      });
    } else if (section === "Sent messages") {
      const datasAttachment = [
        {
          file: fileToUpload,
          alias: `Message from: ${staffIdToTitleAndName(
            staffInfos,
            message.from_staff_id
          )} (${timestampToDateTimeSecondsStrTZ(message.date_created)})`,
          date_created: nowTZTimestamp(),
          created_by_staff_id: user.id,
        },
      ];
      const attach_ids = await xanoPost(
        "/clinical_notes_attachments",
        "staff",
        {
          attachments_array: datasAttachment,
        }
      );
      for (let patientId of message.to_patients_ids.map(
        ({ to_patient_infos }) => to_patient_infos.id
      )) {
        const clinicalNoteToPost = {
          patient_id: patientId,
          subject: `Message from: ${staffIdToTitleAndName(
            staffInfos,
            message.from_staff_id
          )} (${timestampToDateTimeSecondsStrTZ(message.date_created)})`,
          MyClinicalNotesContent: "See attachment",
          ParticipatingProviders: [
            {
              Name: {
                FirstName: staffIdToFirstName(staffInfos, user.id),
                LastName: staffIdToLastName(staffInfos, user.id),
              },
              OHIPPhysicianId: staffIdToOHIP(staffInfos, user.id),
              DateTimeNoteCreated: nowTZTimestamp(),
            },
          ],
          version_nbr: 1,
          attachments_ids: attach_ids,
          date_created: nowTZTimestamp(),
          created_by_id: user.id,
        };
        clinicalNotePost.mutate(clinicalNoteToPost, {
          onSuccess: () => {
            setPosting(false);
          },
          onError: (error) => {
            setPosting(false);
            toast.error(
              `Unable to add message to patient clinical notes: ${error.message}`,
              { containerId: "A" }
            );
          },
        });
      }
    }
  };

  return (
    message && (
      <>
        <MessageExternalDetailToolbar
          message={message}
          section={section}
          posting={posting}
          handleClickBack={handleClickBack}
          handleAddToClinicalNotes={handleAddToClinicalNotes}
          handleDeleteMsg={handleDeleteMsg}
        />
        <div className="message-detail__content" ref={messageContentRef}>
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
            cardWidth="15%"
            addable={true}
            patientsIds={
              message.from_patient_id
                ? [message.from_patient_id]
                : message.to_patients_ids.map(
                    ({ to_patient_infos }) => to_patient_infos.id
                  )
            }
            patientsNames={
              message.from_patient_id
                ? [toPatientName(message.from_patient_infos)]
                : message.to_patients_ids.map(({ to_patient_infos }) =>
                    toPatientName(to_patient_infos)
                  )
            }
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
          <ReplyMessageExternal
            setReplyVisible={setReplyVisible}
            allPersons={allPersons}
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
            <Button onClick={handleClickForward} label="Forward" />
            <Button onClick={handleClickTodo} label="Todo" />
          </div>
        )}
        {forwardVisible && (
          <FakeWindow
            title="FORWARD MESSAGE"
            width={1000}
            height={600}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 600) / 2}
            color={"#94bae8"}
            setPopUpVisible={setForwardVisible}
          >
            <ForwardMessageExternal
              setForwardVisible={setForwardVisible}
              message={message}
              previousMsgs={previousMsgs}
              patientName={
                message.from_patient_id
                  ? toPatientName(message.from_patient_infos)
                  : toPatientName(message.to_patient_infos)
              }
              section={section}
            />
          </FakeWindow>
        )}
        {newTodoVisible && (
          <FakeWindow
            title="NEW TO-DO"
            width={1000}
            height={600}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 600) / 2}
            color={"#94bae8"}
            setPopUpVisible={setNewTodoVisible}
          >
            <NewTodo
              setNewTodoVisible={setNewTodoVisible}
              initialPatient={{
                id: message.from_patient_id || 0,
                name: toPatientName(message.from_patient_infos),
              }}
              initialAttachments={attachments}
              initialBody={message.body}
            />
          </FakeWindow>
        )}
      </>
    )
  );
};

export default MessageExternalDetail;
