import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { ReminderType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { reminderSchema } from "../../../../../validation/record/reminderValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import FormSignCell from "../../../../UI/Tables/FormSignCell";

type ReminderFormProps = {
  editCounter: React.MutableRefObject<number>;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  topicPost: UseMutationResult<
    ReminderType,
    Error,
    Partial<ReminderType>,
    void
  >;
};

const ReminderForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
  topicPost,
}: ReminderFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<Partial<ReminderType>>({
    patient_id: patientId,
    reminder: "",
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleCancel = () => {
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSubmit = async () => {
    //Formatting
    const topicToPost: Partial<ReminderType> = {
      ...formDatas,
      reminder: firstLetterOfFirstWordUpper(formDatas.reminder ?? ""),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await reminderSchema.validate(topicToPost);
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
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  return (
    <tr
      className="reminders__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="reminders__form-btn-container">
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <Input
          value={formDatas.reminder ?? ""}
          name="reminder"
          onChange={handleChange}
        />
      </td>
      <FormSignCell />
    </tr>
  );
};

export default ReminderForm;
