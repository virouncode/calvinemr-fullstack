import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import { CareElementType } from "../../../../../../types/api";
import { dateISOToTimestampTZ } from "../../../../../../utils/dates/formatDates";
import CancelButton from "../../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../../UI/Buttons/SaveButton";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import CareElementEditItemSmoking from "./CareElementEditItemSmoking";

type CareElementEditSmokingProps = {
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  careElementsDatas?: CareElementType;
  topicPut: UseMutationResult<CareElementType, Error, CareElementType, void>;
};

const CareElementEditSmoking = ({
  setEditVisible,
  careElementsDatas,
  topicPut,
}: CareElementEditSmokingProps) => {
  const [errMsgPost, setErrMsgPost] = useState<string | null>(null);
  const [progress, setProgress] = useState(false);
  const [formDatasStatus, setFormDatasStatus] = useState<
    | {
        Status: string;
        Date: number;
      }[]
    | undefined
  >(careElementsDatas?.SmokingStatus?.sort((a, b) => b.Date - a.Date));
  const [formDatasPacks, setFormDatasPacks] = useState(
    careElementsDatas?.SmokingPacks?.sort((a, b) => b.Date - a.Date)
  );
  const handleSubmit = async () => {
    setErrMsgPost("");
    const regex = /^\d+(\.\d{0,5})?$/;
    if (formDatasPacks?.some((data) => !regex.test(data.PerDay))) {
      setErrMsgPost(`Invalid Packs per day : Please enter a valid number.`);
      return;
    }
    for (let i = 0; i < (formDatasStatus?.length ?? 0); i++) {
      if (
        formDatasStatus?.[i].Status === "Y" &&
        formDatasPacks?.[i].PerDay === ""
      ) {
        setErrMsgPost(
          `Please enter the number of packs per day for line ${i + 1}.`
        );
        return;
      }
    }
    const topicToPut: CareElementType = {
      ...(careElementsDatas as CareElementType),
      SmokingStatus: formDatasStatus as { Status: string; Date: number }[],
      SmokingPacks: formDatasPacks?.map((data) =>
        data.PerDay === "" ? { ...data, PerDay: "0" } : data
      ) as { PerDay: string; Date: number }[],
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
        setFormDatasStatus(
          formDatasStatus?.map((data, i) =>
            i === index
              ? { ...data, Date: dateISOToTimestampTZ(value) as number }
              : data
          )
        );
        setFormDatasPacks(
          formDatasPacks?.map((data, i) =>
            i === index
              ? { ...data, Date: dateISOToTimestampTZ(value) as number }
              : data
          )
        );
        return;
      case "Status":
        setFormDatasStatus(
          formDatasStatus?.map((data, i) =>
            i === index ? { ...data, Status: value } : data
          )
        );
        setFormDatasPacks(
          formDatasPacks?.map((data, i) =>
            i === index ? { ...data, PerDay: value === "N" ? "0" : "" } : data
          )
        );
        return;
      case "PerDay":
        setFormDatasPacks(
          formDatasPacks?.map((data, i) =>
            i === index ? { ...data, PerDay: value } : data
          )
        );
        setFormDatasStatus(
          formDatasStatus?.map((data, i) =>
            i === index ? { ...data, Status: !value ? "N" : "Y" } : data
          )
        );
        return;
    }
  };

  const handleRemove = (index: number) => {
    setFormDatasStatus(formDatasStatus?.filter((data, i) => i !== index));
    setFormDatasPacks(formDatasPacks?.filter((data, i) => i !== index));
  };
  return (
    <div className="care-elements__edit-container">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="care-elements__edit">
        {formDatasStatus?.map((data, index) => (
          <CareElementEditItemSmoking
            key={index}
            dataStatus={data}
            dataPacks={formDatasPacks?.[index]}
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

export default CareElementEditSmoking;
