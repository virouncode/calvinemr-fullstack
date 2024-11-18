import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { ChecklistType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { checklistTests } from "../../../../../utils/checklist/checklistUtils";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { checklistSchema } from "../../../../../validation/record/checklistValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import DurationPickerLong from "../../../../UI/Pickers/DurationPickerLong";

type ChecklistFormProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  testName: string;
  patientId: number;
  topicPost: UseMutationResult<
    ChecklistType,
    Error,
    Partial<ChecklistType>,
    void
  >;
};

const ChecklistForm = ({
  setAddVisible,
  testName,
  patientId,
  topicPost,
}: ChecklistFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<ChecklistType>({
    id: -1,
    patient_id: patientId,
    test_name: testName,
    validity: checklistTests.find((test) => test.name === testName)
      ?.defaultValidity ?? {
      days: 0,
      weeks: 0,
      months: 0,
      years: 0,
    },
    result: "",
    date: nowTZTimestamp(),
    created_by_id: user.id,
    date_created: nowTZTimestamp(),
    updates: [],
  });
  const [errMsgPost, setErrMsgPost] = useState<string | null>(null);
  const [progress, setProgress] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "date") {
      if (value === "") return;
      setFormDatas({
        ...formDatas,
        date: dateISOToTimestampTZ(value) as number,
      });
      return;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleCancel = () => setAddVisible(false);
  const handleSubmit = async () => {
    setErrMsgPost("");
    const topicToPost: Partial<ChecklistType> = {
      date_created: nowTZTimestamp(),
      patient_id: patientId,
      test_name: testName,
      validity: {
        years: !isNaN(formDatas.validity.years) ? formDatas.validity.years : 0,
        months: !isNaN(formDatas.validity.months)
          ? formDatas.validity.months
          : 0,
        weeks: !isNaN(formDatas.validity.weeks) ? formDatas.validity.weeks : 0,
        days: !isNaN(formDatas.validity.days) ? formDatas.validity.days : 0,
      },
      result: formDatas.result,
      date: formDatas.date,
      created_by_id: user.id,
    };

    try {
      await checklistSchema.validate(topicToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    setProgress(true);
    topicPost.mutate(topicToPost, {
      onSuccess: () => {
        setAddVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  const handleDurationPickerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "Y" | "M" | "W" | "D"
  ) => {
    const value = parseInt(e.target.value);
    let name;
    switch (type) {
      case "Y":
        name = "years";
        break;
      case "M":
        name = "months";
        break;
      case "W":
        name = "weeks";
        break;
      case "D":
        name = "days";
        break;
      default:
        name = "days";
    }
    setFormDatas({
      ...formDatas,
      validity: { ...formDatas.validity, [name]: value },
    });
  };
  return (
    <div className="checklist__form-container">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="checklist__form">
        <div className="checklist__form-item">
          <label htmlFor="">Test name</label>
          <p>{testName}</p>
        </div>
        <div className="checklist__form-item">
          {checklistTests.find((test) => test.name === testName)
            ?.defaultValidity ? (
            <DurationPickerLong
              durationYears={formDatas.validity.years}
              durationMonths={formDatas.validity?.months}
              durationWeeks={formDatas.validity?.weeks}
              durationDays={formDatas.validity?.days}
              handleDurationPickerChange={handleDurationPickerChange}
              label={"Validity"}
            />
          ) : (
            <Input label="Validity" value="N/A" readOnly={true} />
          )}
        </div>
        <div className="checklist__form-item">
          <Input
            label="Result"
            value={formDatas.result}
            onChange={handleChange}
            name="result"
            id="result"
          />
        </div>
        <div className="checklist__form-item">
          <InputDate
            label="Date"
            value={timestampToDateISOTZ(formDatas.date)}
            onChange={handleChange}
            name="date"
            id="date"
          />
        </div>
      </div>
      <div className="checklist__form-btn-container">
        <SaveButton onClick={handleSubmit} disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </div>
  );
};

export default ChecklistForm;
