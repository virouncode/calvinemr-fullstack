import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { lifeStageCT } from "../../../../../omdDatas/codesTables";
import {
  FamilyHistoryFormType,
  FamilyHistoryType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { famHistorySchema } from "../../../../../validation/record/famHistoryValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import GenericList from "../../../../UI/Lists/GenericList";
import FormSignCell from "../../../../UI/Tables/FormSignCell";
import RelativesList from "./RelativesList";

type FamilyHistoryFormProps = {
  editCounter: React.MutableRefObject<number>;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  topicPost: UseMutationResult<
    FamilyHistoryType,
    Error,
    Partial<FamilyHistoryType>,
    void
  >;
};

const FamilyHistoryForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
  topicPost,
}: FamilyHistoryFormProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<FamilyHistoryFormType>({
    patient_id: patientId,
    date_created: nowTZTimestamp(),
    created_by_id: user.id,
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    let value: string | number | null = e.target.value;
    const name = e.target.name;
    if (name === "StartDate") {
      value = dateISOToTimestampTZ(value);
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async () => {
    //Formatting
    const topicToPost: Partial<FamilyHistoryType> = {
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
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    setProgress(true);
    //Submission
    topicPost.mutate(topicToPost, {
      onSuccess: () => {
        editCounter.current -= 1;
        setAddVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  const handleMemberChange = (value: string) => {
    setFormDatas({ ...formDatas, Relationship: value });
  };

  const handleCancel = () => {
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
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <Input
          name="ProblemDiagnosisProcedureDescription"
          value={formDatas.ProblemDiagnosisProcedureDescription}
          onChange={handleChange}
        />
      </td>
      <td>
        <RelativesList
          handleChange={handleMemberChange}
          value={formDatas.Relationship}
        />
      </td>
      <td>
        <InputDate
          max={timestampToDateISOTZ(nowTZTimestamp())}
          name="StartDate"
          value={timestampToDateISOTZ(formDatas.StartDate)}
          onChange={handleChange}
        />
      </td>
      <td>
        <Input
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
        <Input
          name="Treatment"
          value={formDatas.Treatment}
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

export default FamilyHistoryForm;
