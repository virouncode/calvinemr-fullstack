import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { PregnancyType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { pregnancySchema } from "../../../../../validation/record/pregnancyValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import InputNumber from "../../../../UI/Inputs/InputNumber";
import PregnanciesList from "./PregnanciesList";

type PregnancyFormProps = {
  editCounter: React.MutableRefObject<number>;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  topicPost: UseMutationResult<
    PregnancyType,
    Error,
    Partial<PregnancyType>,
    void
  >;
};

const PregnancyForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
  topicPost,
}: PregnancyFormProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState<Partial<PregnancyType>>({
    patient_id: patientId,
    description: "",
    date_of_event: nowTZTimestamp(),
    premises: "",
    term_nbr_of_weeks: 0,
    term_nbr_of_days: 0,
    notes: "",
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    let parsedValue: string | number | null;
    if (name === "date_of_event") {
      parsedValue = dateISOToTimestampTZ(value);
    } else if (name === "term_nbr_of_weeks" || name === "term_nbr_of_days") {
      parsedValue = parseInt(value ?? "0");
    } else {
      parsedValue = value;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleChangePregnancyEvent = (value: string) => {
    setFormDatas({ ...formDatas, description: value });
  };

  const handleCancel = () => {
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSubmit = async () => {
    //Fomatting
    const topicToPost: Partial<PregnancyType> = {
      ...formDatas,
      premises: firstLetterOfFirstWordUpper(formDatas.premises ?? ""),
      notes: firstLetterOfFirstWordUpper(formDatas.notes ?? ""),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Vaidation
    try {
      await pregnancySchema.validate(topicToPost);
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
      className="pregnancies__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="pregnancies__form-btn-container">
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <PregnanciesList
          value={formDatas.description ?? ""}
          handleChange={handleChangePregnancyEvent}
        />
      </td>
      <td>
        <InputDate
          name="date_of_event"
          value={timestampToDateISOTZ(formDatas.date_of_event)}
          onChange={handleChange}
        />
      </td>
      <td>
        <Input
          name="premises"
          value={formDatas.premises ?? ""}
          onChange={handleChange}
        />
      </td>
      <td>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <InputNumber
            name="term_nbr_of_weeks"
            id="term_nbr_of_weeks"
            value={formDatas.term_nbr_of_weeks ?? ""}
            onChange={handleChange}
            width={50}
          />
          w
          <InputNumber
            name="term_nbr_of_days"
            id="term_nbr_of_days"
            value={formDatas.term_nbr_of_days ?? ""}
            onChange={handleChange}
            width={50}
          />
          d
        </div>
      </td>
      <td>
        <Input
          name="notes"
          value={formDatas.notes ?? ""}
          onChange={handleChange}
        />
      </td>
      <td>
        <em>{staffIdToTitleAndName(staffInfos, user.id)}</em>{" "}
      </td>
      <td>
        <em>{timestampToDateISOTZ(nowTZTimestamp())}</em>
      </td>
    </tr>
  );
};

export default PregnancyForm;
