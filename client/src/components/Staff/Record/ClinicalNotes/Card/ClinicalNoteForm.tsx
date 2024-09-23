import { uniqueId } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { xanoPost } from "../../../../../api/xanoCRUD/xanoPost";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useClinicalNotePost } from "../../../../../hooks/reactquery/mutations/clinicalNotesMutations";
import { useSpeechRecognition } from "../../../../../hooks/useSpeechRecognition";
import {
  AttachmentType,
  ClinicalNoteAttachmentType,
  ClinicalNoteFormType,
  ClinicalNoteTemplateType,
  DemographicsType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { isChromeBrowser } from "../../../../../utils/browsers/isChromeBrowser";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../../utils/names/staffIdToName";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import { clinicalNoteSchema } from "../../../../../validation/record/clinicalNoteValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import MicrophoneIcon from "../../../../UI/Icons/MicrophoneIcon";
import PaperclipIcon from "../../../../UI/Icons/PaperclipIcon";
import Input from "../../../../UI/Inputs/Input";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import ClinicalNotesTemplates from "../Templates/ClinicalNotesTemplates";
import ClinicalNoteAttachments from "./ClinicalNoteAttachments";

type ClinicalNoteFormProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  demographicsInfos: DemographicsType;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
  newClinicalNoteInMemory: ClinicalNoteFormType | null;
  setNewClinicalNoteInMemory: React.Dispatch<
    React.SetStateAction<ClinicalNoteFormType | null>
  >;
};

