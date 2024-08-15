import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { lifeStageCT } from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { problemListSchema } from "../../../../../validation/record/problemListValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import GenericList from "../../../../UI/Lists/GenericList";
import FormSignCell from "../../../../UI/Tables/FormSignCell";

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
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <Input
          name="ProblemDiagnosisDescription"
          value={formDatas.ProblemDiagnosisDescription}
          onChange={handleChange}
        />
      </td>
      <td>
        <Input
          name="ProblemDescription"
          value={formDatas.ProblemDescription}
          onChange={handleChange}
        />
      </td>
      <td>
        <Input
          name="ProblemStatus"
          value={formDatas.ProblemStatus}
          onChange={handleChange}
        />
      </td>
      <td>
        <InputDate
          name="OnsetDate"
          value={timestampToDateISOTZ(formDatas.OnsetDate)}
          onChange={handleChange}
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
        <InputDate
          name="ResolutionDate"
          value={timestampToDateISOTZ(formDatas.ResolutionDate)}
          onChange={handleChange}
        />
      </td>
      <td>
        <Input name="Notes" value={formDatas.Notes} onChange={handleChange} />
      </td>
      <FormSignCell />
    </tr>
  );
};

export default ProblemListForm;
