import React from "react";
import { ynIndicatorsimpleCT } from "../../../../../omdDatas/codesTables";
import { CareElementFormType } from "../../../../../types/api";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import {
  bodyMassIndex,
  bodySurfaceArea,
  cmToFeet,
  feetToCm,
  kgToLbs,
  lbsToKg,
} from "../../../../../utils/measurements/measurements";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import GenericList from "../../../../UI/Lists/GenericList";

type CareElementsListAddProps = {
  addFormDatas: Partial<CareElementFormType>;
  setAddFormDatas: React.Dispatch<
    React.SetStateAction<Partial<CareElementFormType>>
  >;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  addDate: number;
  setAddDate: React.Dispatch<React.SetStateAction<number>>;
};

const CareElementsListAdd = ({
  addFormDatas,
  setAddFormDatas,
  setErrMsgPost,
  addDate,
  setAddDate,
}: CareElementsListAddProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setErrMsgPost("");
    switch (name) {
      case "SmokingStatus":
        setAddFormDatas({
          ...addFormDatas,
          SmokingStatus: {
            ...addFormDatas.SmokingStatus,
            Status: value,
            Date: addDate,
          },
          SmokingPacks:
            value === "N"
              ? {
                  ...addFormDatas.SmokingPacks,
                  PerDay: "0",
                  Date: addDate,
                }
              : {
                  ...addFormDatas.SmokingPacks,
                  PerDay: "",
                  Date: addDate,
                },
        });
        break;
      case "SmokingPacks":
        setAddFormDatas({
          ...addFormDatas,
          SmokingPacks: {
            ...addFormDatas.SmokingPacks,
            PerDay: value,
            Date: addDate,
          },
          SmokingStatus: {
            ...addFormDatas.SmokingStatus,
            Status: Number(value) ? "Y" : "N",
            Date: addDate,
          },
        });
        break;
      case "Weight":
        setAddFormDatas({
          ...addFormDatas,
          Weight: {
            ...(addFormDatas.Weight as {
              Weight: string;
              WeightUnit: "kg";
              Date: number;
            }),
            Weight: value,
            Date: addDate,
          },
          WeightLbs: {
            ...(addFormDatas.WeightLbs as {
              Weight: string;
              WeightUnit: "lbs";
              Date: number;
            }),
            Weight: kgToLbs(value),
            Date: addDate,
          },
          bodyMassIndex: {
            ...addFormDatas.bodyMassIndex,
            BMI: bodyMassIndex(addFormDatas.Height?.Height ?? "", value),
            Date: addDate,
          },
          bodySurfaceArea: {
            BSA: bodySurfaceArea(addFormDatas.Height?.Height ?? "", value),
            Date: addDate,
          },
        });
        break;
      case "WeightLbs":
        setAddFormDatas({
          ...addFormDatas,
          WeightLbs: {
            ...(addFormDatas.WeightLbs as {
              Weight: string;
              WeightUnit: "lbs";
              Date: number;
            }),
            Weight: value,
            Date: addDate,
          },
          Weight: {
            ...(addFormDatas.Weight as {
              Weight: string;
              WeightUnit: "kg";
              Date: number;
            }),
            Weight: lbsToKg(value),
            Date: addDate,
          },
          bodyMassIndex: {
            ...addFormDatas.bodyMassIndex,
            BMI: bodyMassIndex(
              addFormDatas.Height?.Height ?? "",
              lbsToKg(value)
            ),
            Date: addDate,
          },
          bodySurfaceArea: {
            ...addFormDatas.bodySurfaceArea,
            BSA: bodySurfaceArea(
              addFormDatas.Height?.Height ?? "",
              lbsToKg(value)
            ),
            Date: addDate,
          },
        });
        break;
      case "Height":
        setAddFormDatas({
          ...addFormDatas,
          Height: {
            ...(addFormDatas.Height as {
              Height: string;
              HeightUnit: "cm";
              Date: number;
            }),
            Height: value,
            Date: addDate,
          },
          HeightFeet: {
            ...(addFormDatas.HeightFeet as {
              Height: string;
              HeightUnit: "feet";
              Date: number;
            }),
            Height: cmToFeet(value),
            Date: addDate,
          },
          bodyMassIndex: {
            ...addFormDatas.bodyMassIndex,
            BMI: bodyMassIndex(value, addFormDatas.Weight?.Weight ?? ""),
            Date: addDate,
          },
          bodySurfaceArea: {
            ...addFormDatas.bodySurfaceArea,
            BSA: bodySurfaceArea(value, addFormDatas.Weight?.Weight ?? ""),
            Date: addDate,
          },
        });
        break;
      case "HeightFeet":
        setAddFormDatas({
          ...addFormDatas,
          HeightFeet: {
            ...(addFormDatas.HeightFeet as {
              Height: string;
              HeightUnit: "feet";
              Date: number;
            }),
            Height: value,
            Date: addDate,
          },
          Height: {
            ...(addFormDatas.Height as {
              Height: string;
              HeightUnit: "cm";
              Date: number;
            }),
            Height: feetToCm(value),
            Date: addDate,
          },
          bodyMassIndex: {
            ...addFormDatas.bodyMassIndex,
            BMI: bodyMassIndex(
              feetToCm(value),
              addFormDatas.Weight?.Weight ?? ""
            ),
            Date: addDate,
          },
          bodySurfaceArea: {
            ...addFormDatas.bodySurfaceArea,
            BSA: bodySurfaceArea(
              feetToCm(value),
              addFormDatas.Weight?.Weight ?? ""
            ),
            Date: addDate,
          },
        });
        break;
      case "Waist":
        setAddFormDatas({
          ...addFormDatas,
          WaistCircumference: {
            ...(addFormDatas.WaistCircumference as {
              WaistCircumference: string;
              WaistCircumferenceUnit: "cm";
              Date: number;
            }),
            WaistCircumference: value,
            Date: addDate,
          },
        });
        break;
      case "SystolicBP":
        setAddFormDatas({
          ...addFormDatas,
          BloodPressure: {
            ...(addFormDatas.BloodPressure as {
              SystolicBP: string;
              DiastolicBP: string;
              BPUnit: "mmHg";
              Date: number;
            }),
            SystolicBP: value,
            Date: addDate,
          },
        });
        break;
      case "DiastolicBP":
        setAddFormDatas({
          ...addFormDatas,
          BloodPressure: {
            ...(addFormDatas.BloodPressure as {
              SystolicBP: string;
              DiastolicBP: string;
              BPUnit: "mmHg";
              Date: number;
            }),
            DiastolicBP: value,
            Date: addDate,
          },
        });
        break;
      default:
        break;
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    setErrMsgPost("");
    setAddDate(dateISOToTimestampTZ(value) as number);
  };
  return (
    <>
      <div className="care-elements__row">
        <label className="care-elements__row-label">Date:</label>
        <div className="care-elements__row-value care-elements__row-value--add">
          <InputDate
            onChange={handleDateChange}
            value={timestampToDateISOTZ(addDate)}
          />
        </div>
      </div>
      <div className="care-elements__row">
        <label className="care-elements__row-label">Smoking:</label>
        <div className="care-elements__row-value care-elements__row-value--add">
          <GenericList
            list={ynIndicatorsimpleCT}
            name="SmokingStatus"
            handleChange={handleChange}
            value={addFormDatas.SmokingStatus?.Status ?? ""}
            noneOption={false}
          />
        </div>
      </div>
      <div className="care-elements__row">
        <label className="care-elements__row-label">
          Smoking Packs (per day):
        </label>
        <div className="care-elements__row-value care-elements__row-value--add">
          <Input
            name="SmokingPacks"
            onChange={handleChange}
            value={addFormDatas.SmokingPacks?.PerDay ?? ""}
          />
        </div>
      </div>
      <div className="care-elements__row">
        <label className="care-elements__row-label">Weight (kg):</label>
        <div className="care-elements__row-value care-elements__row-value--add">
          <Input
            name="Weight"
            onChange={handleChange}
            value={addFormDatas.Weight?.Weight ?? ""}
          />
        </div>
      </div>
      <div className="care-elements__row">
        <label className="care-elements__row-label">Weight (lbs):</label>
        <div className="care-elements__row-value care-elements__row-value--add">
          <Input
            name="WeightLbs"
            onChange={handleChange}
            value={addFormDatas.WeightLbs?.Weight ?? ""}
          />
        </div>
      </div>
      <div className="care-elements__row">
        <label className="care-elements__row-label">Height (cm):</label>
        <div className="care-elements__row-value care-elements__row-value--add">
          <Input
            name="Height"
            onChange={handleChange}
            value={addFormDatas.Height?.Height ?? ""}
          />
        </div>
      </div>
      <div className="care-elements__row">
        <label className="care-elements__row-label">Height (feet):</label>
        <div className="care-elements__row-value care-elements__row-value--add">
          <Input
            name="HeightFeet"
            onChange={handleChange}
            value={addFormDatas.HeightFeet?.Height ?? ""}
          />
        </div>
      </div>
      <div className="care-elements__row">
        <label className="care-elements__row-label">
          Body mass index (kg/m2):
        </label>
        <div className="care-elements__row-value care-elements__row-value--add">
          <Input
            name="BMI"
            value={addFormDatas.bodyMassIndex?.BMI ?? ""}
            readOnly
          />
        </div>
      </div>
      <div className="care-elements__row">
        <label className="care-elements__row-label">
          Body surface area (m2):
        </label>
        <div className="care-elements__row-value care-elements__row-value--add">
          <Input
            name="BSA"
            value={addFormDatas.bodySurfaceArea?.BSA ?? ""}
            readOnly
          />
        </div>
      </div>
      <div className="care-elements__row">
        <label className="care-elements__row-label">
          Waist circumference (cm):
        </label>
        <div className="care-elements__row-value care-elements__row-value--add">
          <Input
            name="Waist"
            onChange={handleChange}
            value={addFormDatas.WaistCircumference?.WaistCircumference ?? ""}
          />
        </div>
      </div>
      <div className="care-elements__row">
        <label className="care-elements__row-label">Systolic (mmHg):</label>
        <div className="care-elements__row-value care-elements__row-value--add">
          <Input
            name="SystolicBP"
            onChange={handleChange}
            value={addFormDatas.BloodPressure?.SystolicBP ?? ""}
          />
        </div>
      </div>
      <div className="care-elements__row">
        <label className="care-elements__row-label">Diastolic (mmHg):</label>
        <div className="care-elements__row-value care-elements__row-value--add">
          <Input
            name="DiastolicBP"
            onChange={handleChange}
            value={addFormDatas.BloodPressure?.DiastolicBP ?? ""}
          />
        </div>
      </div>
    </>
  );
};

export default CareElementsListAdd;
