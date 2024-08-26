import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  lifeStageCT,
  propertyOfOffendingAgentCT,
  reactionSeverityCT,
  reactionTypeCT,
} from "../../../../../omdDatas/codesTables";
import { AllergyType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
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
import FormSignCell from "../../../../UI/Tables/FormSignCell";

type AllergyFormProps = {
  editCounter: React.MutableRefObject<number>;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  topicPost: UseMutationResult<AllergyType, Error, Partial<AllergyType>, void>;
};

const AllergyForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
  topicPost,
}: AllergyFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<Partial<AllergyType>>({
    patient_id: patientId,
    OffendingAgentDescription: "",
    PropertyOfOffendingAgent: "",
    ReactionType: "",
    StartDate: null,
    LifeStage: "",
    Severity: "",
    Reaction: "",
    RecordedDate: nowTZTimestamp(),
    Notes: "",
  });
  const [progress, setProgress] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    let value: string | number | null = e.target.value;
    const name = e.target.name;
    if (name === "StartDate" || name === "RecordedDate") {
      value = dateISOToTimestampTZ(value);
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleCancel = () => {
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSubmit = async () => {
    //Formatting
    const topicToPost: Partial<AllergyType> = {
      ...formDatas,
      OffendingAgentDescription: firstLetterOfFirstWordUpper(
        formDatas.OffendingAgentDescription ?? ""
      ),
      Reaction: firstLetterOfFirstWordUpper(formDatas.Reaction ?? ""),
      Notes: firstLetterOfFirstWordUpper(formDatas.Notes ?? ""),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await allergySchema.validate(topicToPost);
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
          value={formDatas.OffendingAgentDescription ?? ""}
          onChange={handleChange}
          name="OffendingAgentDescription"
        />
      </td>
      <td>
        <GenericList
          list={propertyOfOffendingAgentCT}
          value={formDatas.PropertyOfOffendingAgent ?? ""}
          name="PropertyOfOffendingAgent"
          handleChange={handleChange}
        />
      </td>
      <td>
        <GenericList
          list={reactionTypeCT}
          value={formDatas.ReactionType ?? ""}
          name="ReactionType"
          handleChange={handleChange}
        />
      </td>
      <td>
        <InputDate
          value={timestampToDateISOTZ(formDatas.StartDate)}
          name="StartDate"
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
        <GenericList
          list={reactionSeverityCT}
          value={formDatas.Severity ?? ""}
          name="Severity"
          handleChange={handleChange}
        />
      </td>
      <td>
        <Input
          value={formDatas.Reaction ?? ""}
          onChange={handleChange}
          name="Reaction"
        />
      </td>
      <td>{timestampToDateISOTZ(formDatas.RecordedDate)}</td>
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

export default AllergyForm;
