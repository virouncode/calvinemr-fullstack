import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { AlertType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { alertSchema } from "../../../../../validation/record/alertValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import FormSignCell from "../../../../UI/Tables/FormSignCell";

type AlertFormProps = {
  editCounter: React.MutableRefObject<number>;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  topicPost: UseMutationResult<AlertType, Error, Partial<AlertType>, void>;
};

const AlertForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
  topicPost,
}: AlertFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<Partial<AlertType>>({
    patient_id: patientId,
    AlertDescription: "",
    DateActive: nowTZTimestamp(),
    Notes: "",
  });
  const [progress, setProgress] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    let value: string | number | null = e.target.value;
    const name = e.target.name;
    if (name === "DateActive" || name === "EndDate") {
      value = dateISOToTimestampTZ(value);
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    //Formatting
    e.preventDefault();
    const topicToPost: Partial<AlertType> = {
      ...formDatas,
      AlertDescription: firstLetterOfFirstWordUpper(
        formDatas.AlertDescription ?? ""
      ),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await alertSchema.validate(topicToPost);
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
      className="alerts__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="alerts__form-btn-container">
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <Input
          value={formDatas.AlertDescription ?? ""}
          onChange={handleChange}
          name="AlertDescription"
        />
      </td>
      <td>
        <InputDate
          value={timestampToDateISOTZ(formDatas.DateActive)}
          onChange={handleChange}
          name="DateActive"
        />
      </td>
      <td>
        <InputDate
          value={timestampToDateISOTZ(formDatas.EndDate)}
          onChange={handleChange}
          name="EndDate"
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

export default AlertForm;
