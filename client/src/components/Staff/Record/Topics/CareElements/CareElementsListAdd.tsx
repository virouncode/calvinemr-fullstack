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
  cmToFeetAndInches,
  feetAndInchesToCm,
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
              HeightUnit: "ft in";
              Date: number;
            }),
            Height: cmToFeetAndInches(value),
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
              HeightUnit: "ft in";
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
            Height: feetAndInchesToCm(value),
            Date: addDate,
          },
          bodyMassIndex: {
            ...addFormDatas.bodyMassIndex,
            BMI: bodyMassIndex(
              feetAndInchesToCm(value),
              addFormDatas.Weight?.Weight ?? ""
            ),
            Date: addDate,
          },
          bodySurfaceArea: {
            ...addFormDatas.bodySurfaceArea,
            BSA: bodySurfaceArea(
              feetAndInchesToCm(value),
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
      case "FSH":
        setAddFormDatas({
          ...addFormDatas,
          FSH: {
            ...(addFormDatas.FSH as {
              FSH: string;
              FSHUnit: "IU/L";
              Date: number;
            }),
            FSH: value,
            Date: addDate,
          },
        });
        break;
      case "E2":
        setAddFormDatas({
          ...addFormDatas,
          E2: {
            ...(addFormDatas.E2 as {
              E2: string;
              E2Unit: "pmol/L";
              Date: number;
            }),
            E2: value,
            Date: addDate,
          },
        });
        break;
      case "AMH":
        setAddFormDatas({
          ...addFormDatas,
          AMH: {
            ...(addFormDatas.AMH as {
              AMH: string;
              AMHUnit: "pmol/L";
              Date: number;
            }),
            AMH: value,
            Date: addDate,
          },
        });
        break;
      case "DHEAS":
        setAddFormDatas({
          ...addFormDatas,
          DHEAS: {
            ...(addFormDatas.DHEAS as {
              DHEAS: string;
              DHEASUnit: "ug/dL";
              Date: number;
            }),
            DHEAS: value,
            Date: addDate,
          },
        });
        break;
      case "HCG":
        setAddFormDatas({
          ...addFormDatas,
          HCG: {
            ...(addFormDatas.HCG as {
              HCG: string;
              HCGUnit: "IU/L";
              Date: number;
            }),
            HCG: value,
            Date: addDate,
          },
        });
        break;
      case "LH":
        setAddFormDatas({
          ...addFormDatas,
          LH: {
            ...(addFormDatas.LH as {
              LH: string;
              LHUnit: "IU/L";
              Date: number;
            }),
            LH: value,
            Date: addDate,
          },
        });
        break;
      case "PRL":
        setAddFormDatas({
          ...addFormDatas,
          PRL: {
            ...(addFormDatas.PRL as {
              PRL: string;
              PRLUnit: "ng/mL";
              Date: number;
            }),
            PRL: value,
            Date: addDate,
          },
        });
        break;
      case "P4":
        setAddFormDatas({
          ...addFormDatas,
          P4: {
            ...(addFormDatas.P4 as {
              P4: string;
              P4Unit: "ng/mL";
              Date: number;
            }),
            P4: value,
            Date: addDate,
          },
        });
        break;
      case "TSH":
        setAddFormDatas({
          ...addFormDatas,
          TSH: {
            ...(addFormDatas.TSH as {
              TSH: string;
              TSHUnit: "uIU/mL";
              Date: number;
            }),
            TSH: value,
            Date: addDate,
          },
        });
        break;
      case "Testosterone":
        setAddFormDatas({
          ...addFormDatas,
          Testosterone: {
            ...(addFormDatas.Testosterone as {
              Testosterone: string;
              TestosteroneUnit: "nmol/L";
              Date: number;
            }),
            Testosterone: value,
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
          HeightUnit: "ft in";
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
        <label>Height (ft in):</label>
        <Input
          name="HeightFeet"
          onChange={handleChange}
          value={addFormDatas.HeightFeet?.Height ?? ""}
          placeholder={`feet'inches"`}
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
      <div className="care-elements__card-content-row-add">
        <label>E2 (pmol/L):</label>
        <Input
          name="E2"
          onChange={handleChange}
          value={addFormDatas.E2?.E2 ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>LH (IU/L):</label>
        <Input
          name="LH"
          onChange={handleChange}
          value={addFormDatas.LH?.LH ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>P4 (ng/mL):</label>
        <Input
          name="P4"
          onChange={handleChange}
          value={addFormDatas.P4?.P4 ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>FSH (IU/L):</label>
        <Input
          name="FSH"
          onChange={handleChange}
          value={addFormDatas.FSH?.FSH ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>AMH (pmol/L):</label>
        <Input
          name="AMH"
          onChange={handleChange}
          value={addFormDatas.AMH?.AMH ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>DHEAS (ug/dL):</label>
        <Input
          name="DHEAS"
          onChange={handleChange}
          value={addFormDatas.DHEAS?.DHEAS ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>HCG (IU/L):</label>
        <Input
          name="HCG"
          onChange={handleChange}
          value={addFormDatas.HCG?.HCG ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>PRL (ng/mL):</label>
        <Input
          name="PRL"
          onChange={handleChange}
          value={addFormDatas.PRL?.PRL ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>TSH (uIU/mL):</label>
        <Input
          name="TSH"
          onChange={handleChange}
          value={addFormDatas.TSH?.TSH ?? ""}
        />
      </div>
      <div className="care-elements__card-content-row-add">
        <label>Testosterone (nmol/L):</label>
        <Input
          name="Testosterone"
          onChange={handleChange}
          value={addFormDatas.Testosterone?.Testosterone ?? ""}
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
