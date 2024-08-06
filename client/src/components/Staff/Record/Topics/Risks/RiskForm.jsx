import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { lifeStageCT } from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { riskSchema } from "../../../../../validation/record/riskValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import GenericList from "../../../../UI/Lists/GenericList";
import SignCellForm from "../../../../UI/Tables/SignCellForm";

const RiskForm = ({
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
    RiskFactor: "",
    ExposureDetails: "",
    StartDate: null,
    EndDate: "",
    AgeOfOnset: null,
    LifeStage: "N",
    Notes: "",
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "StartDate" || name === "EndDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const topicToPost = {
      ...formDatas,
      RiskFactor: firstLetterOfFirstWordUpper(formDatas.RiskFactor),
      ExposureDetails: firstLetterOfFirstWordUpper(formDatas.ExposureDetails),
      Notes: firstLetterOfFirstWordUpper(formDatas.Notes),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await riskSchema.validate(topicToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
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

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr
      className="risk__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="risk__form-btn-container">
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <Input
          value={formDatas.RiskFactor}
          onChange={handleChange}
          name="RiskFactor"
        />
      </td>
      <td>
        <Input
          value={formDatas.ExposureDetails}
          onChange={handleChange}
          name="ExposureDetails"
        />
      </td>
      <td>
        <InputDate
          max={timestampToDateISOTZ(nowTZTimestamp())}
          value={timestampToDateISOTZ(formDatas.StartDate)}
          onChange={handleChange}
          name="StartDate"
        />
      </td>
      <td>
        <InputDate
          max={timestampToDateISOTZ(nowTZTimestamp())}
          value={timestampToDateISOTZ(formDatas.EndDate)}
          onChange={handleChange}
          name="EndDate"
        />
      </td>
      <td>
        <Input
          value={formDatas.AgeOfOnset}
          onChange={handleChange}
          name="AgeOfOnset"
        />
      </td>
      <td>
        <GenericList
          list={lifeStageCT}
          value={formDatas.LifeStage}
          name="LifeStage"
          handleChange={handleChange}
          placeHolder="Choose a lifestage..."
        />
      </td>
      <td>
        <Input value={formDatas.Notes} onChange={handleChange} name="Notes" />
      </td>
      <SignCellForm />
    </tr>
  );
};

export default RiskForm;
