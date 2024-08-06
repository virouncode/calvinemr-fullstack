import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  lifeStageCT,
  propertyOfOffendingAgentCT,
  reactionSeverityCT,
  reactionTypeCT,
} from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { allergySchema } from "../../../../../validation/record/allergyValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import GenericList from "../../../../UI/Lists/GenericList";
import SignCellForm from "../../../../UI/Tables/SignCellForm";

const AllergyForm = ({
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
    OffendingAgentDescription: "",
    PropertyOfOffendingAgent: "",
    ReactionType: "",
    StartDate: "",
    LifeStage: "",
    Severity: "",
    Reaction: "",
    RecordedDate: nowTZTimestamp(),
    Notes: "",
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "StartDate" || name === "RecordedDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const topicToPost = {
      ...formDatas,
      OffendingAgentDescription: firstLetterOfFirstWordUpper(
        formDatas.OffendingAgentDescription
      ),
      Reaction: firstLetterOfFirstWordUpper(formDatas.Reaction),
      Notes: firstLetterOfFirstWordUpper(formDatas.Notes),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await allergySchema.validate(topicToPost);
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
      className="allergies__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="allergies__form-btn-container">
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <Input
          value={formDatas.OffendingAgentDescription}
          onChange={handleChange}
          name="OffendingAgentDescription"
        />
      </td>
      <td>
        <GenericList
          list={propertyOfOffendingAgentCT}
          value={formDatas.PropertyOfOffendingAgent}
          name="PropertyOfOffendingAgent"
          handleChange={handleChange}
        />
      </td>
      <td>
        <GenericList
          list={reactionTypeCT}
          value={formDatas.ReactionType}
          name="ReactionType"
          handleChange={handleChange}
        />
      </td>
      <td>
        <InputDate
          value={formDatas.StartDate}
          name="StartDate"
          handleChange={handleChange}
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
        <GenericList
          list={reactionSeverityCT}
          value={formDatas.Severity}
          name="Severity"
          handleChange={handleChange}
        />
      </td>
      <td>
        <Input
          value={formDatas.Reaction}
          onChange={handleChange}
          name="Reaction"
        />
      </td>
      <td>{timestampToDateISOTZ(formDatas.RecordedDate)}</td>
      <td>
        <Input value={formDatas.Notes} onChange={handleChange} name="Notes" />
      </td>
      <SignCellForm />
    </tr>
  );
};

export default AllergyForm;
