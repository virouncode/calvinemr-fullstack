import { useMediaQuery } from "@mui/material";
import axios from "axios";
import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { xanoDeleteBatch } from "../../../../api/xanoCRUD/xanoDelete";
import { xanoPost } from "../../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useClinicalNotePost } from "../../../../hooks/reactquery/mutations/clinicalNotesMutations";
import {
  useMessagePut,
  useTodoDelete,
} from "../../../../hooks/reactquery/mutations/messagesMutations";
import { usePreviousMessages } from "../../../../hooks/reactquery/queries/messagesQueries";
import {
  AttachmentType,
  ClinicalNoteAttachmentType,
  ClinicalNoteType,
  MessageAttachmentType,
  MessageExternalType,
  MessageType,
  TodoType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
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
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessageExternal from "../External/MessageExternal";
import EditTodo from "./EditTodo";
import ForwardMessage from "./ForwardMessage";
import ForwardMessageMobile from "./ForwardMessageMobile";
import ForwardTodo from "./ForwardTodo";
import ForwardTodoMobile from "./ForwardTodoMobile";
import Message from "./Message";
import MessageDetailToolbar from "./MessageDetailToolbar";
import MessagesAttachments from "./MessagesAttachments";
import MessagesPrint from "./MessagesPrint";
import NewTodo from "./NewTodo";
import NewTodoMobile from "./NewTodoMobile";
import ReplyMessage from "./ReplyMessage";

type MessageDetailProps = {
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  message: MessageType | TodoType;
  section: string;
  printVisible: boolean;
  setPrintVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const MessageDetail = ({
  setCurrentMsgId,
  message,
  section,
  printVisible,
  setPrintVisible,
}: MessageDetailProps) => {
  //Hooks
  const navigate = useNavigate();
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { messageId } = useParams();
  const { staffInfos } = useStaffInfosContext();
  const [replyVisible, setReplyVisible] = useState(false);
  const [forwardVisible, setForwardVisible] = useState(false);
  const [forwardTodoVisible, setForwardTodoVisible] = useState(false);
  const [editTodoVisible, setEditTodoVisible] = useState(false);
  const [newTodoVisible, setNewTodoVisible] = useState(false);
  const [allPersons, setAllPersons] = useState(false);
  const [posting, setPosting] = useState(false);
  const [addToClinicalNotesVisible, setAddToClinicalNotesVisible] =
    useState(false);
  const messageContentRef = useRef<HTMLDivElement | null>(null);
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
  //Queries
  const {
    data: previousMsgs,
    isPending,
    error,
  } = usePreviousMessages(message, section);
  const messagePut = useMessagePut(user.id, section);
  const todoDelete = useTodoDelete(user.id);
  const clinicalNotePost = useClinicalNotePost();

  useEffect(() => {
    //to hide parameters
    if (messageId) {
      navigate("/staff/messages");
    }
  }, [messageId, navigate]);

  const attachments = message
    ? (message.attachments_ids as { attachment: MessageAttachmentType }[]).map(
        ({ attachment }) => attachment
      )
    : [];

  const handleEdit = () => {
    setEditTodoVisible(true);
  };

  const handleClickBack = () => {
    setCurrentMsgId(0);
  };

  const handleDeleteMsg = async () => {
    if (
      await confirmAlert({
        content: `Do you really want to delete this ${
          section === "To-dos" ? "to-do" : "message"
        } ?`,
      })
    ) {
      if (section === "To-dos") {
        if (message.attachments_ids.length !== 0) {
          try {
            await xanoDeleteBatch(
              "messages_attachments",
              "staff",
              (
                message.attachments_ids as {
                  attachment: MessageAttachmentType;
                }[]
              ).map(({ attachment }) => attachment.id as number)
            );
          } catch (err) {
            if (err instanceof Error)
              toast.error(`Error: unable to delete attachments${err.message}`, {
                containerId: "A",
              });
          }
        }
        todoDelete.mutate(message.id, {
          onSuccess: () => {
            setCurrentMsgId(0);
            if (message.related_patient_id) {
              socket?.emit("message", {
                key: ["patientRecord", message.related_patient_id],
              });
            }
          },
        });
      } else {
        const messageToPut: MessageType = {
          ...(message as MessageType),
          deleted_by_staff_ids: [
            ...(message as MessageType).deleted_by_staff_ids,
            user.id,
          ],
          attachments_ids: (
            message.attachments_ids as { attachment: MessageAttachmentType }[]
          ).map(({ attachment }) => attachment.id as number),
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
    }
  };

  const handleClickReply = () => {
    setReplyVisible(true);
    setAllPersons(false);
  };
  const handleClickReplyAll = () => {
    setReplyVisible(true);
    setAllPersons(true);
  };

  const handleClickForward = () => {
    setForwardVisible(true);
  };
  const handleClickTodo = () => {
    setNewTodoVisible(true);
  };

  const handleClickForwardTodo = () => {
    setForwardTodoVisible(true);
  };

  const handleAddToClinicalNotes = async () => {
    setAddToClinicalNotesVisible(true);
  };

  useEffect(() => {
    if (!addToClinicalNotesVisible || !messageContentRef.current || posting)
      return;

    const addToClinicalNotes = async () => {
      setPosting(true);
      //create the attachment with message content
      if (!messageContentRef.current) return;
      const element = messageContentRef.current;
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2,
      });
      const dataURL = canvas.toDataURL("image/jpeg");
      const formData = new FormData();
      formData.append("content", dataURL);

      let response;
      try {
        response = await axios.post(
          import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } catch (err) {
        setPosting(false);
        if (err instanceof Error)
          toast.error(
            `Unable to add message to patient clinical notes: ${err.message}`,
            {
              containerId: "A",
            }
          );
        return;
      }

      const fileToUpload: AttachmentType = response?.data;
      //post attachment and get id
      const datasAttachment: Partial<ClinicalNoteAttachmentType>[] = [
        {
          file: fileToUpload,
          alias: `Message from: ${staffIdToTitleAndName(
            staffInfos,
            (message as MessageType).from_id
          )} (${timestampToDateTimeSecondsStrTZ(message.date_created)})`,
          date_created: nowTZTimestamp(),
          created_by_id: user.id,
        },
      ];
      const attach_ids: number[] = await xanoPost(
        "/clinical_notes_attachments",
        "staff",
        {
          attachments_array: datasAttachment,
        }
      );
      const clinicalNoteToPost: Partial<ClinicalNoteType> = {
        patient_id: message.related_patient_id,
        subject: `Message from ${staffIdToTitleAndName(
          staffInfos,
          (message as MessageType).from_id
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
          toast.success("Message successfuly added to patient clinical notes", {
            containerId: "A",
          });
          setAddToClinicalNotesVisible(false);
          setPosting(false);
        },
        onError: (error) => {
          toast.error(
            `Unable to add message to patient clinical notes: ${error.message}`,
            { containerId: "A" }
          );
          setAddToClinicalNotesVisible(false);
          setPosting(false);
        },
      });
    };
    addToClinicalNotes();
  }, [
    posting,
    addToClinicalNotesVisible,
    clinicalNotePost,
    message,
    staffInfos,
    user.id,
  ]);

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
        <div className="message__detail-content">
          <Message
            message={message}
            key={message.id}
            index={0}
            section={section}
          />
          {section !== "To-dos" && (
            <>
              {previousMsgs && previousMsgs.length > 0
                ? previousMsgs?.map((message, index) =>
                    message.type === "Internal" ? (
                      <Message
                        message={message as MessageType}
                        key={message.id}
                        index={index + 1}
                        section={section}
                      />
                    ) : (
                      <MessageExternal
                        message={message as MessageExternalType}
                        key={message.id}
                        index={index + 1}
                      />
                    )
                  )
                : null}
            </>
          )}

          {attachments && (
            <MessagesAttachments
              attachments={attachments}
              deletable={false}
              addable={true}
              hasRelatedPatient={message.related_patient_id ? true : false}
              patientName={toPatientName(message.patient_infos)}
              message={message}
            />
          )}
        </div>
        {section !== "Deleted messages" &&
          section !== "To-dos" &&
          !replyVisible &&
          !forwardVisible &&
          !newTodoVisible && (
            <div className="message__detail-btns">
              {section !== "Sent messages" && (
                <Button onClick={handleClickReply} label="Reply" />
              )}
              {(message as MessageType).to_staff_ids.length >= 2 &&
                section !== "Sent messages" && (
                  <Button onClick={handleClickReplyAll} label="Reply all" />
                )}
              <Button onClick={handleClickForward} label="Forward" />
              <Button onClick={handleClickTodo} label="Todo" />
            </div>
          )}
        {section === "To-dos" && (
          <div className="message__detail-btns">
            <Button onClick={handleClickForwardTodo} label="Forward To-do" />
          </div>
        )}
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
            <MessagesPrint
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
            message={message as MessageType}
            previousMsgs={previousMsgs}
            patientName={toPatientName(message.patient_infos)}
            setCurrentMsgId={setCurrentMsgId}
            section={section}
          />
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
            {isTabletOrMobile ? (
              <ForwardMessageMobile
                setForwardVisible={setForwardVisible}
                message={message as MessageType}
                previousMsgs={
                  previousMsgs as (MessageType | MessageExternalType)[]
                }
                patientName={toPatientName(message.patient_infos)}
                section={section}
              />
            ) : (
              <ForwardMessage
                setForwardVisible={setForwardVisible}
                message={message as MessageType}
                previousMsgs={
                  previousMsgs as (MessageType | MessageExternalType)[]
                }
                patientName={toPatientName(message.patient_infos)}
                section={section}
              />
            )}
          </FakeWindow>
        )}
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
            {isTabletOrMobile ? (
              <ForwardTodoMobile
                setForwardTodoVisible={setForwardTodoVisible}
                todo={message as TodoType}
                patientName={toPatientName(message.patient_infos)}
                setCurrentMsgId={setCurrentMsgId}
                section={section}
              />
            ) : (
              <ForwardTodo
                setForwardTodoVisible={setForwardTodoVisible}
                todo={message as TodoType}
                patientName={toPatientName(message.patient_infos)}
                setCurrentMsgId={setCurrentMsgId}
                section={section}
              />
            )}
          </FakeWindow>
        )}
        {newTodoVisible && (
          <FakeWindow
            title="NEW TO-DO"
            width={1024}
            height={620}
            x={(window.innerWidth - 1024) / 2}
            y={(window.innerHeight - 620) / 2}
            color={"#94bae8"}
            setPopUpVisible={setNewTodoVisible}
          >
            {isTabletOrMobile ? (
              <NewTodoMobile
                setNewTodoVisible={setNewTodoVisible}
                initialPatient={{
                  id: message.related_patient_id || 0,
                  name: toPatientName(message.patient_infos),
                }}
                initialAttachments={attachments}
                initialBody={message.body}
              />
            ) : (
              <NewTodo
                setNewTodoVisible={setNewTodoVisible}
                initialPatient={{
                  id: message.related_patient_id || 0,
                  name: toPatientName(message.patient_infos),
                }}
                initialAttachments={attachments}
                initialBody={message.body}
              />
            )}
          </FakeWindow>
        )}
        {addToClinicalNotesVisible && (
          <div ref={messageContentRef}>
            <MessagesPrint
              message={message}
              previousMsgs={previousMsgs}
              attachments={attachments}
              section={section}
              printButton={false}
            />
          </div>
        )}
      </>
    )
  );
};

export default MessageDetail;
