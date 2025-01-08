import axios from "axios";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import { xanoPost } from "../../../../api/xanoCRUD/xanoPost";
import useClinicContext from "../../../../hooks/context/useClinicContext";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessageExternalPost } from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  DemographicsType,
  EdocType,
  MessageAttachmentType,
  MessageExternalTemplateType,
  MessageExternalType,
  PamphletType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { handleUploadAttachment } from "../../../../utils/files/handleUploadAttachment";
import { toEmailAlertPatientText } from "../../../../utils/messages/toEmailAlertPatientText";
import { toSMSAlertPatientText } from "../../../../utils/messages/toSMSAlertPatientText";
import { toPatientName } from "../../../../utils/names/toPatientName";
import { formatToE164Canadian } from "../../../../utils/phone/formatToE164Canadian";
import AttachEdocsPamphletsButton from "../../../UI/Buttons/AttachEdocsPamphletsButton";
import AttachFilesButton from "../../../UI/Buttons/AttachFilesButton";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import Input from "../../../UI/Inputs/Input";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import AddEdocsPamphlets from "../Internal/AddEdocsPamphlets";
import MessagesAttachments from "../Internal/MessagesAttachments";
import Patients from "../Patients";
import MessagesExternalTemplates from "./Templates/MessagesExternalTemplates";
axios.defaults.withCredentials = true;

type NewMessageExternalMobileProps = {
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initialRecipients?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  }[];
  initialAttachments?: Partial<MessageAttachmentType>[];
};

