import axios from "axios";
import { toast } from "react-toastify";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { timestampToDateTimeStrTZ } from "../../../../../utils/dates/formatDates";
import { copyClinicalNoteToClipboard } from "../../../../../utils/js/copyToClipboard";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import TriangleClinicalButton from "../../../../UI/Buttons/TriangleClinicalButton";
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
          <input
            className="clinical-notes__card-check"
            type="checkbox"
            checked={isChecked(clinicalNote.id) || selectAll}
            onChange={handleCheck}
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
              <button
                onClick={handleEditClick}
                disabled={
                  user.id !== clinicalNote.created_by_id ||
                  addVisible ||
                  isRewriting
                }
              >
                Edit
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                disabled={
                  user.id !== clinicalNote.created_by_id ||
                  addVisible ||
                  isRewriting
                }
              >
                <a
                  href={`/staff/billing/${
                    demographicsInfos.patient_id
                  }/${toPatientName(demographicsInfos)}/${
                    demographicsInfos.HealthCard?.Number
                  }/${clinicalNote.date_created}`}
                  rel="noreferrer"
                >
                  Bill
                </a>
              </button>
              {user.title !== "Secretary" && user.title !== "Nurse" && (
                <button
                  onClick={handleCalvinAIClick}
                  disabled={
                    user.id !== clinicalNote.created_by_id ||
                    addVisible ||
                    isRewriting
                  }
                >
                  CalvinAI
                </button>
              )}
              <button
                onClick={handleRewrite}
                disabled={
                  user.id !== clinicalNote.created_by_id ||
                  addVisible ||
                  isRewriting
                }
              >
                Rewrite
              </button>
              <button onClick={handleCopyToClipboard}>Copy to clipboard</button>
            </>
          ) : (
            <>
              <button
                style={{ margin: "0 2px" }}
                onClick={handleSaveClick}
                className="save-btn"
              >
                Save
              </button>
              <button style={{ margin: "0 2px" }} onClick={handleCancelClick}>
                Cancel
              </button>
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
          <label htmlFor="clinical-subject">
            <strong>Subject: </strong>
          </label>
          {!editVisible ? (
            clinicalNote.subject
          ) : (
            <input
              type="text"
              value={tempFormDatas.subject}
              onChange={handleChange}
              name="subject"
              autoComplete="off"
              onClick={(e) => e.stopPropagation()}
              id="clinical-subject"
            />
          )}
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
