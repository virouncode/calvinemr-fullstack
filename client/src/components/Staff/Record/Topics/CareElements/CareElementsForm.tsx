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
    FSH: { FSH: "", FSHUnit: "IU/L", Date: nowTZTimestamp() },
    E2: { E2: "", E2Unit: "pmol/L", Date: nowTZTimestamp() },
    AMHP: { AMHP: "", AMHPUnit: "pmol/L", Date: nowTZTimestamp() },
    DHEA: { DHEA: "", DHEAUnit: "ug/dL", Date: nowTZTimestamp() },
    HCG: { HCG: "", HCGUnit: "IU/L", Date: nowTZTimestamp() },
    LH: { LH: "", LHUnit: "IU/L", Date: nowTZTimestamp() },
    PRL: { PRL: "", PRLUnit: "ng/mL", Date: nowTZTimestamp() },
    P4: { P4: "", P4Unit: "ng/mL", Date: nowTZTimestamp() },
    TSH: { TSH: "", TSHUnit: "uIU/mL", Date: nowTZTimestamp() },
    Testosterone: {
      Testosterone: "",
      TestosteroneUnit: "nmol/L",
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
      case "FSH":
        setFormDatas({
          ...formDatas,
          FSH: {
            ...(formDatas.FSH as {
              FSH: string;
              FSHUnit: "IU/L";
              Date: number;
            }),
            FSH: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "E2":
        setFormDatas({
          ...formDatas,
          E2: {
            ...(formDatas.E2 as { E2: string; E2Unit: "pmol/L"; Date: number }),
            E2: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "AMHP":
        setFormDatas({
          ...formDatas,
          AMHP: {
            ...(formDatas.AMHP as {
              AMHP: string;
              AMHPUnit: "pmol/L";
              Date: number;
            }),
            AMHP: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "DHEA":
        setFormDatas({
          ...formDatas,
          DHEA: {
            ...(formDatas.DHEA as {
              DHEA: string;
              DHEAUnit: "ug/dL";
              Date: number;
            }),
            DHEA: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "HCG":
        setFormDatas({
          ...formDatas,
          HCG: {
            ...(formDatas.HCG as {
              HCG: string;
              HCGUnit: "IU/L";
              Date: number;
            }),
            HCG: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "LH":
        setFormDatas({
          ...formDatas,
          LH: {
            ...(formDatas.LH as { LH: string; LHUnit: "IU/L"; Date: number }),
            LH: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "PRL":
        setFormDatas({
          ...formDatas,
          PRL: {
            ...(formDatas.PRL as {
              PRL: string;
              PRLUnit: "ng/mL";
              Date: number;
            }),
            PRL: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "P4":
        setFormDatas({
          ...formDatas,
          P4: {
            ...(formDatas.P4 as { P4: string; P4Unit: "ng/mL"; Date: number }),
            P4: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "TSH":
        setFormDatas({
          ...formDatas,
          TSH: {
            ...(formDatas.TSH as {
              TSH: string;
              TSHUnit: "uIU/mL";
              Date: number;
            }),
            TSH: value,
            Date: dateISOToTimestampTZ(date) ?? nowTZTimestamp(),
          },
        });
        break;
      case "Testosterone":
        setFormDatas({
          ...formDatas,
          Testosterone: {
            ...(formDatas.Testosterone as {
              Testosterone: string;
              TestosteroneUnit: "nmol/L";
              Date: number;
            }),
            Testosterone: value,
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
      FSH: formDatas.FSH?.FSH ? [formDatas.FSH] : [],
      E2: formDatas.E2?.E2 ? [formDatas.E2] : [],
      AMHP: formDatas.AMHP?.AMHP ? [formDatas.AMHP] : [],
      DHEA: formDatas.DHEA?.DHEA ? [formDatas.DHEA] : [],
      HCG: formDatas.HCG?.HCG ? [formDatas.HCG] : [],
      LH: formDatas.LH?.LH ? [formDatas.LH] : [],
      PRL: formDatas.PRL?.PRL ? [formDatas.PRL] : [],
      P4: formDatas.P4?.P4 ? [formDatas.P4] : [],
      TSH: formDatas.TSH?.TSH ? [formDatas.TSH] : [],
      Testosterone: formDatas.Testosterone?.Testosterone
        ? [formDatas.Testosterone]
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
          <div className="care-elements__card-content-row-add">
            <label>E2 (pmol/L):</label>
            <Input
              name="E2"
              onChange={handleChange}
              value={formDatas.E2?.E2 ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>LH (IU/L):</label>
            <Input
              name="LH"
              onChange={handleChange}
              value={formDatas.LH?.LH ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>P4 (ng/mL):</label>
            <Input
              name="P4"
              onChange={handleChange}
              value={formDatas.P4?.P4 ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>FSH (IU/L):</label>
            <Input
              name="FSH"
              onChange={handleChange}
              value={formDatas.FSH?.FSH ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>AMHP (pmol/L):</label>
            <Input
              name="AMHP"
              onChange={handleChange}
              value={formDatas.AMHP?.AMHP ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>DHEA (umol/L):</label>
            <Input
              name="DHEA"
              onChange={handleChange}
              value={formDatas.DHEA?.DHEA ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>HCG (IU/L):</label>
            <Input
              name="HCG"
              onChange={handleChange}
              value={formDatas.HCG?.HCG ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>PRL (ng/mL):</label>
            <Input
              name="PRL"
              onChange={handleChange}
              value={formDatas.PRL?.PRL ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>TSH (mIU/L):</label>
            <Input
              name="TSH"
              onChange={handleChange}
              value={formDatas.TSH?.TSH ?? ""}
            />
          </div>
          <div className="care-elements__card-content-row-add">
            <label>Testosterone (nmol/L):</label>
            <Input
              name="Testosterone"
              onChange={handleChange}
              value={formDatas.Testosterone?.Testosterone ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareElementsForm;
