import axios from "axios";
import { uniqueId } from "lodash";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useClinicContext from "../../../../hooks/context/useClinicContext";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessageExternalPost } from "../../../../hooks/reactquery/mutations/messagesMutations";
import {
  AttachmentType,
  DemographicsType,
  MessageAttachmentType,
  MessageExternalTemplateType,
  MessageExternalType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../utils/names/toPatientName";
import AttachFilesButton from "../../../UI/Buttons/AttachFilesButton";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import Input from "../../../UI/Inputs/Input";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessagesAttachments from "../Internal/MessagesAttachments";
import Patients from "../Patients";
import MessagesExternalTemplates from "./Templates/MessagesExternalTemplates";

axios.defaults.withCredentials = true;

type NewMessageExternalProps = {
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initialRecipients?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  }[];
  initialAttachments?: Partial<MessageAttachmentType>[];
};

const NewMessageExternal = ({
  setNewVisible,
  initialRecipients = [],
  initialAttachments = [],
}: NewMessageExternalProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { clinic } = useClinicContext();
  const [attachments, setAttachments] = useState(initialAttachments);
  const [recipients, setRecipients] = useState(initialRecipients);
  const [allPatientsChecked, setAllPatientsChecked] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [important, setImportant] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
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
    let attach_ids = [];
    if (attachments.length > 0) {
      attach_ids = await xanoPost("/messages_attachments", "staff", {
        attachments_array: attachments,
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
      onSuccess: () => {
        setProgress(false);
        setNewVisible(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
    for (const recipient of recipients) {
      socket?.emit("message", {
        route: "UNREAD EXTERNAL",
        action: "update",
        content: {
          userId: recipient.id,
        },
      });
      //EMAIL ALERT
      try {
        await axios.post(`/api/mailgun`, {
          to: recipient.email, //to be changed to patient email
          subject: `${clinic?.name ?? ""} - New message - DO NO REPLY`,
          text: `
Hello ${recipient.name},

You have a new message, please login to your patient portal.

Please do not reply to this email, as this address is automated and not monitored. 

Best wishes, 
Powered by CalvinEMR`,
        });
      } catch (err) {
        if (err instanceof Error)
          toast.error(
            `Error: unable to send email alert to ${recipient.name}: ${err.message}`,
            {
              containerId: "A",
            }
          );
      }
      //SMS ALERT
      try {
        await axios({
          url: `/api/twilio`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            from: clinic?.name ?? "",
            to: "+33683267962", //to be changed to patient cell_phone
            body: `
Hello ${recipient.name},
          
You have a new message, please login to your patient portal.

Please do not reply to this sms, as this number is automated and not monitored. 
          
Best wishes,
Powered by Calvin EMR`,
          },
        });
        setProgress(false);
      } catch (err) {
        if (err instanceof Error)
          toast.error(
            `Error: unable to send SMS alert to ${recipient.name}: ${err.message}`,
            {
              containerId: "A",
            }
          );
        setProgress(false);
      }
    }
    setProgress(false);
  };

  const handleAttach = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const input = e.nativeEvent.view?.document.createElement(
      "input"
    ) as HTMLInputElement;
    input.type = "file";
    input.accept = ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg";
    // ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx";
    input.onchange = (event) => {
      // getting a hold of the file reference
      const e = event as unknown as React.ChangeEvent<HTMLInputElement>;
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 25000000) {
          toast.error(
            "The file is over 25Mb, please choose another one or send a link",
            { containerId: "A" }
          );
          return;
        }
        setIsLoadingFile(true);
        // setting up the reader`
        const reader = new FileReader();
        reader.readAsDataURL(file);
        // here we tell the reader what to do when it's done reading...
        reader.onload = async (e) => {
          const content = e.target?.result; // this is the content!
          try {
            const response: AttachmentType = await xanoPost(
              "/upload/attachment",
              "staff",
              { content }
            );
            if (!response.type) response.type = "document";
            setAttachments([
              ...attachments,
              {
                file: response,
                alias: file.name,
                date_created: nowTZTimestamp(),
                created_by_id: user.id,
                created_by_user_type: "staff",
                id: uniqueId("messages_external_attachment_"),
              },
            ]); //meta, mime, name, path, size, type
            setIsLoadingFile(false);
          } catch (err) {
            if (err instanceof Error)
              toast.error(`Error: unable to load file: ${err.message}`, {
                containerId: "A",
              });
            setIsLoadingFile(false);
          }
        };
      }
    };
    input.click();
  };

  return (
    <div className="new-message">
      <div className="new-message__form">
        <div className="new-message__recipients">
          <Input
            value={recipients.map(({ name }) => name).join(" / ")}
            id="to"
            label="To:"
            readOnly={true}
            placeholder="Patient(s)"
          />
        </div>
        <div className="new-message__subject">
          <Input
            value={subject}
            id="subject"
            onChange={handleChangeSubject}
            label="Subject:"
            placeholder="Subject"
          />
        </div>
        <div className="new-message__attach">
          <AttachFilesButton onClick={handleAttach} attachments={attachments} />
        </div>
        <div className="new-message__importance">
          <div className="new-message__importance-check">
            <Checkbox
              name="high_importance"
              id="importance"
              onChange={handleImportanceChange}
              checked={important}
              label="High importance"
            />
            import MessagesExternalTemplates from
            './Templates/MessagesExternalTemplates';
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
        <div className="new-message__body">
          <textarea
            value={body}
            onChange={handleChange}
            ref={textareaRef}
            autoFocus
          />
          <MessagesAttachments
            attachments={attachments}
            deletable={true}
            addable={false}
            handleRemoveAttachment={handleRemoveAttachment}
          />
        </div>
        <div className="new-message__btns">
          <SaveButton
            onClick={handleSend}
            disabled={isLoadingFile || progress}
            label="Send"
          />
          <CancelButton onClick={handleCancel} disabled={progress} />
          {isLoadingFile && <CircularProgressMedium />}
        </div>
      </div>
      <div className="new-message__patients">
        <Patients
          handleCheckPatient={handleCheckPatient}
          isPatientChecked={isPatientChecked}
          msgType="External"
          allAvailable={true}
          allPatientsChecked={allPatientsChecked}
          handleCheckAllPatients={handleCheckAllPatients}
        />
      </div>

      {templatesVisible && (
        <FakeWindow
          title={`CHOOSE EXTERNAL MESSAGE TEMPLATE(S)`}
          width={800}
          height={600}
          x={window.innerWidth - 800}
          y={0}
          color="#93b5e9"
          setPopUpVisible={setTemplatesVisible}
        >
          <MessagesExternalTemplates
            handleSelectTemplate={handleSelectTemplate}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default NewMessageExternal;
