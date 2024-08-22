import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { lifeStageCT } from "../../../../../omdDatas/codesTables";
import { RiskFactorType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
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
import FormSignCell from "../../../../UI/Tables/FormSignCell";

type RiskFormProps = {
  editCounter: React.MutableRefObject<number>;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  topicPost: UseMutationResult<
    RiskFactorType,
    Error,
    Partial<RiskFactorType>,
    void
  >;
};

const RiskForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
  topicPost,
}: RiskFormProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<Partial<RiskFactorType>>({
    patient_id: patientId,
    RiskFactor: "",
    ExposureDetails: "",
    StartDate: null,
    EndDate: null,
    AgeOfOnset: "",
    LifeStage: "N",
    Notes: "",
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    let value: string | number | null = e.target.value;
    const name = e.target.name;
    if (name === "StartDate" || name === "EndDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    //Formatting
    const topicToPost = {
      ...formDatas,
      RiskFactor: firstLetterOfFirstWordUpper(formDatas.RiskFactor ?? ""),
      ExposureDetails: firstLetterOfFirstWordUpper(
        formDatas.ExposureDetails ?? ""
      ),
      Notes: firstLetterOfFirstWordUpper(formDatas.Notes ?? ""),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await riskSchema.validate(topicToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
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

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
          value={formDatas.RiskFactor ?? ""}
          onChange={handleChange}
          name="RiskFactor"
        />
      </td>
      <td>
        <Input
          value={formDatas.ExposureDetails ?? ""}
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
          value={formDatas.AgeOfOnset ?? ""}
          onChange={handleChange}
          name="AgeOfOnset"
        />
      </td>
      <td>
        <GenericList
          list={lifeStageCT}
          value={formDatas.LifeStage ?? ""}
          name="LifeStage"
          handleChange={handleChange}
          placeHolder="Choose a lifestage..."
        />
      </td>
      <td>
        <Input
          value={formDatas.Notes ?? ""}
          onChange={handleChange}
          name="Notes"
        />
      </td>
      <FormSignCell />
    </tr>
  );
};

export default RiskForm;
