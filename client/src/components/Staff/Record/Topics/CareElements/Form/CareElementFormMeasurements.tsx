import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import { CareElementType } from "../../../../../../types/api";
import { UserStaffType } from "../../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
  todayTZTimestamp,
} from "../../../../../../utils/dates/formatDates";
import {
  bodyMassIndex,
  bodySurfaceArea,
  cmToFeetAndInches,
  feetAndInchesToCm,
  kgToLbs,
} from "../../../../../../utils/measurements/measurements";
import CancelButton from "../../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../../UI/Buttons/SaveButton";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";

type CareElementFormMeasurementsProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
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

const CareElementFormMeasurements = ({
  setAddVisible,
  careElementsDatas,
  patientId,
  topicPost,
  topicPut,
}: CareElementFormMeasurementsProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [errMsgPost, setErrMsgPost] = useState<string | null>(null);
  const [progress, setProgress] = useState(false);
  const [formDatasKg, setFormDatasKg] = useState({
    Weight: "",
    WeightUnit: "kg" as const,
    Date: todayTZTimestamp(),
  });
  const [formDatasLbs, setFormDatasLbs] = useState({
    Weight: "",
    WeightUnit: "lbs" as const,
    Date: todayTZTimestamp(),
  });
  const [formDatasCm, setFormDatasCm] = useState({
    Height: "",
    HeightUnit: "cm" as const,
    Date: todayTZTimestamp(),
  });
  const [formDatasFtIn, setFormDatasFtIn] = useState({
    Height: "",
    HeightUnit: "ft in" as const,
    Date: todayTZTimestamp(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const { name, value } = e.target;
    switch (name) {
      case "Date":
        if (value === "") return;
        setFormDatasKg({
          ...formDatasKg,
          Date: dateISOToTimestampTZ(value) as number,
        });
        setFormDatasLbs({
          ...formDatasLbs,
          Date: dateISOToTimestampTZ(value) as number,
        });
        return;
      case "kg":
        setFormDatasKg({ ...formDatasKg, Weight: value });
        setFormDatasLbs({
          ...formDatasLbs,
          Weight: kgToLbs(value),
        });
        return;
      case "lbs":
        setFormDatasLbs({ ...formDatasLbs, Weight: value });
        setFormDatasKg({
          ...formDatasKg,
          Weight: value,
        });
        return;
      case "cm":
        setFormDatasCm({ ...formDatasCm, Height: value });
        setFormDatasFtIn({
          ...formDatasFtIn,
          Height: cmToFeetAndInches(value),
        });
        return;
      case "ft in":
        setFormDatasFtIn({ ...formDatasFtIn, Height: value });
        setFormDatasCm({
          ...formDatasCm,
          Height: feetAndInchesToCm(value),
        });
        return;
    }
  };

  const handleSubmit = async () => {
    setErrMsgPost("");
    const regex = /^\d+(\.\d{0,5})?$/;
    const regex2 = /^\s*\d{1,2}'\d{1,2}"?\s*$|^\s*\d{1,2}\s*$/;
    if (!regex.test(formDatasKg.Weight)) {
      setErrMsgPost(`Invalid Weight (kg): please enter a valid number.`);
      return;
    }
    if (!regex.test(formDatasLbs.Weight)) {
      setErrMsgPost(`Invalid Weight (lbs): please enter a valid number.`);
      return;
    }
    if (!regex.test(formDatasCm.Height)) {
      setErrMsgPost(`Invalid Height (cm): please enter a valid number.`);
      return;
    }
    if (!regex2.test(formDatasFtIn.Height)) {
      setErrMsgPost(
        `Invalid Height (ft in): please enter a valid format : ft'in" (5'7") or ft (5)`
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
        Weight: [...careElementsDatas.Weight, formDatasKg],
        Height: [...careElementsDatas.Height, formDatasCm],
        bodyMassIndex: [
          ...careElementsDatas.bodyMassIndex,
          {
            BMI: bodyMassIndex(formDatasCm.Height, formDatasKg.Weight),
            Date: formDatasKg.Date,
          },
        ],
        bodySurfaceArea: [
          ...careElementsDatas.bodySurfaceArea,
          {
            BSA: bodySurfaceArea(formDatasCm.Height, formDatasKg.Weight),
            Date: formDatasKg.Date,
          },
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
        Weight: [formDatasKg],
        Height: [formDatasCm],
        bodyMassIndex: [
          {
            BMI: bodyMassIndex(formDatasCm.Height, formDatasKg.Weight),
            Date: formDatasKg.Date,
          },
        ],
        bodySurfaceArea: [
          {
            BSA: bodySurfaceArea(formDatasCm.Height, formDatasKg.Weight),
            Date: formDatasKg.Date,
          },
        ],
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
          <p>Measurements</p>
        </div>
        <div className="care-elements__form-item">
          <Input
            label="Weight (kg)"
            value={formDatasKg.Weight}
            onChange={handleChange}
            name="kg"
            id="kg"
          />
        </div>
        <div className="care-elements__form-item">
          <Input
            label="Weight (lbs)"
            value={formDatasLbs.Weight}
            onChange={handleChange}
            name="lbs"
            id="lbs"
          />
        </div>
        <div className="care-elements__form-item">
          <Input
            label="Height (cm)"
            value={formDatasCm.Height}
            onChange={handleChange}
            name="cm"
            id="cm"
          />
        </div>
        <div className="care-elements__form-item">
          <Input
            label="Height (ft in)"
            value={formDatasFtIn.Height}
            onChange={handleChange}
            name="ft in"
            id="ft in"
            placeholder={`feet'inches"`}
          />
        </div>
        <div className="care-elements__form-item">
          <InputDate
            label="Date"
            value={timestampToDateISOTZ(formDatasKg.Date)}
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

export default CareElementFormMeasurements;
