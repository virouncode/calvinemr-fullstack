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
  timestampToDateISOTZ,
} from "../../../../../../utils/dates/formatDates";
import CancelButton from "../../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../../UI/Buttons/SaveButton";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";

type CareElementFormProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  careElementToAdd: CareElementListItemType;
  careElementsDatas?: CareElementType;
  patientId: number;
  topicPost: UseMutationResult<
    CareElementType,
    Error,
    Partial<CareElementType>,
    void
  >;
  topicPut: UseMutationResult<CareElementType, Error, CareElementType, void>;
};

const CareElementForm = ({
  setAddVisible,
  careElementToAdd,
  careElementsDatas,
  patientId,
  topicPost,
  topicPut,
}: CareElementFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [errMsgPost, setErrMsgPost] = useState<string | null>(null);
  const [progress, setProgress] = useState(false);
  const [formDatas, setFormDatas] = useState({
    [careElementToAdd.valueKey]: "",
    [careElementToAdd.unitKey]: careElementToAdd.unit,
    Date: nowTZTimestamp(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "Date") {
      if (value === "") return;
      setFormDatas({
        ...formDatas,
        Date: dateISOToTimestampTZ(value) as number,
      });
      return;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async () => {
    setErrMsgPost("");
    const regex = /^\d+(\.\d{0,2})?$/;
    if (
      !formDatas[careElementToAdd.valueKey] ||
      !regex.test(formDatas[careElementToAdd.valueKey] as string)
    ) {
      setErrMsgPost(
        `Invalid ${careElementToAdd.name}: please enter a valid number.`
      );
      return;
    }
    if (careElementsDatas) {
      const topicToPut: CareElementType = {
        ...careElementsDatas,
        updates: [
          ...careElementsDatas.updates,
          { updated_by_id: user.id, date_updated: nowTZTimestamp() },
        ],
        [careElementToAdd.key]: [
          ...careElementsDatas[
            careElementToAdd.key as
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
          ],
          formDatas,
        ],
      };
      setProgress(true);
      topicPut.mutate(topicToPut, {
        onSuccess: () => {
          setAddVisible(false);
        },
        onSettled: () => {
          setProgress(false);
        },
      });
    } else {
      const topicToPost: Partial<CareElementType> = {
        patient_id: patientId,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
        [careElementToAdd.key]: [formDatas],
      };
      setProgress(true);
      topicPost.mutate(topicToPost, {
        onSuccess: () => {
          setAddVisible(false);
        },
        onSettled: () => {
          setProgress(false);
        },
      });
    }
  };
  const handleCancel = () => {
    setAddVisible(false);
  };

  return (
    <div className="care-elements__form-container">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="care-elements__form">
        <div className="care-elements__form-item">
          <label htmlFor="">Item</label>
          <p>{careElementToAdd.name}</p>
        </div>
        <div className="care-elements__form-item">
          <Input
            label="Result"
            value={formDatas[careElementToAdd.valueKey] as string}
            onChange={handleChange}
            name={careElementToAdd.valueKey}
            id="result"
          />
        </div>
        <div className="care-elements__form-item">
          <InputDate
            label="Date"
            value={timestampToDateISOTZ(formDatas.Date)}
            onChange={handleChange}
            name="Date"
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

export default CareElementForm;
