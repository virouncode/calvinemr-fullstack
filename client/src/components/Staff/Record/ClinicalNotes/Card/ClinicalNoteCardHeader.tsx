import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  ClinicalNoteLogType,
  ClinicalNoteType,
  DemographicsType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { timestampToDateTimeStrTZ } from "../../../../../utils/dates/formatDates";
import { copyClinicalNoteToClipboard } from "../../../../../utils/js/copyToClipboard";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import Button from "../../../../UI/Buttons/Button";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import LinkButton from "../../../../UI/Buttons/LinkButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Checkbox from "../../../../UI/Checkbox/Checkbox";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import CircularProgressSmall from "../../../../UI/Progress/CircularProgressSmall";
axios.defaults.withCredentials = true;

type ClinicalNoteCardHeaderProps = {
  demographicsInfos: DemographicsType;
  isChecked: (id: number) => boolean;
  handleCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clinicalNote: ClinicalNoteType;
  tempFormDatas: ClinicalNoteType;
  setTemplatesVisible: React.Dispatch<React.SetStateAction<boolean>>;
  editVisible: boolean;
  versions: ClinicalNoteLogType[];
  handleClickVersions: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  handleEditClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleCalvinAIClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  handleSaveClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  handleCancelClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClinicalHeaderClick: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  inputTextBeforeSpeech: React.MutableRefObject<string>;
  addVisible: boolean;
  bodyRef: React.MutableRefObject<HTMLDivElement | null>;
  selectAll: boolean;
  setAIRewritedText: React.Dispatch<React.SetStateAction<string>>;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isRewriting: boolean;
  setIsRewriting: React.Dispatch<React.SetStateAction<boolean>>;
};

const ClinicalNoteCardHeader = ({
  demographicsInfos,
  isChecked,
  handleCheck,
  clinicalNote,
  tempFormDatas,
  setTemplatesVisible,
  editVisible,
  versions,
  handleClickVersions,
  handleEditClick,
  handleCalvinAIClick,
  handleSaveClick,
  handleCancelClick,
  handleChange,
  handleClinicalHeaderClick,
  setInputText,
  inputTextBeforeSpeech,
  addVisible,
  bodyRef,
  selectAll,
  setAIRewritedText,
  setEditVisible,
  isRewriting,
  setIsRewriting,
}: ClinicalNoteCardHeaderProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  const { user } = useUserContext() as { user: UserStaffType };

  const handleClickTemplate = () => {
    setTemplatesVisible((v) => !v);
  };

  const handleCopyToClipboard = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    try {
      await copyClinicalNoteToClipboard(bodyRef);
      toast.success("Copied !", { containerId: "A" });
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Unable to copy: ${err.message}`, { containerId: "A" });
    }
  };

  const handleRewrite = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    try {
      setIsRewriting(true);
      const response = await axios.post(`/api/openai/full`, {
        messages: [
          {
            role: "user",
            content: `Can you rewrite this with sentences in a medical context: ${clinicalNote.MyClinicalNotesContent}`,
          },
        ],
      });
      setEditVisible(true);
      setAIRewritedText(response.data);
      setInputText(response.data);
      inputTextBeforeSpeech.current = response.data;
      setIsRewriting(false);
    } catch (err) {
      setIsRewriting(false);
      if (err instanceof Error)
        toast.error(`CalvinAI is down: ${err.message}`, { containerId: "A" });
    }
  };

  return (
    <div
      className="clinical-notes__card-header"
      onClick={handleClinicalHeaderClick}
    >
      <div className="clinical-notes__card-header-row">
        <div className="clinical-notes__card-header-author">
          <Checkbox
            onChange={handleCheck}
            checked={isChecked(clinicalNote.id) || selectAll}
            onClick={(event) => event.stopPropagation()}
          />
          <p>
            <strong>From: </strong>
            {staffIdToTitleAndName(staffInfos, clinicalNote.created_by_id)}
            {` ${timestampToDateTimeStrTZ(clinicalNote.date_created)}`}
          </p>
        </div>
        <div className="clinical-notes__card-header-btns">
          {!editVisible ? (
            <>
              {isRewriting && <CircularProgressSmall />}
              <EditButton
                onClick={handleEditClick}
                disabled={
                  user.id !== clinicalNote.created_by_id ||
                  addVisible ||
                  isRewriting
                }
              />
              <LinkButton
                onClick={(e) => e.stopPropagation()}
                disabled={
                  user.id !== clinicalNote.created_by_id ||
                  addVisible ||
                  isRewriting
                }
                label="Bill"
                url={`/staff/billing/${
                  demographicsInfos.patient_id
                }/${toPatientName(demographicsInfos)}/${
                  demographicsInfos.HealthCard?.Number
                }/${clinicalNote.date_created}`}
              />
              {user.title !== "Secretary" && user.title !== "Nurse" && (
                <Button
                  onClick={handleCalvinAIClick}
                  disabled={
                    user.id !== clinicalNote.created_by_id ||
                    addVisible ||
                    isRewriting
                  }
                  label="CalvinAI"
                />
              )}
              <Button
                onClick={handleRewrite}
                disabled={
                  user.id !== clinicalNote.created_by_id ||
                  addVisible ||
                  isRewriting
                }
                label="Rewrite"
              />
              <Button
                onClick={handleCopyToClipboard}
                label="Copy to clipboard"
              />
            </>
          ) : (
            <>
              <SaveButton onClick={handleSaveClick} />
              <CancelButton onClick={handleCancelClick} />
            </>
          )}
        </div>
        {/* <div className="clinical-notes__card-triangle">
          <TriangleIcon color="black" rotation={90} />
        </div> */}
      </div>
      <div className="clinical-notes__card-header-row">
        <div className="clinical-notes__card-header-subject">
          <InputTextToggle
            value={tempFormDatas.subject}
            onChange={handleChange}
            onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) =>
              e.stopPropagation()
            }
            name="subject"
            id="clinical-subject"
            editVisible={editVisible}
            label="Subject:"
          />
        </div>
        {!editVisible && versions && (
          <div className="clinical-notes__card-header-version">
            <label>
              <strong style={{ marginRight: "5px" }}>Version: </strong>
            </label>
            <span
              onClick={handleClickVersions}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {"V" + (versions.length + 1).toString()}
            </span>
          </div>
        )}
        {editVisible && (
          <div className="clinical-notes__card-header-template">
            <label style={{ textDecoration: "underline", cursor: "pointer" }}>
              <strong onClick={handleClickTemplate}>Use template</strong>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalNoteCardHeader;
