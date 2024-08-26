import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { lifeStageCT } from "../../../../../omdDatas/codesTables";
import { ProblemListType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
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

type ProblemListFormProps = {
  editCounter: React.MutableRefObject<number>;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  topicPost: UseMutationResult<
    ProblemListType,
    Error,
    Partial<ProblemListType>,
    void
  >;
};

const ProblemListForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
  topicPost,
}: ProblemListFormProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<Partial<ProblemListType>>({
    patient_id: patientId,
    ProblemDiagnosisDescription: "",
    ProblemDescription: "",
    ProblemStatus: "",
    OnsetDate: null,
    LifeStage: "",
    ResolutionDate: null,
    Notes: "",
  });
  const [progress, setProgress] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    let value: string | number | null = e.target.value;
    const name = e.target.name;
    if (name === "OnsetDate" || name === "ResolutionDate") {
      value = dateISOToTimestampTZ(value);
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleCancel = () => {
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSubmit = async () => {
    //Formatting
    const topicToPost: Partial<ProblemListType> = {
      ...formDatas,
      ProblemDiagnosisDescription: firstLetterOfFirstWordUpper(
        formDatas.ProblemDiagnosisDescription ?? ""
      ),
      ProblemDescription: firstLetterOfFirstWordUpper(
        formDatas.ProblemDescription ?? ""
      ),
      ProblemStatus: firstLetterOfFirstWordUpper(formDatas.ProblemStatus ?? ""),
      Notes: firstLetterOfFirstWordUpper(formDatas.Notes ?? ""),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await problemListSchema.validate(topicToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
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
          value={formDatas.ProblemDiagnosisDescription ?? ""}
          onChange={handleChange}
        />
      </td>
      <td>
        <Input
          name="ProblemDescription"
          value={formDatas.ProblemDescription ?? ""}
          onChange={handleChange}
        />
      </td>
      <td>
        <Input
          name="ProblemStatus"
          value={formDatas.ProblemStatus ?? ""}
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
          value={formDatas.LifeStage ?? ""}
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
        <Input
          name="Notes"
          value={formDatas.Notes ?? ""}
          onChange={handleChange}
        />
      </td>
      <FormSignCell />
    </tr>
  );
};

export default ProblemListForm;
