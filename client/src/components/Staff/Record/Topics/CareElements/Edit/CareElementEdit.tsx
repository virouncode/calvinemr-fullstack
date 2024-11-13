import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import {
  CareElementListItemType,
  CareElementType,
} from "../../../../../../types/api";
import { UserStaffType } from "../../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
} from "../../../../../../utils/dates/formatDates";
import CancelButton from "../../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../../UI/Buttons/SaveButton";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import CareElementEditItem from "./CareElementEditItem";

type CareElementEditProps = {
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  careElementToEdit: CareElementListItemType;
  careElementsDatas?: CareElementType;
  topicPut: UseMutationResult<CareElementType, Error, CareElementType, void>;
};

const CareElementEdit = ({
  setEditVisible,
  careElementToEdit,
  careElementsDatas,
  topicPut,
}: CareElementEditProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [errMsgPost, setErrMsgPost] = useState<string | null>(null);
  const [progress, setProgress] = useState(false);
  const [formDatas, setFormDatas] = useState<
    { Date: number; [key: string]: string | number }[] | undefined
  >(
    careElementsDatas?.[
      careElementToEdit.key as
        | "SmokingStatus"
        | "SmokingPacks"
        | "Weight"
        | "Height"
        | "bodyMassIndex"
        | "bodySurfaceArea"
        | "WaistCircumference"
        | "BloodPressure"
        | "E2"
        | "LH"
        | "P4"
        | "FSH"
        | "AMH"
        | "DHEAS"
        | "HCG"
        | "PRL"
        | "TSH"
        | "Testosterone"
    ].sort((a, b) => b.Date - a.Date)
  );
  const handleSubmit = async () => {
    setErrMsgPost("");
    const regex = /^\d+(\.\d{0,2})?$/;
    if (
      formDatas?.some(
        (data) => !regex.test(data[careElementToEdit.key] as string)
      )
    ) {
      setErrMsgPost(
        `Invalid ${careElementToEdit.name} : Please enter a valid number.`
      );
      return;
    }
    const topicToPut: CareElementType = {
      ...(careElementsDatas as CareElementType),
      updates: [
        ...(careElementsDatas?.updates ?? []),
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
      [careElementToEdit.key]: formDatas,
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
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setErrMsgPost("");
    const { name, value } = e.target;
    if (name === "Date") {
      if (value === "") return;
      setFormDatas(
        formDatas?.map((data, i) =>
          i === index
            ? { ...data, Date: dateISOToTimestampTZ(value) as number }
            : data
        )
      );
      return;
    }
    setFormDatas(
      formDatas?.map((data, i) =>
        i === index ? { ...data, [careElementToEdit.key]: value } : data
      )
    );
  };

  const handleRemove = (index: number) => {
    setFormDatas(formDatas?.filter((data, i) => i !== index));
  };
  return (
    <div className="care-elements__edit-container">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="care-elements__edit">
        {formDatas?.map((data, index) => (
          <CareElementEditItem
            key={index}
            data={data}
            careElementToEdit={careElementToEdit}
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

export default CareElementEdit;
