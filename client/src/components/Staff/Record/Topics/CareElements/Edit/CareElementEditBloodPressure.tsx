import { UseMutationResult } from "@tanstack/react-query";
import { uniqueId } from "lodash";
import React, { useState } from "react";
import { CareElementType } from "../../../../../../types/api";
import { dateISOToTimestampTZ } from "../../../../../../utils/dates/formatDates";
import CancelButton from "../../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../../UI/Buttons/SaveButton";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import CareElementEditItemBloodPressure from "./CareElementEditItemBloodPressure";

type CareElementEditBloodPressureProps = {
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  careElementsDatas?: CareElementType;
  topicPut: UseMutationResult<CareElementType, Error, CareElementType, void>;
};

const CareElementEditBloodPressure = ({
  setEditVisible,
  careElementsDatas,
  topicPut,
}: CareElementEditBloodPressureProps) => {
  const [errMsgPost, setErrMsgPost] = useState<string | null>(null);
  const [progress, setProgress] = useState(false);
  const [formDatas, setFormDatas] = useState<
    | {
        id: string;
        SystolicBP: string;
        DiastolicBP: string;
        BPUnit: "mmHg";
        Date: number;
      }[]
    | undefined
  >(
    careElementsDatas?.BloodPressure?.sort((a, b) => b.Date - a.Date).map(
      (data) => ({ ...data, id: uniqueId() })
    )
  );

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
      BloodPressure: formDatas?.map(({ id, ...rest }) => rest) ?? [],
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
    id: string
  ) => {
    setErrMsgPost("");
    const { name, value } = e.target;
    switch (name) {
      case "Date":
        if (value === "") return;
        setFormDatas(
          formDatas?.map((data) =>
            data.id === id
              ? { ...data, Date: dateISOToTimestampTZ(value) as number }
              : data
          )
        );
        return;
      case "Systolic":
        setFormDatas(
          formDatas?.map((data) =>
            data.id === id ? { ...data, SystolicBP: value } : data
          )
        );
        return;
      case "Diastolic":
        setFormDatas(
          formDatas?.map((data, i) =>
            data.id === id ? { ...data, DiastolicBP: value } : data
          )
        );
        return;
    }
  };
  const handleRemove = (id: string) => {
    setFormDatas(formDatas?.filter((data) => data.id !== id));
  };
  return (
    <div className="care-elements__edit-container">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="care-elements__edit">
        {formDatas?.map((data) => (
          <CareElementEditItemBloodPressure
            key={data.id}
            data={data}
            handleChange={handleChange}
            handleRemove={handleRemove}
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
