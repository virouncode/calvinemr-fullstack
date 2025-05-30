import axios from "axios";
import { uniqueId } from "lodash";
import React, { useRef, useState } from "react";
import ReactQuill, { DeltaStatic, EmitterSource } from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import xanoGet from "../../../../../api/xanoCRUD/xanoGet";
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
  ClinicalNoteType,
  DemographicsType,
  DoctorType,
  XanoPaginatedType,
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
import PaperclipIcon from "../../../../UI/Icons/PaperclipIcon";
import Input from "../../../../UI/Inputs/Input";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import ClinicalNotesTemplates from "../Templates/ClinicalNotesTemplates";
import ClinicalNoteFormBody from "./ClinicalNoteFormBody";

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
  const quillRef = useRef<ReactQuill | null>(null);
  const [attachments, setAttachments] = useState<ClinicalNoteAttachmentType[]>(
    []
  );
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const inputTextBeforeSpeech = useRef(
    newClinicalNoteInMemory
      ? newClinicalNoteInMemory.MyClinicalNotesContent
      : ""
  );
  //Queries
  const clinicalNotePost = useClinicalNotePost();

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
        localStorage.removeItem("currentNewClinicalNote");
        setAddVisible(false);
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
    //Get referrer_ohip
    let referrer_ohip = "";
    try {
      const response: XanoPaginatedType<DoctorType> = await xanoGet(
        "/doctors_of_patient",
        "staff",
        {
          patient_id: patientId,
          page: 1,
        }
      );
      const patientDoctors = response?.items;
      referrer_ohip = patientDoctors.length
        ? patientDoctors[0].ohip_billing_nbr
        : "";
    } catch (err) {
      if (err instanceof Error)
        console.log(`Unable to get referrer_ohip: ${err.message}`);
    }

    clinicalNotePost.mutate(clinicalNoteToPost, {
      onSuccess: () => {
        setAddVisible(false);
        localStorage.removeItem("currentNewClinicalNote");

        // Construction des search params
        const searchParams = new URLSearchParams({
          patientId: patientId.toString(),
          patientName: toPatientName(demographicsInfos),
          healthCardNbr: demographicsInfos.HealthCard?.Number || "",
          timestamp: nowTZTimestamp().toString(),
          referrerOhip: referrer_ohip || "",
        });
        // Redirection avec search params
        navigate(`/staff/billing?${searchParams.toString()}`);
      },
      onError: (err) => {
        toast.error(`Error: unable to save clinical note: ${err.message}`, {
          containerId: "A",
        });
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
    localStorage.setItem(
      "currentNewClinicalNote",
      JSON.stringify({ ...formDatas, [name]: value })
    );
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleBodyChange = (
    value: string,
    delta: DeltaStatic,
    source: EmitterSource,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    if (source === "user") {
      setInputText(value);
      localStorage.setItem(
        "currentNewClinicalNote",
        JSON.stringify({
          ...(formDatas as ClinicalNoteType),
          MyClinicalNotesContent: value,
        })
      );
      inputTextBeforeSpeech.current = value;
    }
  };

  const handleAttach = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpeg, .jpg, .png, .pdf";
    input.onchange = async (event) => {
      // getting a hold of the file reference
      const e = event as unknown as React.ChangeEvent<HTMLInputElement>;
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 128000000) {
        toast.error(
          "The file is over 128Mb, please choose another file or send a link",
          { containerId: "A" }
        );
        return;
      }
      setIsLoadingFile(true);
      const formData = new FormData();
      formData.append("content", file);
      try {
        const response = await axios.post(
          import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const fileToUpload: AttachmentType = response.data;
        setAttachments([
          ...attachments,
          {
            file: fileToUpload,
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
    const newInputText =
      inputText + (inputText ? "<p><br/></p>" : "") + template.body;
    setInputText(newInputText);
    inputTextBeforeSpeech.current = newInputText;
    localStorage.setItem(
      "currentNewClinicalNote",
      JSON.stringify({ ...formDatas, MyClinicalNotesContent: newInputText })
    );
    requestAnimationFrame(() => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        editor.setSelection(newInputText.length, 0);
        editor.root.scrollIntoView({ behavior: "smooth", block: "nearest" });
        editor.focus();
      }
    });
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
                  color="#8fb4fb"
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
            <div className="clinical-notes__form-header-attach">
              <label>Attach files</label>
              <PaperclipIcon onClick={handleAttach} />
            </div>
          </div>
        </div>
        <ClinicalNoteFormBody
          errMsg={errMsg}
          isListening={isListening}
          handleStartSpeech={handleStartSpeech}
          handleStopSpeech={handleStopSpeech}
          inputText={inputText}
          attachments={attachments}
          handleRemoveAttachment={handleRemoveAttachment}
          patientId={patientId}
          quillRef={quillRef}
          handleBodyChange={handleBodyChange}
        />
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