const ClinicalNoteForm = ({
  setAddVisible,
  patientId,
  demographicsInfos,
  formRef,
  newClinicalNoteInMemory,
  setNewClinicalNoteInMemory,
}: ClinicalNoteFormProps) => {
  //Hooks
  const navigate = useNavigate();
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState<ClinicalNoteFormType>(
    newClinicalNoteInMemory ?? {
      patient_id: patientId,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
      subject: "Clinical note",
      MyClinicalNotesContent: "",
      ParticipatingProviders: [
        {
          Name: { FirstName: user.first_name, LastName: user.last_name },
          OHIPPhysicianId: user.ohip_billing_nbr,
          DateTimeNoteCreated: nowTZTimestamp(),
        },
      ],
      version_nbr: 1,
      attachments_ids: [],
    }
  );
  const [inputText, setInputText] = useState(
    newClinicalNoteInMemory
      ? newClinicalNoteInMemory.MyClinicalNotesContent
      : ""
  );
  const [attachments, setAttachments] = useState<ClinicalNoteAttachmentType[]>(
    []
  );
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inputTextBeforeSpeech = useRef(
    newClinicalNoteInMemory
      ? newClinicalNoteInMemory.MyClinicalNotesContent
      : ""
  );
  //Queries
  const clinicalNotePost = useClinicalNotePost();

  useEffect(() => {
    if (textareaRef.current && !isTyping) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [isTyping, formDatas.MyClinicalNotesContent]);

  const { isListening, setIsListening, recognition } = useSpeechRecognition(
    setInputText,
    inputTextBeforeSpeech,
    formDatas
  );

  //HANDLERS
  const handleCancelClick = async () => {
    handleStopSpeech();
    setErrMsg("");
    if (
      await confirmAlert({
        content: "Do you really want to cancel ? Your changes won't be saved",
      })
    ) {
      setInputText("");
      inputTextBeforeSpeech.current = "";
      localStorage.removeItem("currentNewClinicalNote");
      setNewClinicalNoteInMemory(null);
      setAddVisible(false);
    }
  };
  const handleSubmit = async () => {
    handleStopSpeech();
    setErrMsg("");
    const attach_ids: number[] = await xanoPost(
      "/clinical_notes_attachments",
      "staff",
      { attachments_array: attachments }
    );
    const clinicalNoteToPost: ClinicalNoteFormType = {
      ...formDatas,
      attachments_ids: attach_ids,
      MyClinicalNotesContent: inputText,
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
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await clinicalNoteSchema.validate(clinicalNoteToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    clinicalNotePost.mutate(clinicalNoteToPost, {
      onSuccess: () => {
        setAddVisible(false);
        localStorage.removeItem("currentNewClinicalNote");
      },
    });
  };

  const handleSaveSignBillClick = async () => {
    handleStopSpeech();
    const attach_ids: number[] = await xanoPost(
      "/clinical_notes_attachments",
      "staff",
      { attachments_array: attachments }
    );
    const clinicalNoteToPost: ClinicalNoteFormType = {
      ...formDatas,
      attachments_ids: attach_ids,
      MyClinicalNotesContent: inputText,
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
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await clinicalNoteSchema.validate(clinicalNoteToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    clinicalNotePost.mutate(clinicalNoteToPost, {
      onSuccess: () => {
        setAddVisible(false);
        localStorage.removeItem("currentNewClinicalNote");
        navigate(
          `/staff/billing/${patientId}/${toPatientName(demographicsInfos)}/${
            demographicsInfos.HealthCard?.Number
          }/${nowTZTimestamp()}`
        );
      },
      onError: (err) => {
        toast.error(`Error: unable to save clinical note: ${err.message}`, {
          containerId: "A",
        });
      },
    });
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
    setIsTyping(true);
    localStorage.setItem(
      "currentNewClinicalNote",
      JSON.stringify({ ...formDatas, [name]: value })
    );
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setErrMsg("");
    setInputText(value);
    inputTextBeforeSpeech.current = value;
    localStorage.setItem(
      "currentNewClinicalNote",
      JSON.stringify({ ...formDatas, MyClinicalNotesContent: value })
    );
  };

  const handleAttach = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg";
    // ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx";
    input.onchange = (event) => {
      // getting a hold of the file reference
      const e = event as unknown as React.ChangeEvent<HTMLInputElement>;
      const file = e.target.files?.[0];
      if (!file) return;
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
              id: uniqueId("clinical_attachment_"),
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
    };
    input.click();
  };

  const handleRemoveAttachment = (fileName: string) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  const handleSelectTemplate = (template: ClinicalNoteTemplateType) => {
    setErrMsg("");
    setIsTyping(false);
    setInputText(inputText + (inputText ? "\n\n" : "") + template.body + "\n");
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        (inputText + (inputText ? "\n\n" : "") + template.body + "\n").length,
        (inputText + (inputText ? "\n\n" : "") + template.body + "\n").length
      );
      inputTextBeforeSpeech.current =
        inputText + (inputText ? "\n\n" : "") + template.body + "\n";
    }
  };

  const handleStartSpeech = () => {
    if (!isChromeBrowser())
      toast.info("We recommend using Chrome for better speech recognition", {
        containerId: "A",
      });
    if (recognition) {
      setErrMsg("");
      setIsListening(true);
      recognition.start();
    }
  };

  const handleStopSpeech = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };

  return (
    <>
      <form className="clinical-notes__form" ref={formRef}>
        <div className="clinical-notes__form-header">
          <div className="clinical-notes__form-header-row">
            <div className="clinical-notes__form-header-author">
              <p>
                <strong>From: </strong>
                {staffIdToTitleAndName(staffInfos, user.id)}
              </p>
            </div>
            <div className="clinical-notes__form-header-template">
              <label style={{ textDecoration: "underline", cursor: "pointer" }}>
                <strong onClick={() => setTemplatesVisible(true)}>
                  Use template
                </strong>
              </label>
              {templatesVisible && (
                <FakeWindow
                  title={`CLINICAL NOTES TEMPLATES`}
                  width={500}
                  height={600}
                  x={window.innerWidth - 500}
                  y={0}
                  color="#93b5e9"
                  setPopUpVisible={setTemplatesVisible}
                >
                  <ClinicalNotesTemplates
                    handleSelectTemplate={handleSelectTemplate}
                  />
                </FakeWindow>
              )}
            </div>
          </div>
          <div className="clinical-notes__form-header-row">
            <div className="clinical-notes__form-header-subject">
              <Input
                value={formDatas.subject ?? ""}
                onChange={handleChange}
                name="subject"
                id="clinical-form-subject"
                label="Subject:"
                autoFocus={true}
              />
            </div>
            <div>
              <label>
                <strong>Attach files </strong>
              </label>
              <PaperclipIcon onClick={handleAttach} />
            </div>
          </div>
        </div>
        <div className="clinical-notes__form-body">
          {errMsg && <ErrorParagraph errorMsg={errMsg} />}
          {isListening ? (
            <MicrophoneIcon
              onClick={handleStopSpeech}
              color="red"
              top={10}
              right={30}
            />
          ) : (
            <MicrophoneIcon
              onClick={handleStartSpeech}
              color="black"
              top={10}
              right={30}
            />
          )}
          <textarea
            onChange={handleChangeText}
            value={inputText}
            autoFocus
            ref={textareaRef}
          />
          {attachments.length > 0 && (
            <ClinicalNoteAttachments
              attachments={attachments}
              handleRemoveAttachment={handleRemoveAttachment}
              deletable={true}
              addable={false}
              patientId={patientId}
              date={nowTZTimestamp()}
            />
          )}
        </div>
        <div className="clinical-notes__form-btns">
          <SaveButton
            disabled={isLoadingFile}
            onClick={handleSaveSignBillClick}
            label="Save & Sign & Bill"
          />
          <SaveButton
            disabled={isLoadingFile}
            onClick={handleSubmit}
            label="Save & Sign"
          />
          <CancelButton onClick={handleCancelClick} />
          {isLoadingFile && <CircularProgressMedium />}
        </div>
      </form>
    </>
  );
};

export default ClinicalNoteForm;
