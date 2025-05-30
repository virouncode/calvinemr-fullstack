import { useMediaQuery } from "@mui/material";
import axios from "axios";
import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { xanoPost } from "../../../../api/xanoCRUD/xanoPost";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  useClinicalNotePost,
  useClinicalNotesPost,
} from "../../../../hooks/reactquery/mutations/clinicalNotesMutations";
import { useMessageExternalPut } from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  AttachmentType,
  ClinicalNoteAttachmentType,
  ClinicalNoteType,
  DemographicsType,
  MessageAttachmentType,
  MessageExternalType,
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
import FakeWindow from "../../../UI/Windows/FakeWindow";
import NewTodo from "../Internal/NewTodo";
import NewTodoMobile from "../Internal/NewTodoMobile";
import ForwardMessageExternal from "./ForwardMessageExternal";
import ForwardMessageExternalMobile from "./ForwardMessageExternalMobile";
import MessageExternal from "./MessageExternal";
import MessageExternalDetailToolbar from "./MessageExternalDetailToolbar";
import MessagesExternalAttachments from "./MessagesExternalAttachments";
import MessagesExternalPrint from "./MessagesExternalPrint";
import ReplyMessageExternal from "./ReplyMessageExternal";

type MessageExternalDetailProps = {
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  message: MessageExternalType | undefined;
  section: string;
  printVisible: boolean;
  setPrintVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const MessageExternalDetail = ({
  setCurrentMsgId,
  message,
  section,
  printVisible,
  setPrintVisible,
}: MessageExternalDetailProps) => {
  //Hooks
  const navigate = useNavigate();
  const { user } = useUserContext() as { user: UserStaffType };
  const { messageId } = useParams();
  const { staffInfos } = useStaffInfosContext();
  const [replyVisible, setReplyVisible] = useState(false);
  const [forwardVisible, setForwardVisible] = useState(false);
  const [newTodoVisible, setNewTodoVisible] = useState(false);
  const [posting, setPosting] = useState(false);
  const [addToClinicalNotesVisible, setAddToClinicalNotesVisible] =
    useState(false);
  const messageContentRef = useRef<HTMLDivElement | null>(null);
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
  //Queries
  const messagePut = useMessageExternalPut();
  const clinicalNotePost = useClinicalNotePost();
  const clinicalNotesPost = useClinicalNotesPost();

  useEffect(() => {
    //to hide parameters
    if (messageId) {
      navigate("/staff/messages");
    }
  }, [messageId, navigate]);

  const previousMsgs = (
    message?.previous_messages_ids as {
      previous_message: MessageExternalType;
    }[]
  )
    .map(({ previous_message }) => previous_message)
    .sort((a, b) => b.date_created - a.date_created);

  const attachments = (
    (message?.attachments_ids as { attachment: MessageAttachmentType }[]) ?? []
  ).map(({ attachment }) => attachment);

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
      const messageToPut: MessageExternalType = {
        ...(message as MessageExternalType),
        deleted_by_staff_id: user.id,
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

  useEffect(() => {
    if (!addToClinicalNotesVisible || !messageContentRef.current || posting)
      return;
    const addToClinicalNotes = async () => {
      setPosting(true);
      //create the attachment with message content
      const element = messageContentRef.current;
      if (!element) return;
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
        if (err instanceof Error) {
          setPosting(false);
          toast.error(
            `Unable to add message to patient clinical notes: ${err.message}`,
            { containerId: "A" }
          );
          return;
        }
      }
      const fileToUpload: AttachmentType = response?.data;
      if (section === "Received messages") {
        //post attachment and get id
        const datasAttachment: Partial<ClinicalNoteAttachmentType>[] = [
          {
            file: fileToUpload,
            alias: `Message from: ${toPatientName(
              message?.from_patient_infos
            )} (${timestampToDateTimeSecondsStrTZ(message?.date_created)})`,
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
          patient_id: message?.from_patient_id,
          subject: `Message from: ${toPatientName(
            message?.from_patient_infos
          )} (${timestampToDateTimeSecondsStrTZ(message?.date_created)})`,
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
            setAddToClinicalNotesVisible(false);
            setPosting(false);
            toast.success(
              "Message successfuly added to patient clinical notes",
              {
                containerId: "A",
              }
            );
          },
          onError: (error) => {
            setAddToClinicalNotesVisible(false);
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
              message?.from_staff_id
            )} (${timestampToDateTimeSecondsStrTZ(message?.date_created)})`,
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
        const clinicalNotesToPost: Partial<ClinicalNoteType>[] = [];
        for (const patientId of (
          message?.to_patients_ids as { to_patient_infos: DemographicsType }[]
        ).map(({ to_patient_infos }) => to_patient_infos.patient_id)) {
          const clinicalNoteToPost: Partial<ClinicalNoteType> = {
            patient_id: patientId,
            subject: `Message from: ${staffIdToTitleAndName(
              staffInfos,
              message?.from_staff_id
            )} (${timestampToDateTimeSecondsStrTZ(message?.date_created)})`,
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
          clinicalNotesToPost.push(clinicalNoteToPost);
        }
        clinicalNotesPost.mutate(clinicalNotesToPost, {
          onSuccess: () => {
            setAddToClinicalNotesVisible(false);
            setPosting(false);
            toast.success(
              "Message successfuly added to patients clinical notes",
              {
                containerId: "A",
              }
            );
          },
          onError: (error) => {
            setAddToClinicalNotesVisible(false);
            setPosting(false);
            toast.error(
              `Unable to add message to patients clinical notes: ${error.message}`,
              { containerId: "A" }
            );
          },
        });
      }
    };
    addToClinicalNotes();
  }, [
    addToClinicalNotesVisible,
    clinicalNotePost,
    clinicalNotesPost,
    message?.date_created,
    message?.from_patient_id,
    message?.from_patient_infos,
    message?.from_staff_id,
    message?.to_patients_ids,
    posting,
    section,
    staffInfos,
    user.id,
  ]);

  const handleAddToClinicalNotes = async () => {
    setAddToClinicalNotesVisible(true);
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
        <div className="message__detail-content">
          <div ref={messageContentRef}>
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
          </div>
          {attachments && (
            <MessagesExternalAttachments
              attachments={attachments}
              deletable={false}
              addable={true}
              patientsNames={
                message.from_patient_id
                  ? [toPatientName(message.from_patient_infos)]
                  : (
                      message.to_patients_ids as {
                        to_patient_infos: DemographicsType;
                      }[]
                    ).map(({ to_patient_infos }) =>
                      toPatientName(to_patient_infos)
                    )
              }
              message={message}
            />
          )}
        </div>
        {section !== "Deleted messages" && !replyVisible && (
          <div className="message__detail-btns">
            {section !== "Sent messages" && (
              <Button onClick={handleClickReply} label="Reply" />
            )}
            <Button onClick={handleClickForward} label="Forward" />
            <Button onClick={handleClickTodo} label="Todo" />
          </div>
        )}
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
          <ReplyMessageExternal
            setReplyVisible={setReplyVisible}
            message={message}
            previousMsgs={previousMsgs}
            setCurrentMsgId={setCurrentMsgId}
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
              <ForwardMessageExternalMobile
                setForwardVisible={setForwardVisible}
                message={message}
                previousMsgs={previousMsgs}
                patientName={
                  message.from_patient_id
                    ? toPatientName(message.from_patient_infos)
                    : ""
                }
                section={section}
              />
            ) : (
              <ForwardMessageExternal
                setForwardVisible={setForwardVisible}
                message={message}
                previousMsgs={previousMsgs}
                patientName={
                  message.from_patient_id
                    ? toPatientName(message.from_patient_infos)
                    : ""
                }
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
                  id: message.from_patient_id || 0,
                  name: toPatientName(message.from_patient_infos),
                }}
                initialAttachments={attachments}
                initialBody={message.body}
              />
            ) : (
              <NewTodo
                setNewTodoVisible={setNewTodoVisible}
                initialPatient={{
                  id: message.from_patient_id || 0,
                  name: toPatientName(message.from_patient_infos),
                }}
                initialAttachments={attachments}
                initialBody={message.body}
              />
            )}
          </FakeWindow>
        )}
        {addToClinicalNotesVisible && (
          <div ref={messageContentRef}>
            <MessagesExternalPrint
              message={message}
              previousMsgs={previousMsgs}
              attachments={attachments}
              printButton={false}
            />
          </div>
        )}
      </>
    )
  );
};

export default MessageExternalDetail;
