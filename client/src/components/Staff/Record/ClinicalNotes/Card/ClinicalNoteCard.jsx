import { useEffect, useRef, useState } from "react";

import _ from "lodash";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import {
  useClinicalNoteLogPost,
  useClinicalNotePut,
} from "../../../../../hooks/reactquery/mutations/clinicalNotesMutations";
import { useSpeechRecognition } from "../../../../../hooks/useSpeechRecognition";
import {
  nowTZTimestamp,
  timestampToDateTimeSecondsStrTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import { clinicalNoteSchema } from "../../../../../validation/record/clinicalNoteValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import CalvinAIClinical from "../CalvinAIClinical/CalvinAIClinical";
import ClinicalNotesTemplates from "../Templates/ClinicalNotesTemplates";
import ClinicalNotesVersions from "../Versions/ClinicalNoteVersions";
import ClinicalNoteAttachments from "./ClinicalNoteAttachments";
import ClinicalNoteCardBody from "./ClinicalNoteCardBody";
import ClinicalNoteCardHeader from "./ClinicalNoteCardHeader";
import ClinicalNoteCardHeaderFolded from "./ClinicalNoteCardHeaderFolded";
const ClinicalNoteCard = ({
  clinicalNote,
  clinicalNotes,
  patientId,
  checkedNotes,
  setCheckedNotes,
  selectAll,
  setSelectAll,
  contentsVisible,
  demographicsInfos,
  lastItemRef = null,
  editClinicalNoteInMemory,
  setEditClinicalNoteInMemory,
  addVisible,
  setNewButtonDisabled,
  templates,
}) => {
  //hooks

  const { staffInfos } = useStaffInfosContext();
  const bodyRef = useRef(null);
  const textareaRef = useRef(null);
  const editClinicalNoteRef = useRef(null);
  const [editVisible, setEditVisible] = useState(false);
  const [tempFormDatas, setTempFormDatas] = useState(null);
  const [formDatas, setFormDatas] = useState(null);
  const [bodyVisible, setBodyVisible] = useState(true);
  const [aiVisible, setAIVisible] = useState(false);
  const [versionsVisible, setVersionsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [choosenVersionNbr, setChoosenVersionNbr] = useState(
    clinicalNote.version_nbr
  );
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [aiContent, setAIContent] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [inputText, setInputText] = useState("");
  const inputTextBeforeSpeech = useRef("");

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
      if (aiContent) {
        setTempFormDatas({
          ...clinicalNote,
          MyClinicalNotesContent: aiContent,
        });
        setInputText(aiContent);
        inputTextBeforeSpeech.current = aiContent;
      } else {
        setTempFormDatas(clinicalNote);
        setInputText(clinicalNote.MyClinicalNotesContent);
        inputTextBeforeSpeech.current = clinicalNote.MyClinicalNotesContent;
      }
    }
  }, [aiContent, clinicalNote, editClinicalNoteInMemory, setNewButtonDisabled]);

  useEffect(() => {
    setBodyVisible(contentsVisible);
  }, [contentsVisible]);

  useEffect(() => {
    if (textareaRef.current && !isTyping) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [isTyping, tempFormDatas?.MyClinicalNotesContent]);

  const { isListening, setIsListening, recognition } = useSpeechRecognition(
    setInputText,
    inputTextBeforeSpeech,
    tempFormDatas
  );

  //HANDLERS
  const handleSelectTemplate = (e, template) => {
    setErrMsg("");
    e.stopPropagation();
    setIsTyping(false);
    setInputText(inputText + (inputText ? "\n\n" : "") + template.body + "\n");
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(
      (inputText + (inputText ? "\n\n" : "") + template.body + "\n").length,
      (inputText + (inputText ? "\n\n" : "") + template.body + "\n").length
    );
    inputTextBeforeSpeech.current =
      inputText + (inputText ? "\n\n" : "") + template.body + "\n";
  };

  const handleTriangleClinicalClick = (e) => {
    e.stopPropagation();
    setBodyVisible((v) => !v);
    bodyRef.current.classList.toggle(
      "clinical-notes__card-body-container--active"
    );
  };

  const handleCalvinAIClick = (e) => {
    e.stopPropagation();
    setAIVisible((v) => !v);
  };

  const handleEditClick = (e) => {
    setErrMsg("");
    e.stopPropagation();
    setEditVisible(true);
    setNewButtonDisabled(true);
  };
  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
    setIsTyping(true);
    localStorage.setItem(
      "currentEditClinicalNote",
      JSON.stringify({ ...tempFormDatas, [name]: value })
    );
    setTempFormDatas({ ...tempFormDatas, [name]: value });
  };

  const handleChangeText = (e) => {
    const value = e.target.value;
    setErrMsg("");
    setInputText(value);
    inputTextBeforeSpeech.current = value;
    localStorage.setItem(
      "currentEditClinicalNote",
      JSON.stringify({ ...formDatas, MyClinicalNotesContent: value })
    );
  };

  const handleCancelClick = async (e) => {
    setErrMsg("");
    handleStopSpeech();
    e.stopPropagation();
    if (
      await confirmAlert({
        content: "Do you really want to cancel ? Your changes won't be saved",
      })
    ) {
      setAIContent("");
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
  const handleSaveClick = async (e) => {
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
      const clinicalNoteLog = {
        ...formDatas,
        clinical_note_id: formDatas.id,
        version_nbr: clinicalNote.version_nbr,
      }; //former version
      clinicalNoteLogPost.mutate(clinicalNoteLog);

      //then put the new clinical note version in the clinical note tbl
      const clinicalNoteToPost = {
        ...tempFormDatas,
        version_nbr: clinicalNote.version_nbr + 1,
        MyClinicalNotesContent: inputText,
        attachments_ids: clinicalNote.attachments_ids.map(
          ({ attachment }) => attachment.id
        ),
        date_updated: nowTZTimestamp(),
      };
      delete clinicalNoteToPost.version;
      //Validation
      try {
        await clinicalNoteSchema.validate(clinicalNoteToPost);
      } catch (err) {
        setErrMsg(err.message);
        return;
      }
      clinicalNotePut.mutate(clinicalNoteToPost, {
        onSuccess: () => {
          setChoosenVersionNbr(clinicalNote.version_nbr + 1);
          setEditVisible(false);
          setNewButtonDisabled(false);
          localStorage.removeItem("currentEditClinicalNote");
        },
      });
    }
  };

  const handleCheck = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setCheckedNotes((previous) => [...previous, clinicalNote.id]);
      if (clinicalNotes.length === checkedNotes.length + 1) {
        setSelectAll(true);
      }
    } else {
      setCheckedNotes((previous) =>
        previous.filter((id) => id !== clinicalNote.id)
      );
      setSelectAll(false);
    }
  };

  const handleClickVersions = (e) => {
    e.stopPropagation();
    setVersionsVisible((v) => !v);
  };

  const isChecked = (progressNoteId) => {
    return checkedNotes.includes(progressNoteId);
  };

  const handleStartSpeech = () => {
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
            versions={clinicalNote.versions}
            handleClickVersions={handleClickVersions}
            handleEditClick={handleEditClick}
            handleCalvinAIClick={handleCalvinAIClick}
            handleSaveClick={handleSaveClick}
            handleCancelClick={handleCancelClick}
            handleChange={handleChange}
            setInputText={setInputText}
            inputTextBeforeSpeech={inputTextBeforeSpeech}
            handleTriangleClinicalClick={handleTriangleClinicalClick}
            choosenVersionNbr={choosenVersionNbr}
            addVisible={addVisible}
            bodyRef={bodyRef}
            selectAll={selectAll}
            setAIContent={setAIContent}
            setEditVisible={setEditVisible}
            isRewriting={isRewriting}
            setIsRewriting={setIsRewriting}
          />
        ) : (
          <ClinicalNoteCardHeaderFolded
            tempFormDatas={tempFormDatas}
            handleTriangleClinicalClick={handleTriangleClinicalClick}
            handleClickVersions={handleClickVersions}
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
          {errMsg && <p className="clinical-notes__form-err">{errMsg}</p>}
          <ClinicalNoteCardBody
            clinicalNote={clinicalNote}
            inputText={inputText}
            editVisible={editVisible}
            handleChangeText={handleChangeText}
            textareaRef={textareaRef}
            isListening={isListening}
            handleStartSpeech={handleStartSpeech}
            handleStopSpeech={handleStopSpeech}
          />
          <ClinicalNoteAttachments
            attachments={clinicalNote.attachments_ids.map(
              ({ attachment }) => attachment
            )}
            deletable={false}
            patientId={patientId}
            date={clinicalNote.date_created}
          />
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
            color="#93b5e9"
            setPopUpVisible={setAIVisible}
          >
            <CalvinAIClinical
              attachments={clinicalNote.attachments_ids.map(
                ({ attachment }) => attachment
              )}
              initialBody={formDatas.MyClinicalNotesContent}
              demographicsInfos={demographicsInfos}
              setEditVisible={setEditVisible}
              setAIContent={setAIContent}
              setAIVisible={setAIVisible}
            />
          </FakeWindow>
        )}
        {versionsVisible && (
          <FakeWindow
            title={`CLINICAL NOTE VERSIONS`}
            width={1000}
            height={600}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 600) / 2}
            color="#93b5e9"
            setPopUpVisible={setVersionsVisible}
          >
            <ClinicalNotesVersions
              versions={clinicalNote.versions}
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
            color="#93b5e9"
            setPopUpVisible={setTemplatesVisible}
          >
            <ClinicalNotesTemplates
              templates={templates}
              handleSelectTemplate={handleSelectTemplate}
            />
          </FakeWindow>
        )}
      </div>
    )
  );
};

export default ClinicalNoteCard;
