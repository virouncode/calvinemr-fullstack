import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { lifeStageCT } from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { pastHealthSchema } from "../../../../../validation/record/pastHealthValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import GenericList from "../../../../UI/Lists/GenericList";
import SignCellForm from "../../../../UI/Tables/SignCellForm";

const PastHealthForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
  topicPost,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    PastHealthProblemDescriptionOrProcedures: "",
    OnsetOrEventDate: null,
    LifeStage: "A",
    ProcedureDate: null,
    ResolvedDate: null,
    ProblemStatus: "",
    Notes: "",
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (
      name === "ProcedureDate" ||
      name === "OnsetOrEventDate" ||
      name === "ResolvedDate"
    ) {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    //Formatting
    const topicToPost = {
      ...formDatas,
      PastHealthProblemDescriptionOrProcedures: firstLetterOfFirstWordUpper(
        formDatas.PastHealthProblemDescriptionOrProcedures
      ),
      ProblemStatus: firstLetterOfFirstWordUpper(formDatas.ProblemStatus),
      Notes: firstLetterOfFirstWordUpper(formDatas.Notes),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await pastHealthSchema.validate(topicToPost);
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

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr
      className="pasthealth__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="pasthealth__form-btn-container">
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <input
          name="PastHealthProblemDescriptionOrProcedures"
          type="text"
          value={formDatas.PastHealthProblemDescriptionOrProcedures}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="OnsetOrEventDate"
          type="date"
          max={timestampToDateISOTZ(nowTZTimestamp())}
          value={timestampToDateISOTZ(formDatas.OnsetOrEventDate)}
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
          name="ProcedureDate"
          type="date"
          max={timestampToDateISOTZ(nowTZTimestamp())}
          value={timestampToDateISOTZ(formDatas.ProcedureDate)}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          name="ResolvedDate"
          type="date"
          max={timestampToDateISOTZ(nowTZTimestamp())}
          value={timestampToDateISOTZ(formDatas.ResolvedDate)}
          onChange={handleChange}
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
          name="Notes"
          type="text"
          value={formDatas.Notes}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <SignCellForm />
    </tr>
  );
};

export default PastHealthForm;