const NewMessageExternalMobile = ({
  setNewVisible,
  initialRecipients = [],
  initialAttachments = [],
}: NewMessageExternalMobileProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { clinic } = useClinicContext();
  const [attachments, setAttachments] = useState(initialAttachments);
  const [edocs, setEdocs] = useState<EdocType[]>([]);
  const [pamphlets, setPamphlets] = useState<PamphletType[]>([]);
  const [recipients, setRecipients] = useState(initialRecipients);
  const [allPatientsChecked, setAllPatientsChecked] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [important, setImportant] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [addEdocsPamphletsVisible, setAddEdocsPamphletsVisible] =
    useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recipientsRef = useRef<HTMLDivElement | null>(null);
  //Queries
  const messagePost = useMessageExternalPost();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleImportanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setImportant(value);
  };

  const handleChangeSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleSelectTemplate = (template: MessageExternalTemplateType) => {
    if (template.subject) setSubject(template.subject);
    setBody((b) =>
      b ? b + "\n\n" + template.body + "\n" : template.body + "\n"
    );
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  };

  const isPatientChecked = (patientId: number) =>
    recipients.find(({ id }) => id === patientId) ? true : false;

  const handleCheckPatient = (
    e: React.ChangeEvent<HTMLInputElement>,
    info: DemographicsType
  ) => {
    const checked = e.target.checked;
    if (checked) {
      setRecipients([
        ...recipients,
        {
          id: info.patient_id,
          name: toPatientName(info),
          email: info.Email,
          phone:
            info.PhoneNumber?.find(
              ({ _phoneNumberType }) => _phoneNumberType === "C"
            )?.phoneNumber || "",
        },
      ]);
    } else {
      setAllPatientsChecked(false);
      setRecipients(recipients.filter(({ id }) => id !== info.patient_id));
    }
  };

  const handleCheckAllPatients = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    if (checked) {
      try {
        const allPatients: DemographicsType[] = await xanoGet(
          "/demographics",
          "staff"
        );
        setRecipients(
          allPatients.map((demographicsInfos) => {
            return {
              id: demographicsInfos.patient_id,
              name: toPatientName(demographicsInfos),
              email: demographicsInfos.Email,
              phone:
                demographicsInfos.PhoneNumber?.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "C"
                )?.phoneNumber || "",
            };
          })
        );
        setAllPatientsChecked(true);
      } catch {
        toast.error("Error: unable to load all patients", { containerId: "A" });
      }
    } else {
      setRecipients([]);
      setAllPatientsChecked(false);
    }
  };

  const handleCancel = () => {
    setNewVisible(false);
  };

  const handleRemoveAttachment = (fileName: string) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file?.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  const handleSend = async () => {
    if (!recipients.length) {
      toast.error("Please choose at least one recipient", { containerId: "A" });
      return;
    }
    setProgress(true);
    const attachmentsToPost: Partial<MessageAttachmentType>[] = [
      ...attachments,
      ...(edocs.map((edoc) => ({
        file: edoc.file,
        alias: edoc.name,
        date_created: nowTZTimestamp(),
        created_by_user_type: "staff",
        created_by_id: user.id,
      })) as Partial<MessageAttachmentType>[]),
      ...(pamphlets.map((pamphlet) => ({
        file: pamphlet.file,
        alias: pamphlet.name,
        date_created: nowTZTimestamp(),
        created_by_user_type: "staff",
        created_by_id: user.id,
      })) as Partial<MessageAttachmentType>[]),
    ];
    let attach_ids = [];
    if (attachmentsToPost.length > 0) {
      attach_ids = await xanoPost("/messages_attachments", "staff", {
        attachments_array: attachmentsToPost,
      });
    }
    const messageToPost: Partial<MessageExternalType> = {
      from_staff_id: user.id,
      to_patients_ids: recipients.map(({ id }) => id),
      read_by_staff_id: user.id,
      subject: subject,
      body: body,
      attachments_ids: attach_ids,
      date_created: nowTZTimestamp(),
      high_importance: important,
    };
    messagePost.mutate(messageToPost, {
      onSuccess: async () => {
        setNewVisible(false);
        const emailsToPost: { to: string; subject: string; text: string }[] =
          [];
        const patientsSMSToPost: { to: string; body: string }[] = [];

        for (const recipient of recipients) {
          socket?.emit("message", {
            route: "UNREAD EXTERNAL",
            action: "update",
            content: {
              userId: recipient.id,
            },
          });
          const recipientPhone = formatToE164Canadian(recipient.phone ?? "");
          const emailToPost = {
            to: recipient.email,
            subject: `${clinic?.name ?? ""} - New message - DO NOT REPLY`,
            text: toEmailAlertPatientText(recipient.name),
          };
          const smsToPost = {
            from: clinic?.name ?? "",
            to: recipientPhone,
            body: toSMSAlertPatientText(recipient.name),
          };
          emailsToPost.push(emailToPost);
          patientsSMSToPost.push(smsToPost);
        }
        //EMAIL ALERT
        try {
          await Promise.all(
            emailsToPost.map((email) => axios.post(`/api/mailgun`, email))
          );
          await Promise.all(
            patientsSMSToPost.map((sms) =>
              axios({
                url: `/api/twilio`,
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                data: sms,
              })
            )
          );
        } catch (err) {
          if (err instanceof Error)
            toast.error(`Error: unable to send alerts to patients`, {
              containerId: "A",
            });
        } finally {
          setProgress(false);
        }
      },
    });
  };

  const handleAttach = () => {
    handleUploadAttachment(
      setIsLoadingFile,
      attachments,
      setAttachments,
      user,
      "messages_external_attachment_"
    );
  };

  const handleClickRecipients = () => {
    if (recipientsRef.current) {
      recipientsRef.current.style.transform = "translateX(0)";
    }
  };

  const handleRemoveEdoc = (edocId: number) => {
    setEdocs(edocs.filter(({ id }) => id !== edocId));
  };
  const handleRemovePamphlet = (pamphletId: number) => {
    setPamphlets(pamphlets.filter(({ id }) => id !== pamphletId));
  };
  const handleEdocsPamphlets = () => {
    setAddEdocsPamphletsVisible((v) => !v);
  };

  return (
    <div className="new-message-mobile">
      <div className="new-message-mobile__form">
        <div
          className="new-message__form-recipients"
          onClick={handleClickRecipients}
        >
          <Input
            value={recipients.map(({ name }) => name).join(" / ")}
            id="to"
            label="To:"
            readOnly={true}
            placeholder="Patient(s)"
          />
        </div>
        <div className="new-message__form-subject">
          <Input
            value={subject}
            id="subject"
            onChange={handleChangeSubject}
            label="Subject:"
            placeholder="Subject"
          />
        </div>
        <div className="new-message__form-attach">
          <AttachFilesButton onClick={handleAttach} attachments={attachments} />
        </div>
        <div className="new-message__form-attach">
          <AttachEdocsPamphletsButton
            onClick={handleEdocsPamphlets}
            edocs={edocs}
            pamphlets={pamphlets}
          />
        </div>
        <div className="new-message__form-importance">
          <div className="new-message__form-importance-check">
            <Checkbox
              name="high_importance"
              id="importance"
              onChange={handleImportanceChange}
              checked={important}
              label="High importance"
            />
          </div>
          <div>
            <strong
              onClick={() => setTemplatesVisible((v) => !v)}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Use Template
            </strong>
          </div>
        </div>
        <div className="new-message__form-body">
          <textarea value={body} onChange={handleChange} ref={textareaRef} />
          {(attachments.length > 0 ||
            edocs.length > 0 ||
            pamphlets.length > 0) && (
            <MessagesAttachments
              attachments={attachments}
              edocs={edocs}
              pamphlets={pamphlets}
              handleRemoveAttachment={handleRemoveAttachment}
              handleRemoveEdoc={handleRemoveEdoc}
              handleRemovePamphlet={handleRemovePamphlet}
              deletable={true}
              addable={false}
              cardWidth="30%"
            />
          )}
        </div>
        <div className="new-message__form-btns">
          <SaveButton
            onClick={handleSend}
            disabled={isLoadingFile || progress}
            label="Send"
          />
          <CancelButton onClick={handleCancel} disabled={progress} />
          {isLoadingFile && <CircularProgressMedium />}
        </div>
      </div>
      <div className="new-message-mobile__patients" ref={recipientsRef}>
        <Patients
          handleCheckPatient={handleCheckPatient}
          isPatientChecked={isPatientChecked}
          msgType="External"
          allAvailable={true}
          allPatientsChecked={allPatientsChecked}
          handleCheckAllPatients={handleCheckAllPatients}
          closeCross={true}
          patientsRef={recipientsRef}
        />
      </div>
      {templatesVisible && (
        <FakeWindow
          title={`CHOOSE EXTERNAL MESSAGE TEMPLATE(S)`}
          width={800}
          height={600}
          x={window.innerWidth - 800}
          y={0}
          color="#8fb4fb"
          setPopUpVisible={setTemplatesVisible}
        >
          <MessagesExternalTemplates
            handleSelectTemplate={handleSelectTemplate}
          />
        </FakeWindow>
      )}
      {addEdocsPamphletsVisible && (
        <FakeWindow
          title={`CHOOSE EDOCS/PAMPHLETS TO SEND`}
          width={800}
          height={window.innerHeight}
          x={window.innerWidth - 800}
          y={0}
          color="#8fb4fb"
          setPopUpVisible={setAddEdocsPamphletsVisible}
        >
          <AddEdocsPamphlets
            edocs={edocs}
            pamphlets={pamphlets}
            setEdocs={setEdocs}
            setPamphlets={setPamphlets}
            setAddEdocsPamphletsVisible={setAddEdocsPamphletsVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default NewMessageExternalMobile;
