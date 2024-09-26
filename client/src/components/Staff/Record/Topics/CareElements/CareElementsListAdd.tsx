import React, { useState } from "react";
import { ynIndicatorsimpleCT } from "../../../../../omdDatas/codesTables";
import {
  CareElementAdditionalFormType,
  CareElementFormType,
} from "../../../../../types/api";
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
import Button from "../../../../UI/Buttons/Button";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import GenericList from "../../../../UI/Lists/GenericList";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import NewCareElementTopicForm from "./NewCareElementTopicForm";

type CareElementsListAddProps = {
  addFormDatas: Partial<CareElementFormType>;
  addFormAdditionalDatas: CareElementAdditionalFormType;
  setAddFormDatas: React.Dispatch<
    React.SetStateAction<Partial<CareElementFormType>>
  >;
  setAddFormAdditionalDatas: React.Dispatch<
    React.SetStateAction<CareElementAdditionalFormType>
  >;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  addDate: number;
  setAddDate: React.Dispatch<React.SetStateAction<number>>;
};

const CareElementsListAdd = ({
  addFormDatas,
  addFormAdditionalDatas,
  setAddFormDatas,
  setAddFormAdditionalDatas,
  setErrMsgPost,
  addDate,
  setAddDate,
}: CareElementsListAddProps) => {
  const [addTopic, setAddTopic] = useState(false);
  const handleAddTopic = () => {
    setAddTopic(true);
  };
  const handleAdditionalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setErrMsgPost("");
    setAddFormAdditionalDatas((prev) =>
      prev.map((item) =>
        item.Name === name
          ? { ...item, Data: { Value: value, Date: addDate } }
          : item
      )
    );
  };
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
    setAddFormAdditionalDatas(
      addFormAdditionalDatas.map((item) => ({
        ...item,
        Data: {
          ...item.Data,
          Date: dateISOToTimestampTZ(value) as number,
        },
      }))
    );
    setAddFormDatas({
      ...addFormDatas,
      SmokingStatus: {
        ...(addFormDatas.SmokingStatus as {
          Status: string;
          Date: number;
        }),
        Date: dateISOToTimestampTZ(value) as number,
      },
      SmokingPacks: {
        ...(addFormDatas.SmokingPacks as {
          PerDay: string;
          Date: number;
        }),
        Date: dateISOToTimestampTZ(value) as number,
      },
      Weight: {
        ...(addFormDatas.Weight as {
          Weight: string;
          WeightUnit: "kg";
          Date: number;
        }),
        Date: dateISOToTimestampTZ(value) as number,
      },
      WeightLbs: {
        ...(addFormDatas.WeightLbs as {
          Weight: string;
          WeightUnit: "lbs";
          Date: number;
        }),
        Date: dateISOToTimestampTZ(value) as number,
      },
      Height: {
        ...(addFormDatas.Height as {
          Height: string;
          HeightUnit: "cm";
          Date: number;
        }),
        Date: dateISOToTimestampTZ(value) as number,
      },
      HeightFeet: {
        ...(addFormDatas.HeightFeet as {
          Height: string;
          HeightUnit: "feet";
          Date: number;
        }),
        Date: dateISOToTimestampTZ(value) as number,
      },
      bodyMassIndex: {
        ...(addFormDatas.bodyMassIndex as {
          BMI: string;
          Date: number;
        }),
        Date: dateISOToTimestampTZ(value) as number,
      },
      bodySurfaceArea: {
        ...(addFormDatas.bodySurfaceArea as {
          BSA: string;
          Date: number;
        }),
        Date: dateISOToTimestampTZ(value) as number,
      },
      WaistCircumference: {
        ...(addFormDatas.WaistCircumference as {
          WaistCircumference: string;
          WaistCircumferenceUnit: "cm";
          Date: number;
        }),
        Date: dateISOToTimestampTZ(value) as number,
      },
      BloodPressure: {
        ...(addFormDatas.BloodPressure as {
          SystolicBP: string;
          DiastolicBP: string;
          BPUnit: "mmHg";
          Date: number;
        }),
        Date: dateISOToTimestampTZ(value) as number,
      },
    });
  };
  return (
    <>
      <div className="care-elements__card-content-btn">
        <Button onClick={handleAddTopic} label="Add item" />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>Date:</label>

        <InputDate
          onChange={handleDateChange}
          value={timestampToDateISOTZ(addDate)}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>Smoking:</label>

        <GenericList
          list={ynIndicatorsimpleCT}
          name="SmokingStatus"
          handleChange={handleChange}
          value={addFormDatas.SmokingStatus?.Status ?? ""}
          noneOption={false}
          placeHolder="Choose status..."
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>Smoking Packs (per day):</label>

        <Input
          name="SmokingPacks"
          onChange={handleChange}
          value={addFormDatas.SmokingPacks?.PerDay ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>Weight (kg):</label>
        <Input
          name="Weight"
          onChange={handleChange}
          value={addFormDatas.Weight?.Weight ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>Weight (lbs):</label>

        <Input
          name="WeightLbs"
          onChange={handleChange}
          value={addFormDatas.WeightLbs?.Weight ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>Height (cm):</label>

        <Input
          name="Height"
          onChange={handleChange}
          value={addFormDatas.Height?.Height ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>Height (feet):</label>

        <Input
          name="HeightFeet"
          onChange={handleChange}
          value={addFormDatas.HeightFeet?.Height ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>Body mass index (kg/m2):</label>

        <Input
          name="BMI"
          value={addFormDatas.bodyMassIndex?.BMI ?? ""}
          readOnly
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>Body surface area (m2):</label>

        <Input
          name="BSA"
          value={addFormDatas.bodySurfaceArea?.BSA ?? ""}
          readOnly
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>Waist circumference (cm):</label>

        <Input
          name="Waist"
          onChange={handleChange}
          value={addFormDatas.WaistCircumference?.WaistCircumference ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>Systolic (mmHg):</label>

        <Input
          name="SystolicBP"
          onChange={handleChange}
          value={addFormDatas.BloodPressure?.SystolicBP ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>Diastolic (mmHg):</label>

        <Input
          name="DiastolicBP"
          onChange={handleChange}
          value={addFormDatas.BloodPressure?.DiastolicBP ?? ""}
        />
      </div>
      {addFormAdditionalDatas.map((addAdditionalData) => (
        <div
          className="care-elements__card-content-row-add"
          key={addAdditionalData.Name}
        >
          <label>
            {addAdditionalData.Name} ({addAdditionalData.Unit}):
          </label>

          <Input
            name={addAdditionalData.Name}
            onChange={handleAdditionalChange}
            value={addAdditionalData.Data?.Value ?? ""}
          />
        </div>
      ))}
      {addTopic && (
        <FakeWindow
          title={`ADD A NEW CARE ELEMENT ITEM`}
          width={400}
          height={250}
          x={(window.innerWidth - 400) / 2}
          y={(window.innerHeight - 250) / 2}
          color="#577399"
          setPopUpVisible={setAddTopic}
        >
          <NewCareElementTopicForm
            setAddFormAdditionalDatas={setAddFormAdditionalDatas}
            setAddTopic={setAddTopic}
            addDate={addDate}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default CareElementsListAdd;
