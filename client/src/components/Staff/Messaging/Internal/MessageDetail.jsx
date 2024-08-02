import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useClinicalNotePost } from "../../../../hooks/reactquery/mutations/clinicalNotesMutations";
import {
  useMessagePut,
  useTodoDelete,
} from "../../../../hooks/reactquery/mutations/messagesMutations";
import { usePreviousMessages } from "../../../../hooks/reactquery/queries/messagesQueries";
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
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessageExternal from "../External/MessageExternal";
import EditTodo from "./EditTodo";
import ForwardMessage from "./ForwardMessage";
import ForwardTodo from "./ForwardTodo";
import Message from "./Message";
import MessageDetailToolbar from "./MessageDetailToolbar";
import MessagesAttachments from "./MessagesAttachments";
import MessagesPrintPU from "./MessagesPrintPU";
import NewTodo from "./NewTodo";
import ReplyMessage from "./ReplyMessage";

const MessageDetail = ({
  setCurrentMsgId,
  message,
  section,
  printVisible,
  setPrintVisible,
}) => {
  const { user } = useUserContext();
  const { messageId } = useParams();
  const { staffInfos } = useStaffInfosContext();
  const navigate = useNavigate();
  const [replyVisible, setReplyVisible] = useState(false);
  const [forwardVisible, setForwardVisible] = useState(false);
  const [forwardTodoVisible, setForwardTodoVisible] = useState(false);
  const [editTodoVisible, setEditTodoVisible] = useState(false);
  const [newTodoVisible, setNewTodoVisible] = useState(false);
  const [allPersons, setAllPersons] = useState(false);
  const [posting, setPosting] = useState(false);
  const {
    data: previousMsgs,
    isPending,
    error,
  } = usePreviousMessages(message, section);
  const messageContentRef = useRef(null);
  const messagePut = useMessagePut(user.id, section);
  const todoDelete = useTodoDelete(user.id, section);
  const clinicalNotePost = useClinicalNotePost(message.related_patient_id);
  const attachments = message.attachments_ids.map(
    ({ attachment }) => attachment
  );

  useEffect(() => {
    //to hide parameters
    if (messageId) {
      navigate("/staff/messages");
    }
  }, [messageId, navigate]);

  const handleEdit = () => {
    setEditTodoVisible(true);
  };

  const handleClickBack = (e) => {
    setCurrentMsgId(0);
  };

  const handleDeleteMsg = async (e) => {
    if (
      await confirmAlert({
        content: `Do you really want to delete this ${
          section === "To-dos" ? "to-do" : "message"
        } ?`,
      })
    ) {
      if (section === "To-dos") {
        todoDelete.mutate(message.id, {
          onSuccess: () => {
            setCurrentMsgId(0);
          },
        });
      } else {
        const messageToPut = {
          ...message,
          deleted_by_staff_ids: [...message.deleted_by_staff_ids, user.id],
          attachments_ids: message.attachments_ids.map(
            ({ attachment }) => attachment.id
          ), //reformatted because of add-on
        };
        delete messageToPut.patient_infos; //from add-on
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
    }
  };

  const handleClickReply = (e) => {
    setReplyVisible(true);
    setAllPersons(false);
  };
  const handleClickReplyAll = (e) => {
    setReplyVisible(true);
    setAllPersons(true);
  };

  const handleClickForward = (e) => {
    setForwardVisible(true);
  };
  const handleClickTodo = (e) => {
    setNewTodoVisible(true);
  };

  const handleClickForwardTodo = (e) => {
    setForwardTodoVisible(true);
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
    //post attachment and get id
    const datasAttachment = [
      {
        file: fileToUpload,
        alias: `Message from: ${staffIdToTitleAndName(
          staffInfos,
          message.from_id
        )} (${timestampToDateTimeSecondsStrTZ(message.date_created)})`,
        date_created: nowTZTimestamp(),
        created_by_staff_id: user.id,
      },
    ];
    const attach_ids = await xanoPost("/clinical_notes_attachments", "staff", {
      attachments_array: datasAttachment,
    });
    const clinicalNoteToPost = {
      patient_id: message.related_patient_id,
      subject: `Message from ${staffIdToTitleAndName(
        staffInfos,
        message.from_id
      )} (${timestampToDateTimeSecondsStrTZ(message.date_created)})`,
      MyClinicalNotesContent: "See attachment",
      ParticipatingProviders: [
        {
          Name: {
            FirstName: staffIdToFirstName(staffInfos, user.id),
            LastName: staffIdToLastName(staffInfos, user.id),
          },
          OHIPPhysicianId: staffIdToOHIP((staffInfos, user.id)),
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
  };

  if (isPending) return <LoadingParagraph />;
  if (error && section !== "To-dos")
    return <ErrorParagraph errorMsg={error.message} />;

  return (
    message && (
      <>
        <MessageDetailToolbar
          message={message}
          section={section}
          posting={posting}
          handleClickBack={handleClickBack}
          handleAddToClinicalNotes={handleAddToClinicalNotes}
          handleEdit={handleEdit}
          handleDeleteMsg={handleDeleteMsg}
        />
        <div ref={messageContentRef} className="message-detail__content">
          <Message
            message={message}
            key={message.id}
            index={0}
            section={section}
          />
          {section !== "To-dos" && (
            <>
              {previousMsgs && previousMsgs.length > 0
                ? previousMsgs.map((message, index) =>
                    message.type === "Internal" ? (
                      <Message
                        message={message}
                        key={message.id}
                        index={index + 1}
                      />
                    ) : (
                      <MessageExternal
                        message={message}
                        key={message.id}
                        index={index + 1}
                      />
                    )
                  )
                : null}
            </>
          )}
          <MessagesAttachments
            attachments={attachments}
            deletable={false}
            cardWidth="15%"
            addable={true}
            hasRelatedPatient={message.related_patient_id ? true : false}
            patientId={
              message.related_patient_id ? message.related_patient_id : null
            }
            patientName={toPatientName(message.patient_infos)}
            message={message}
          />
        </div>
        {printVisible && (
          <NewWindow
            title={`Message(s) / Subject: ${message.subject} ${
              message.related_patient_id
                ? `/ Patient: ${toPatientName(message.patient_infos)}`
                : ""
            }`}
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
            <MessagesPrintPU
              message={message}
              previousMsgs={previousMsgs}
              attachments={attachments}
              section={section}
            />
          </NewWindow>
        )}
        {replyVisible && (
          <ReplyMessage
            setReplyVisible={setReplyVisible}
            allPersons={allPersons}
            message={message}
            previousMsgs={previousMsgs}
            patientName={toPatientName(message.patient_infos)}
            setCurrentMsgId={setCurrentMsgId}
            section={section}
          />
        )}
        {section !== "Deleted messages" &&
          section !== "To-dos" &&
          !replyVisible &&
          !forwardVisible &&
          !newTodoVisible && (
            <div className="message-detail__btns">
              {section !== "Sent messages" && (
                <button onClick={handleClickReply}>Reply</button>
              )}
              {message.to_staff_ids.length >= 2 &&
                section !== "Sent messages" && (
                  <button onClick={handleClickReplyAll}>Reply all</button>
                )}
              <button onClick={handleClickForward}>Forward</button>
              <button onClick={handleClickTodo}>Todo</button>
            </div>
          )}
        {section === "To-dos" && (
          <div className="message-detail__btns">
            <button onClick={handleClickForwardTodo}>Forward To-do</button>
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
            <ForwardMessage
              setForwardVisible={setForwardVisible}
              message={message}
              previousMsgs={previousMsgs}
              patientName={toPatientName(message.patient_infos)}
              section={section}
            />
          </FakeWindow>
        )}
        {editTodoVisible && (
          <FakeWindow
            title="EDIT TO-DO"
            width={1000}
            height={600}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 600) / 2}
            color={"#94bae8"}
            setPopUpVisible={setEditTodoVisible}
          >
            <EditTodo setEditTodoVisible={setEditTodoVisible} todo={message} />
          </FakeWindow>
        )}
        {forwardTodoVisible && (
          <FakeWindow
            title="FORWARD TO-DO"
            width={1000}
            height={600}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 600) / 2}
            color={"#94bae8"}
            setPopUpVisible={setForwardTodoVisible}
          >
            <ForwardTodo
              setForwardTodoVisible={setForwardTodoVisible}
              todo={message}
              patientName={toPatientName(message.patient_infos)}
              setCurrentMsgId={setCurrentMsgId}
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
                id: message.related_patient_id || 0,
                name: toPatientName(message.patient_infos),
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

export default MessageDetail;
