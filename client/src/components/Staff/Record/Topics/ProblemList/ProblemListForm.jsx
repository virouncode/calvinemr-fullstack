import { useState } from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { lifeStageCT } from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { problemListSchema } from "../../../../../validation/record/problemListValidation";
import GenericList from "../../../../UI/Lists/GenericList";

const ProblemListForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
  topicPost,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    ProblemDiagnosisDescription: "",
    ProblemDescription: "",
    ProblemStatus: "",
    OnsetDate: "",
    LifeStage: "",
    ResolutionDate: "",
    Notes: "",
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "OnsetDate" || name === "ResolutionDate") {
      value = value ? dateISOToTimestampTZ(value) : null;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const topicToPost = {
      ...formDatas,
      ProblemDiagnosisDescription: firstLetterOfFirstWordUpper(
        formDatas.ProblemDiagnosisDescription
      ),
      ProblemDescription: firstLetterOfFirstWordUpper(
        formDatas.ProblemDescription
      ),
      ProblemStatus: firstLetterOfFirstWordUpper(formDatas.ProblemStatus),
      Notes: firstLetterOfFirstWordUpper(formDatas.Notes),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await problemListSchema.validate(topicToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    setProgress(true);
    topicPost.mutate(topicToPost, {
      onSuccess: () => {
        editCounter.current -= 1;
        setAddVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  return (
    <tr
      className="problemlist__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="problemlist__form-btn-container">
          <input
            type="submit"
            value="Save"
            onClick={handleSubmit}
            disabled={progress}
          />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <input
          name="ProblemDiagnosisDescription"
          type="text"
          value={formDatas.ProblemDiagnosisDescription}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="ProblemDescription"
          type="text"
          value={formDatas.ProblemDescription}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="ProblemStatus"
          type="text"
          value={formDatas.ProblemStatus}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="OnsetDate"
          type="date"
          value={timestampToDateISOTZ(formDatas.OnsetDate)}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <GenericList
          list={lifeStageCT}
          value={formDatas.LifeStage}
          name="LifeStage"
          handleChange={handleChange}
        />
      </td>
      <td>
        <input
          name="ResolutionDate"
          type="date"
          value={timestampToDateISOTZ(formDatas.ResolutionDate)}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="Notes"
          type="text"
          value={formDatas.Notes}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <em>{staffIdToTitleAndName(staffInfos, user.id)}</em>
      </td>
      <td>
        <em>{timestampToDateISOTZ(nowTZTimestamp())}</em>
      </td>
    </tr>
  );
};

export default ProblemListForm;
