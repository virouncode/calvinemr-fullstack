import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import {
  CareElementListItemType,
  CareElementType,
} from "../../../../../../types/api";
import { UserStaffType } from "../../../../../../types/app";
import { dateISOToTimestampTZ } from "../../../../../../utils/dates/formatDates";
import CancelButton from "../../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../../UI/Buttons/SaveButton";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import CareElementEditItemBloodPressure from "./CareElementEditItemBloodPressure";

type CareElementEditBloodPressureProps = {
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  careElementToEdit: CareElementListItemType;
  careElementsDatas?: CareElementType;
  topicPut: UseMutationResult<CareElementType, Error, CareElementType, void>;
};

const CareElementEditBloodPressure = ({
  setEditVisible,
  careElementToEdit,
  careElementsDatas,
  topicPut,
}: CareElementEditBloodPressureProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [errMsgPost, setErrMsgPost] = useState<string | null>(null);
  const [progress, setProgress] = useState(false);
  const [formDatas, setFormDatas] = useState<
    | {
        SystolicBP: string;
        DiastolicBP: string;
        BPUnit: "mmHg";
        Date: number;
      }[]
    | undefined
  >(careElementsDatas?.BloodPressure?.sort((a, b) => b.Date - a.Date));

  const handleSubmit = async () => {
    setErrMsgPost("");
    const regex = /^\d+(\.\d{0,2})?$/;
    if (formDatas?.some((data) => !regex.test(data.SystolicBP))) {
      setErrMsgPost(`Invalid Systolic (mmHg) : Please enter a valid number.`);
      return;
    }
    if (formDatas?.some((data) => !regex.test(data.DiastolicBP))) {
      setErrMsgPost(`Invalid Diastolic (mmHg) : Please enter a valid number.`);
      return;
    }
    const topicToPut: CareElementType = {
      ...(careElementsDatas as CareElementType),
      BloodPressure: formDatas as {
        SystolicBP: string;
        DiastolicBP: string;
        BPUnit: "mmHg";
        Date: number;
      }[],
    };
    setProgress(true);
    topicPut.mutate(topicToPut, {
      onSuccess: () => {
        setEditVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };
  const handleCancel = () => {
    setEditVisible(false);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    setErrMsgPost("");
    const { name, value } = e.target;
    switch (name) {
      case "Date":
        if (value === "") return;
        setFormDatas(
          formDatas?.map((data, i) =>
            i === index
              ? { ...data, Date: dateISOToTimestampTZ(value) as number }
              : data
          )
        );
        return;
      case "Systolic":
        setFormDatas(
          formDatas?.map((data, i) =>
            i === index ? { ...data, SystolicBP: value } : data
          )
        );
        return;
      case "Diastolic":
        setFormDatas(
          formDatas?.map((data, i) =>
            i === index ? { ...data, DiastolicBP: value } : data
          )
        );
        return;
    }
  };
  const handleRemove = (index: number) => {
    setFormDatas(formDatas?.filter((data, i) => i !== index));
  };
  return (
    <div className="care-elements__edit-container">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="care-elements__edit">
        {formDatas?.map((data, index) => (
          <CareElementEditItemBloodPressure
            key={index}
            data={data}
            handleChange={handleChange}
            handleRemove={handleRemove}
            index={index}
          />
        ))}
      </div>
      <div className="care-elements__edit-btn-container">
        <SaveButton onClick={handleSubmit} disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </div>
  );
};

export default CareElementEditBloodPressure;
