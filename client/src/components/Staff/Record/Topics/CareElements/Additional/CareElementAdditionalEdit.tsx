import { UseMutationResult } from "@tanstack/react-query";
import { uniqueId } from "lodash";
import React, { useState } from "react";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import {
  CareElementAdditionalType,
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
import CareElementAdditionalEditItem from "./CareElementAdditionalEditItem";

type CareElementAdditionalEditProps = {
  setEditAdditionalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  careElementAdditionalToEdit: {
    Name: string;
    Unit: string;
  };
  careElementsDatas?: CareElementType;
  topicPut: UseMutationResult<CareElementType, Error, CareElementType, void>;
};

const CareElementAdditionalEdit = ({
  setEditAdditionalVisible,
  careElementAdditionalToEdit,
  careElementsDatas,
  topicPut,
}: CareElementAdditionalEditProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [errMsgPost, setErrMsgPost] = useState<string | null>(null);
  const [progress, setProgress] = useState(false);
  const [formDatas, setFormDatas] = useState(
    careElementsDatas?.Additional?.find(
      ({ Name }) => Name === careElementAdditionalToEdit.Name
    )
      ?.Data.sort((a, b) => b.Date - a.Date)
      .map((data) => ({
        ...data,
        id: uniqueId(),
      }))
  );
  const handleSubmit = async () => {
    setErrMsgPost("");
    if (formDatas?.some((data) => data.Value === "")) {
      setErrMsgPost("Please fill all fields");
      return;
    }
    const topicToPut: CareElementType = {
      ...(careElementsDatas as CareElementType),
      updates: [
        ...(careElementsDatas?.updates ?? []),
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
      Additional: careElementsDatas?.Additional.map((data) =>
        data.Name === careElementAdditionalToEdit.Name
          ? {
              ...data,
              Data: formDatas?.map(({ id, ...rest }) => rest),
            }
          : data
      ) as CareElementAdditionalType[],
    };
    setProgress(true);
    topicPut.mutate(topicToPut, {
      onSuccess: () => {
        setEditAdditionalVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };
  const handleCancel = () => {
    setEditAdditionalVisible(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setErrMsgPost("");
    const { name, value } = e.target;
    if (name === "Date") {
      if (value === "") return;
      setFormDatas(
        formDatas?.map((data) =>
          data.id === id
            ? { ...data, Date: dateISOToTimestampTZ(value) as number }
            : data
        )
      );
      return;
    }
    setFormDatas(
      formDatas?.map((data) =>
        data.id === id ? { ...data, Value: value } : data
      )
    );
  };
  return (
    <div className="care-elements__edit-container">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="care-elements__edit">
        {formDatas?.map((data) => (
          <CareElementAdditionalEditItem
            key={data.id}
            data={data}
            careElementAdditionalToEdit={careElementAdditionalToEdit}
            handleChange={handleChange}
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

export default CareElementAdditionalEdit;
