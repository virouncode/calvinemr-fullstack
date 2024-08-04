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
import { famHistorySchema } from "../../../../../validation/record/famHistoryValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import GenericList from "../../../../UI/Lists/GenericList";
import RelativesList from "./RelativesList";

const FamilyHistoryForm = ({
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
    StartDate: null,
    AgeAtOnset: "",
    LifeStage: "A",
    ProblemDiagnosisProcedureDescription: "",
    Treatment: "",
    Relationship: "",
    Notes: "",
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "StartDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const topicToPost = {
      ...formDatas,
      ProblemDiagnosisProcedureDescription: firstLetterOfFirstWordUpper(
        formDatas.ProblemDiagnosisProcedureDescription
      ),
      Treatment: firstLetterOfFirstWordUpper(formDatas.Treatment),
      Notes: firstLetterOfFirstWordUpper(formDatas.Notes),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };

    //Validation
    try {
      await famHistorySchema.validate(topicToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    setProgress(true);
    //Submission
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

  const handleMemberChange = (value) => {
    setFormDatas({ ...formDatas, Relationship: value });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr
      className="famhistory__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="famhistory__form-btn-container">
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
          name="ProblemDiagnosisProcedureDescription"
          type="text"
          value={formDatas.ProblemDiagnosisProcedureDescription}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <RelativesList
          name="Relationship"
          handleChange={handleMemberChange}
          value={formDatas.Relationship}
        />
      </td>
      <td>
        <input
          type="date"
          max={timestampToDateISOTZ(nowTZTimestamp())}
          name="StartDate"
          value={timestampToDateISOTZ(formDatas.StartDate)}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          type="text"
          name="AgeAtOnset"
          value={formDatas.AgeAtOnset}
          onChange={handleChange}
        />
      </td>
      <td>
        <GenericList
          list={lifeStageCT}
          value={formDatas.LifeStage}
          name="LifeStage"
          handleChange={handleChange}
          placeHolder="Choose a lifestage..."
          noneOption={false}
        />
      </td>
      <td>
        <input
          type="text"
          name="Treatment"
          value={formDatas.Treatment}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          type="text"
          name="Notes"
          value={formDatas.Notes}
          onChange={handleChange}
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

export default FamilyHistoryForm;
