import axios from "axios";
import { toast } from "react-toastify";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { timestampToDateTimeStrTZ } from "../../../../../utils/dates/formatDates";
import { copyClinicalNoteToClipboard } from "../../../../../utils/js/copyToClipboard";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import Button from "../../../../UI/Buttons/Button";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import LinkButton from "../../../../UI/Buttons/LinkButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import TriangleClinicalButton from "../../../../UI/Buttons/TriangleClinicalButton";
import Checkbox from "../../../../UI/Checkbox/Checkbox";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import CircularProgressSmall from "../../../../UI/Progress/CircularProgressSmall";

axios.defaults.withCredentials = true;

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
  setInputText,
  inputTextBeforeSpeech,
  handleTriangleClinicalClick,
  addVisible,
  bodyRef,
  selectAll,
  setAIContent,
  setEditVisible,
  isRewriting,
  setIsRewriting,
}) => {
  const { staffInfos } = useStaffInfosContext();
  const { user } = useUserContext();

  const handleClickTemplate = (e) => {
    e.stopPropagation();
    setTemplatesVisible((v) => !v);
  };

  const handleCopyToClipboard = async (e) => {
    e.stopPropagation();
    try {
      await copyClinicalNoteToClipboard(bodyRef);
      toast.success("Copied !", { containerId: "A" });
    } catch (err) {
      toast.error(`Unable to copy: ${err.message}`, { containerId: "A" });
    }
  };

  const handleRewrite = async (e) => {
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
      setAIContent(response.data);
      setInputText(response.data);
      inputTextBeforeSpeech.current = response.data;
      setIsRewriting(false);
    } catch (err) {
      setIsRewriting(false);
      toast.error(`CalvinAI is down: ${err.message}`, { containerId: "A" });
    }
  };

  return (
    <div
      className="clinical-notes__card-header"
      onClick={handleTriangleClinicalClick}
    >
      <div className="clinical-notes__card-header-row">
        <div className="clinical-notes__card-author">
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
        <div className="clinical-notes__card-btns">
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
        <div className="clinical-notes__card-triangle">
          <TriangleClinicalButton
            handleTriangleClick={handleTriangleClinicalClick}
            color="dark"
            className={
              "triangle-clinical-notes  triangle-clinical-notes--active"
            }
          />
        </div>
      </div>
      <div className="clinical-notes__card-header-row">
        <div className="clinical-notes__card-subject">
          <InputTextToggle
            value={tempFormDatas.subject}
            onChange={handleChange}
            onClick={(e) => e.stopPropagation()}
            name="subject"
            id="clinical-subject"
            editVisible={editVisible}
            label="Subject:"
          />
        </div>
        {!editVisible && versions && (
          <div className="clinical-notes__card-version">
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
          <div className="clinical-notes__form-template">
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
