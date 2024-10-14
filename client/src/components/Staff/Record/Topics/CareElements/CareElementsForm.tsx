import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { ynIndicatorsimpleCT } from "../../../../../omdDatas/codesTables";
import { CareElementFormType, CareElementType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import {
  bodyMassIndex,
  bodySurfaceArea,
  cmToFeetAndInches,
  feetAndInchesToCm,
  kgToLbs,
  lbsToKg,
} from "../../../../../utils/measurements/measurements";
import { careElementsSchema } from "../../../../../validation/record/careElementsValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import GenericList from "../../../../UI/Lists/GenericList";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";

type CareElementsFormProps = {
  careElementPost: UseMutationResult<
    CareElementType,
    Error,
    Partial<CareElementType>,
    void
  >;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
};

const CareElementsForm = ({
  careElementPost,
  setPopUpVisible,
  patientId,
}: CareElementsFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [errMsgPost, setErrMsgPost] = useState("");
  const [formDatas, setFormDatas] = useState<Partial<CareElementFormType>>({
    patient_id: patientId,
    SmokingStatus: { Status: "", Date: nowTZTimestamp() },
    SmokingPacks: { PerDay: "", Date: nowTZTimestamp() },
    Weight: { Weight: "", WeightUnit: "kg", Date: nowTZTimestamp() },
    WeightLbs: { Weight: "", WeightUnit: "lbs", Date: nowTZTimestamp() },
    Height: { Height: "", HeightUnit: "cm", Date: nowTZTimestamp() },
    HeightFeet: { Height: "", HeightUnit: "ft in", Date: nowTZTimestamp() },
    WaistCircumference: {
      WaistCircumference: "",
      WaistCircumferenceUnit: "cm",
      Date: nowTZTimestamp(),
    },
    BloodPressure: {
      SystolicBP: "",
      DiastolicBP: "",
      BPUnit: "mmHg",
      Date: nowTZTimestamp(),
    },
    bodyMassIndex: { BMI: "", Date: nowTZTimestamp() },
    bodySurfaceArea: { BSA: "", Date: nowTZTimestamp() },
  });
  const [progress, setProgress] = useState(false);
  const [date, setDate] = useState(timestampToDateISOTZ(nowTZTimestamp()));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setErrMsgPost("");
    switch (name) {
      case "SmokingStatus":
        setFormDatas({
          ...formDatas,
          SmokingStatus: {
            ...formDatas.SmokingStatus,
            Status: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
          SmokingPacks:
            value === "N"
              ? {
                  ...formDatas.SmokingPacks,
                  PerDay: "0",
                  Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
                }
              : {
                  ...formDatas.SmokingPacks,
                  PerDay: "",
                  Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
                },
        });
        break;
      case "SmokingPacks":
        setFormDatas({
          ...formDatas,
          SmokingPacks: {
            ...formDatas.SmokingPacks,
            PerDay: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
          SmokingStatus: {
            ...formDatas.SmokingStatus,
            Status: Number(value) ? "Y" : "N",
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "Weight":
        setFormDatas({
          ...formDatas,
          Weight: {
            ...(formDatas.Weight as {
              Weight: string;
              WeightUnit: "kg";
              Date: number;
            }),
            Weight: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
          WeightLbs: {
            ...(formDatas.WeightLbs as {
              Weight: string;
              WeightUnit: "lbs";
              Date: number;
            }),
            Weight: kgToLbs(value),
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
          bodyMassIndex: {
            ...formDatas.bodyMassIndex,
            BMI: bodyMassIndex(formDatas.Height?.Height ?? "", value),
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
          bodySurfaceArea: {
            BSA: bodySurfaceArea(formDatas.Height?.Height ?? "", value),
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "WeightLbs":
        setFormDatas({
          ...formDatas,
          WeightLbs: {
            ...(formDatas.WeightLbs as {
              Weight: string;
              WeightUnit: "lbs";
              Date: number;
            }),
            Weight: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
          Weight: {
            ...(formDatas.Weight as {
              Weight: string;
              WeightUnit: "kg";
              Date: number;
            }),
            Weight: lbsToKg(value),
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
          bodyMassIndex: {
            ...formDatas.bodyMassIndex,
            BMI: bodyMassIndex(formDatas.Height?.Height ?? "", lbsToKg(value)),
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
          bodySurfaceArea: {
            ...formDatas.bodySurfaceArea,
            BSA: bodySurfaceArea(
              formDatas.Height?.Height ?? "",
              lbsToKg(value)
            ),
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "Height":
        setFormDatas({
          ...formDatas,
          Height: {
            ...(formDatas.Height as {
              Height: string;
              HeightUnit: "cm";
              Date: number;
            }),
            Height: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
          HeightFeet: {
            ...(formDatas.HeightFeet as {
              Height: string;
              HeightUnit: "ft in";
              Date: number;
            }),
            Height: cmToFeetAndInches(value),
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
          bodyMassIndex: {
            ...formDatas.bodyMassIndex,
            BMI: bodyMassIndex(value, formDatas.Weight?.Weight ?? ""),
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
          bodySurfaceArea: {
            ...formDatas.bodySurfaceArea,
            BSA: bodySurfaceArea(value, formDatas.Weight?.Weight ?? ""),
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "HeightFeet":
        setFormDatas({
          ...formDatas,
          HeightFeet: {
            ...(formDatas.HeightFeet as {
              Height: string;
              HeightUnit: "ft in";
              Date: number;
            }),
            Height: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
          Height: {
            ...(formDatas.Height as {
              Height: string;
              HeightUnit: "cm";
              Date: number;
            }),
            Height: feetAndInchesToCm(value),
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
          bodyMassIndex: {
            ...formDatas.bodyMassIndex,
            BMI: bodyMassIndex(
              feetAndInchesToCm(value),
              formDatas.Weight?.Weight ?? ""
            ),
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
          bodySurfaceArea: {
            ...formDatas.bodySurfaceArea,
            BSA: bodySurfaceArea(
              feetAndInchesToCm(value),
              formDatas.Weight?.Weight ?? ""
            ),
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "Waist":
        setFormDatas({
          ...formDatas,
          WaistCircumference: {
            ...(formDatas.WaistCircumference as {
              WaistCircumference: string;
              WaistCircumferenceUnit: "cm";
              Date: number;
            }),
            WaistCircumference: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "SystolicBP":
        setFormDatas({
          ...formDatas,
          BloodPressure: {
            ...(formDatas.BloodPressure as {
              SystolicBP: string;
              DiastolicBP: string;
              BPUnit: "mmHg";
              Date: number;
            }),
            SystolicBP: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "DiastolicBP":
        setFormDatas({
          ...formDatas,
          BloodPressure: {
            ...(formDatas.BloodPressure as {
              SystolicBP: string;
              DiastolicBP: string;
              BPUnit: "mmHg";
              Date: number;
            }),
            DiastolicBP: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      default:
        break;
    }
  };
  const handleSubmit = async () => {
    setErrMsgPost("");
    //Validation
    try {
      await careElementsSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    if (
      (formDatas.SmokingStatus?.Status === "Y" ||
        formDatas.SmokingStatus?.Status === "N") &&
      !formDatas.SmokingPacks?.PerDay
    ) {
      setErrMsgPost("Smoking Packs field is required (type 0 if no smoking)");
      return;
    }
    if (
      formDatas.BloodPressure?.SystolicBP &&
      !formDatas.BloodPressure?.DiastolicBP
    ) {
      setErrMsgPost("Diastolic field is required if you enter Systolic");
      return;
    }
    if (
      formDatas.BloodPressure?.DiastolicBP &&
      !formDatas.BloodPressure?.SystolicBP
    ) {
      setErrMsgPost("Systolic field is required if you enter Diastolic");
      return;
    }
    //Submission
    const careElementToPost: Partial<CareElementType> = {
      patient_id: patientId,
      SmokingStatus: formDatas.SmokingStatus?.Status
        ? [formDatas.SmokingStatus]
        : [],
      SmokingPacks: formDatas.SmokingPacks?.PerDay
        ? [formDatas.SmokingPacks]
        : [],
      Weight: formDatas.Weight?.Weight ? [formDatas.Weight] : [],
      Height: formDatas.Height?.Height ? [formDatas.Height] : [],
      WaistCircumference: formDatas.WaistCircumference?.WaistCircumference
        ? [formDatas.WaistCircumference]
        : [],
      BloodPressure: formDatas.BloodPressure?.Date
        ? [formDatas.BloodPressure]
        : [],
      bodyMassIndex: formDatas.bodyMassIndex?.BMI
        ? [formDatas.bodyMassIndex]
        : [],
      bodySurfaceArea: formDatas.bodySurfaceArea?.BSA
        ? [formDatas.bodySurfaceArea]
        : [],
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };

    setProgress(true);
    careElementPost.mutate(careElementToPost, {
      onSuccess: () => {
        setPopUpVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };
  const handleCancel = () => {
    setErrMsgPost("");
    setPopUpVisible(false);
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setErrMsgPost("");
    if (!value) return; //to avoid clearing the date
    setDate(value);
  };
  return (
    <div className="care-elements">
      <h1 className="care-elements__title">Patient care elements</h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div
        className="care-elements__card"
        style={{ border: errMsgPost && "solid 1.5px red" }}
      >
        <div className="care-elements__card-title">
          <span>Add new care elements</span>
          <div className="care-elements__card-btn-container">
            <SaveButton onClick={handleSubmit} disabled={progress} />
            <CancelButton onClick={handleCancel} disabled={progress} />
          </div>
        </div>
        <div className="care-elements__card-content">
          <div className="care-elements__card-content-row-add">
            <label>Date:</label>
            <InputDate onChange={handleDateChange} value={date} />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>Smoking:</label>
            <GenericList
              list={ynIndicatorsimpleCT}
              name="SmokingStatus"
              handleChange={handleChange}
              value={formDatas.SmokingStatus?.Status ?? ""}
              noneOption={false}
              placeHolder="Choose status..."
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>Smoking Packs (per day):</label>
            <Input
              name="SmokingPacks"
              onChange={handleChange}
              value={formDatas.SmokingPacks?.PerDay ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>Weight (kg):</label>
            <Input
              name="Weight"
              onChange={handleChange}
              value={formDatas.Weight?.Weight ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>Weight (lbs):</label>
            <Input
              name="WeightLbs"
              onChange={handleChange}
              value={formDatas.WeightLbs?.Weight ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>Height (cm):</label>
            <Input
              name="Height"
              onChange={handleChange}
              value={formDatas.Height?.Height ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>Height (ft in):</label>
            <Input
              name="HeightFeet"
              onChange={handleChange}
              value={formDatas.HeightFeet?.Height ?? ""}
              placeholder={`feet'inches"`}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>Body mass index (kg/m2):</label>
            <Input
              name="BMI"
              value={formDatas.bodyMassIndex?.BMI ?? ""}
              readOnly
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>Body surface area (m2):</label>
            <Input
              name="BSA"
              value={formDatas.bodySurfaceArea?.BSA ?? ""}
              readOnly
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>Waist circumference (cm):</label>
            <Input
              name="Waist"
              onChange={handleChange}
              value={formDatas.WaistCircumference?.WaistCircumference ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>Systolic (mmHg):</label>
            <Input
              name="SystolicBP"
              onChange={handleChange}
              value={formDatas.BloodPressure?.SystolicBP ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>Diastolic (mmHg):</label>
            <Input
              name="DiastolicBP"
              onChange={handleChange}
              value={formDatas.BloodPressure?.DiastolicBP ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareElementsForm;
