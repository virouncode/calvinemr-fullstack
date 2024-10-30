import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill, { DeltaStatic, EmitterSource } from "react-quill-new";
import { toast } from "react-toastify";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import {
  useClinicalNoteLogPost,
  useClinicalNotePut,
} from "../../../../../hooks/reactquery/mutations/clinicalNotesMutations";
import { useSpeechRecognition } from "../../../../../hooks/useSpeechRecognition";
import {
  ClinicalNoteAttachmentType,
  ClinicalNoteLogType,
  ClinicalNoteTemplateType,
  ClinicalNoteType,
  DemographicsType,
} from "../../../../../types/api";
import { isChromeBrowser } from "../../../../../utils/browsers/isChromeBrowser";
import {
  nowTZTimestamp,
  timestampToDateTimeSecondsStrTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import { clinicalNoteSchema } from "../../../../../validation/record/clinicalNoteValidation";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import CalvinAIClinical from "../CalvinAIClinical/CalvinAIClinical";
import ClinicalNotesTemplates from "../Templates/ClinicalNotesTemplates";
import ClinicalNotesVersions from "../Versions/ClinicalNoteVersions";
import ClinicalNoteAttachments from "./ClinicalNoteAttachments";
import ClinicalNoteCardBody from "./ClinicalNoteCardBody";
import ClinicalNoteCardHeader from "./ClinicalNoteCardHeader";
import ClinicalNoteCardHeaderFolded from "./ClinicalNoteCardHeaderFolded";

type ClinicalNoteCardProps = {
  clinicalNote: ClinicalNoteType;
  clinicalNotes: ClinicalNoteType[];
  patientId: number;
  checkedNotesIds: number[];
  setCheckedNotesIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  contentsVisible: boolean;
  demographicsInfos: DemographicsType;
  lastItemRef?: (node: Element | null) => void;
  editClinicalNoteInMemory: ClinicalNoteType | null;
  setEditClinicalNoteInMemory: React.Dispatch<
    React.SetStateAction<ClinicalNoteType | null>
  >;
  addVisible: boolean;
  setNewButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};
const ClinicalNoteCard = ({
  clinicalNote,
  clinicalNotes,
  patientId,
  checkedNotesIds,
  setCheckedNotesIds,
  selectAll,
  setSelectAll,
  contentsVisible,
  demographicsInfos,
  lastItemRef,
  editClinicalNoteInMemory,
  setEditClinicalNoteInMemory,
  addVisible,
  setNewButtonDisabled,
}: ClinicalNoteCardProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  const [editVisible, setEditVisible] = useState(false);
  const [tempFormDatas, setTempFormDatas] = useState<ClinicalNoteType>(
    editClinicalNoteInMemory ?? clinicalNote
  );
  const [formDatas, setFormDatas] = useState<ClinicalNoteType>(
    editClinicalNoteInMemory ?? clinicalNote
  );
  const [bodyVisible, setBodyVisible] = useState(true);
  const [aiVisible, setAIVisible] = useState(false);
  const [versionsVisible, setVersionsVisible] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [aiRewriteText, setAIRewritedText] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [inputText, setInputText] = useState("");
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);
  const editClinicalNoteRef = useRef<HTMLDivElement | null>(null);
  const inputTextBeforeSpeech = useRef<string>("");
  //Queries
  const clinicalNoteLogPost = useClinicalNoteLogPost(patientId);
  const clinicalNotePut = useClinicalNotePut(patientId);

  useEffect(() => {
    if (editClinicalNoteInMemory) {
      setFormDatas(editClinicalNoteInMemory);
      setTempFormDatas(editClinicalNoteInMemory);
      setInputText(editClinicalNoteInMemory.MyClinicalNotesContent);
      inputTextBeforeSpeech.current =
        editClinicalNoteInMemory.MyClinicalNotesContent;
      setEditVisible(true);
      setNewButtonDisabled(true);
      if (editClinicalNoteRef.current) {
        editClinicalNoteRef.current.scrollIntoView({
          behavior: "instant",
          block: "start",
        });
      }
    } else if (clinicalNote) {
      setFormDatas(clinicalNote);
      if (aiRewriteText) {
        setTempFormDatas({
          ...clinicalNote,
          MyClinicalNotesContent: aiRewriteText,
        });
        setInputText(aiRewriteText);
        inputTextBeforeSpeech.current = aiRewriteText;
        localStorage.setItem(
          "currentEditClinicalNote",
          JSON.stringify({
            ...clinicalNote,
            MyClinicalNotesContent: aiRewriteText,
          })
        );
      } else {
        setTempFormDatas(clinicalNote);
        setInputText(clinicalNote.MyClinicalNotesContent);
        inputTextBeforeSpeech.current = clinicalNote.MyClinicalNotesContent;
      }
    }
  }, [
    aiRewriteText,
    clinicalNote,
    editClinicalNoteInMemory,
    setNewButtonDisabled,
  ]);

  //Fot the global fold/unfold button
  useEffect(() => {
    setBodyVisible(contentsVisible);
  }, [contentsVisible]);

  const { isListening, setIsListening, recognition } = useSpeechRecognition(
    setInputText,
    inputTextBeforeSpeech,
    tempFormDatas as ClinicalNoteType
  );

  //HANDLERS
  const handleSelectTemplate = (template: ClinicalNoteTemplateType) => {
    setErrMsg("");
    const newInputText =
      inputText + (inputText ? "<p><br/></p>" : "") + template.body;
    setInputText(newInputText);
    inputTextBeforeSpeech.current = newInputText;
    localStorage.setItem(
      "currentEditClinicalNote",
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

  const handleClinicalHeaderClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setBodyVisible((v) => !v);
    if (bodyRef.current)
      bodyRef.current.classList.toggle(
        "clinical-notes__card-body-container--active"
      );
  };

  const handleCalvinAIClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setAIVisible((v) => !v);
  };

  const handleEditClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setErrMsg("");
    e.stopPropagation();
    setEditVisible(true);
    setNewButtonDisabled(true);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
    localStorage.setItem(
      "currentEditClinicalNote",
      JSON.stringify({ ...(tempFormDatas as ClinicalNoteType), [name]: value })
    );
    setTempFormDatas({ ...(tempFormDatas as ClinicalNoteType), [name]: value });
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
        "currentEditClinicalNote",
        JSON.stringify({
          ...(tempFormDatas as ClinicalNoteType),
          MyClinicalNotesContent: value,
        })
      );
      inputTextBeforeSpeech.current = value;
    }
  };

  const handleCancelClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setErrMsg("");
    handleStopSpeech();
    e.stopPropagation();
    if (
      await confirmAlert({
        content: "Do you really want to cancel ? Your changes won't be saved",
      })
    ) {
      setAIRewritedText("");
      setInputText(
        editClinicalNoteInMemory
          ? editClinicalNoteInMemory.MyClinicalNotesContent
          : clinicalNote
          ? clinicalNote.MyClinicalNotesContent
          : ""
      );
      inputTextBeforeSpeech.current = editClinicalNoteInMemory
        ? editClinicalNoteInMemory.MyClinicalNotesContent
        : clinicalNote
        ? clinicalNote.MyClinicalNotesContent
        : "";
      localStorage.removeItem("currentEditClinicalNote");
      setEditClinicalNoteInMemory(null);
      setTempFormDatas(formDatas);
      setEditVisible(false);
      setNewButtonDisabled(false);
    }
  };
  const handleSaveClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    handleStopSpeech();
    if (
      (_.isEqual(
        { ...tempFormDatas, MyClinicalNotesContent: inputText },
        formDatas
      ) &&
        (await confirmAlert({
          content: "You didn't change anything to the note, save anyway ?",
        }))) ||
      !_.isEqual(
        { ...tempFormDatas, MyClinicalNotesContent: inputText },
        formDatas
      )
    ) {
      //First post the former clinical note to the clinical notes log tbl
      const clinicalNoteLog: Partial<ClinicalNoteLogType> = {
        ...formDatas,
        clinical_note_id: formDatas?.id as number,
        version_nbr: clinicalNote.version_nbr,
      }; //former version
      clinicalNoteLogPost.mutate(clinicalNoteLog);

      //then put the new clinical note version in the clinical note tbl
      const clinicalNoteToPut: ClinicalNoteType = {
        ...(tempFormDatas as ClinicalNoteType),
        version_nbr: clinicalNote.version_nbr + 1,
        MyClinicalNotesContent: inputText,
        attachments_ids: (
          clinicalNote.attachments_ids as {
            attachment: ClinicalNoteAttachmentType;
          }[]
        ).map(({ attachment }) => attachment.id as number),
        date_updated: nowTZTimestamp(),
      };
      //Validation
      try {
        await clinicalNoteSchema.validate(clinicalNoteToPut);
      } catch (err) {
        if (err instanceof Error) setErrMsg(err.message);
        return;
      }
      clinicalNotePut.mutate(clinicalNoteToPut, {
        onSuccess: () => {
          setEditVisible(false);
          setNewButtonDisabled(false);
          localStorage.removeItem("currentEditClinicalNote");
        },
      });
    }
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      setCheckedNotesIds((previous) => [...previous, clinicalNote.id]);
      if (clinicalNotes.length === checkedNotesIds.length + 1) {
        setSelectAll(true);
      }
    } else {
      setCheckedNotesIds((previous) =>
        previous.filter((id) => id !== clinicalNote.id)
      );
      setSelectAll(false);
    }
  };

  const handleClickVersions = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setVersionsVisible((v) => !v);
  };

  const isChecked = (clinicalNoteId: number) => {
    return checkedNotesIds.includes(clinicalNoteId);
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
    tempFormDatas && (
      <div className="clinical-notes__card" ref={lastItemRef}>
        <div ref={editClinicalNoteRef}></div>
        {bodyVisible ? (
          <ClinicalNoteCardHeader
            demographicsInfos={demographicsInfos}
            isChecked={isChecked}
            handleCheck={handleCheck}
            clinicalNote={clinicalNote}
            tempFormDatas={tempFormDatas}
            setTemplatesVisible={setTemplatesVisible}
            editVisible={editVisible}
            versions={clinicalNote.versions ?? []}
            handleClickVersions={handleClickVersions}
            handleEditClick={handleEditClick}
            handleCalvinAIClick={handleCalvinAIClick}
            handleSaveClick={handleSaveClick}
            handleCancelClick={handleCancelClick}
            handleChange={handleChange}
            setInputText={setInputText}
            inputTextBeforeSpeech={inputTextBeforeSpeech}
            handleClinicalHeaderClick={handleClinicalHeaderClick}
            addVisible={addVisible}
            selectAll={selectAll}
            setAIRewritedText={setAIRewritedText}
            setEditVisible={setEditVisible}
            isRewriting={isRewriting}
            setIsRewriting={setIsRewriting}
            quillRef={quillRef}
          />
        ) : (
          <ClinicalNoteCardHeaderFolded
            tempFormDatas={tempFormDatas}
            handleClinicalHeaderClick={handleClinicalHeaderClick}
            isChecked={isChecked}
            clinicalNote={clinicalNote}
            handleCheck={handleCheck}
            selectAll={selectAll}
          />
        )}
        <div
          ref={bodyRef}
          className={
            bodyVisible
              ? "clinical-notes__card-body-container clinical-notes__card-body-container--active"
              : "clinical-notes__card-body-container"
          }
        >
          {errMsg && <ErrorParagraph errorMsg={errMsg} />}
          <ClinicalNoteCardBody
            inputText={inputText}
            editVisible={editVisible}
            isListening={isListening}
            handleStartSpeech={handleStartSpeech}
            handleStopSpeech={handleStopSpeech}
            quillRef={quillRef}
            handleBodyChange={handleBodyChange}
          />
          {clinicalNote.attachments_ids.length > 0 && (
            <ClinicalNoteAttachments
              attachments={(
                clinicalNote.attachments_ids as {
                  attachment: ClinicalNoteAttachmentType;
                }[]
              ).map(({ attachment }) => attachment)}
              deletable={false}
              patientId={patientId}
              date={clinicalNote.date_created}
            />
          )}
          {!editVisible && (
            <div className="clinical-notes__card-sign">
              <p style={{ padding: "0 10px" }}>
                Created by{" "}
                {staffIdToTitleAndName(staffInfos, clinicalNote.created_by_id)}{" "}
                on {timestampToDateTimeSecondsStrTZ(clinicalNote.date_created)}
              </p>
              {clinicalNote.date_updated && (
                <p style={{ padding: "0 10px" }}>
                  Updated on{" "}
                  {timestampToDateTimeSecondsStrTZ(clinicalNote.date_updated)}
                </p>
              )}
            </div>
          )}
        </div>
        {aiVisible && (
          <FakeWindow
            title={`CALVIN AI talk about ${toPatientName(demographicsInfos)}`}
            width={1000}
            height={window.innerHeight}
            x={(window.innerWidth - 1000) / 2}
            y={0}
            color="#8fb4fb"
            setPopUpVisible={setAIVisible}
          >
            <CalvinAIClinical
              attachments={(
                clinicalNote.attachments_ids as {
                  attachment: ClinicalNoteAttachmentType;
                }[]
              ).map(({ attachment }) => attachment)}
              initialBody={formDatas?.MyClinicalNotesContent}
              demographicsInfos={demographicsInfos}
              setEditVisible={setEditVisible}
              setAIRewritedText={setAIRewritedText}
              setAIVisible={setAIVisible}
            />
          </FakeWindow>
        )}
        {versionsVisible && (
          <FakeWindow
            title={`CLINICAL NOTE VERSIONS`}
            width={1024}
            height={600}
            x={(window.innerWidth - 1024) / 2}
            y={(window.innerHeight - 600) / 2}
            color="#8fb4fb"
            setPopUpVisible={setVersionsVisible}
          >
            <ClinicalNotesVersions
              versions={clinicalNote.versions ?? []}
              clinicalNote={clinicalNote}
            />
          </FakeWindow>
        )}
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
    )
  );
};

export default ClinicalNoteCard;
