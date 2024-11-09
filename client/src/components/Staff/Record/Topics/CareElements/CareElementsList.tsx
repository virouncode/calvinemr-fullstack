import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  CareElementAdditionalFormType,
  CareElementAdditionalType,
  CareElementFormType,
  CareElementHistoryTopicType,
  CareElementLastDatasType,
  CareElementType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import {
  bodyMassIndex,
  bodySurfaceArea,
} from "../../../../../utils/measurements/measurements";
import { careElementsSchema } from "../../../../../validation/record/careElementsValidation";
import Button from "../../../../UI/Buttons/Button";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import CareElementsListAdd from "./CareElementsListAdd";
import CareElementsListContent from "./CareElementsListContent";
import CareElementAdditionalHistory from "./History/CareElementAdditionalHistory";
import CareElementHistory from "./History/CareElementHistory";

type CareElementsListProps = {
  careElementPut: UseMutationResult<
    CareElementType,
    Error,
    CareElementType,
    void
  >;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  datas: CareElementType;
  patientName: string;
  additionalDatas: CareElementAdditionalType[];
};

const CareElementsList = ({
  careElementPut,
  setPopUpVisible,
  datas,
  patientName,
  additionalDatas,
}: CareElementsListProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [progress, setProgress] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [addVisible, setAddVisible] = useState(false);
  const [historyTopic, setHistoryTopic] =
    useState<CareElementHistoryTopicType>("SMOKING STATUS");
  const [historyDatas, setHistoryDatas] = useState<unknown[]>([]);
  const [historyUnit, setHistoryUnit] = useState<string>("");
  const [historyVisible, setHistoryVisible] = useState(false);
  const [additionalHistoryTopic, setAdditionalHistoryTopic] =
    useState<string>("");
  const [additionalHistoryDatas, setAdditionalHistoryDatas] = useState<
    { Value: string; Date: number }[]
  >([]);
  const [additionalHistoryUnit, setAdditionalHistoryUnit] = useState("");
  const [additionalHistoryVisible, setAdditionalHistoryVisible] =
    useState(false);
  const [addFormDatas, setAddFormDatas] = useState<
    Partial<CareElementFormType>
  >({
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
  const [addDate, setAddDate] = useState(nowTZTimestamp());
  const [addFormAdditionalDatas, setAddFormAdditionalDatas] =
    useState<CareElementAdditionalFormType>(
      additionalDatas.map((additionalData) => ({
        Name: additionalData.Name,
        Unit: additionalData.Unit,
        Data: { Value: "", Date: nowTZTimestamp() },
      }))
    );

  const lastDatas: CareElementLastDatasType | null = datas
    ? {
        SmokingStatus: datas.SmokingStatus?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || { Status: "", Date: null },
        SmokingPacks: datas.SmokingPacks?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || { PerDay: "", Date: null },
        Weight: datas.Weight?.sort((a, b) => b.Date - a.Date)?.[0] || {
          Weight: "",
          WeightUnit: "kg",
          Date: null,
        },
        Height: datas.Height?.sort((a, b) => b.Date - a.Date)?.[0] || {
          Height: "",
          HeightUnit: "cm",
          Date: null,
        },
        WaistCircumference: datas.WaistCircumference?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || {
          WaistCircumference: "",
          WaistCircumferenceUnit: "cm",
          Date: null,
        },
        BloodPressure: datas.BloodPressure?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || {
          SystolicBP: "",
          DiastolicBP: "",
          BPUnit: "mmHg",
          Date: null,
        },
        bodyMassIndex: datas.bodyMassIndex?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || { BMI: "", Date: null },
        bodySurfaceArea: datas.bodySurfaceArea?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || { BSA: "", Date: null },
        FSH: datas.FSH?.sort((a, b) => b.Date - a.Date)?.[0] || {
          FSH: "",
          FSHUnit: "IU/L",
          Date: null,
        },
        E2: datas.E2?.sort((a, b) => b.Date - a.Date)?.[0] || {
          E2: "",
          E2Unit: "pmol/L",
          Date: null,
        },
        AMHP: datas.AMHP?.sort((a, b) => b.Date - a.Date)?.[0] || {
          AMHP: "",
          AMHPUnit: "pmol/L",
          Date: null,
        },
        DHEA: datas.DHEA?.sort((a, b) => b.Date - a.Date)?.[0] || {
          DHEA: "",
          DHEAUnit: "ug/dL",
          Date: null,
        },
        HCG: datas.HCG?.sort((a, b) => b.Date - a.Date)?.[0] || {
          HCG: "",
          HCGUnit: "IU/L",
          Date: null,
        },
        LH: datas.LH?.sort((a, b) => b.Date - a.Date)?.[0] || {
          LH: "",
          LHUnit: "IU/L",
          Date: null,
        },
        PRL: datas.PRL?.sort((a, b) => b.Date - a.Date)?.[0] || {
          PRL: "",
          PRLUnit: "ng/mL",
          Date: null,
        },
        P4: datas.P4?.sort((a, b) => b.Date - a.Date)?.[0] || {
          P4: "",
          P4Unit: "ng/mL",
          Date: null,
        },
        TSH: datas.TSH?.sort((a, b) => b.Date - a.Date)?.[0] || {
          TSH: "",
          TSHUnit: "uIU/mL",
          Date: null,
        },
        Testosterone: datas.Testosterone?.sort(
          (a, b) => b.Date - a.Date
        )?.[0] || {
          Testosterone: "",
          TestosteroneUnit: "nmol/L",
          Date: null,
        },
      }
    : {
        SmokingStatus: { Status: "", Date: null },
        SmokingPacks: { PerDay: "", Date: null },
        Weight: { Weight: "", WeightUnit: "kg", Date: null },
        Height: { Height: "", HeightUnit: "cm", Date: null },
        WaistCircumference: {
          WaistCircumference: "",
          WaistCircumferenceUnit: "cm",
          Date: null,
        },
        BloodPressure: {
          SystolicBP: "",
          DiastolicBP: "",
          BPUnit: "mmHg",
          Date: null,
        },
        bodyMassIndex: { BMI: "", Date: null },
        bodySurfaceArea: { BSA: "", Date: null },
        FSH: { FSH: "", FSHUnit: "IU/L", Date: null },
        E2: { E2: "", E2Unit: "pmol/L", Date: null },
        AMHP: { AMHP: "", AMHPUnit: "pmol/L", Date: null },
        DHEA: { DHEA: "", DHEAUnit: "ug/dL", Date: null },
        HCG: { HCG: "", HCGUnit: "IU/L", Date: null },
        LH: { LH: "", LHUnit: "IU/L", Date: null },
        PRL: { PRL: "", PRLUnit: "ng/mL", Date: null },
        P4: { P4: "", P4Unit: "ng/mL", Date: null },
        TSH: { TSH: "", TSHUnit: "uIU/mL", Date: null },
        Testosterone: {
          Testosterone: "",
          TestosteroneUnit: "nmol/L",
          Date: null,
        },
      };

  const lastAdditionalDatas =
    additionalDatas.map((additionalData) => ({
      ...additionalData,
      Data: additionalData.Data.sort((a, b) => b.Date - a.Date)[0],
    })) ?? [];

  const handleAdd = () => {
    setAddVisible(true);
  };
  const handleClose = () => {
    setPopUpVisible(false);
  };

  const handleClickAdditionalHistory = (rowName: string) => {
    setAdditionalHistoryTopic(rowName);
    let additionalHistoryDatasToPass: { Value: string; Date: number }[] = [];
    let additionalHistoryUnitToPass = "";
    const foundData = additionalDatas.find(({ Name }) => Name === rowName);
    if (foundData) {
      additionalHistoryDatasToPass = foundData.Data.sort(
        (a, b) => b.Date - a.Date
      );
      additionalHistoryUnitToPass = foundData.Unit;
    }
    setAdditionalHistoryDatas(additionalHistoryDatasToPass);
    setAdditionalHistoryUnit(additionalHistoryUnitToPass);
    setAdditionalHistoryVisible(true);
  };

  const handleClickHistory = (rowName: CareElementHistoryTopicType) => {
    setHistoryTopic(rowName);
    let historyDatasToPass: unknown[] = [];
    let historyUnitToPass: string | string[] = "";

    switch (rowName) {
      case "SMOKING STATUS":
        historyDatasToPass = datas.SmokingStatus?.length
          ? datas.SmokingStatus.sort((a, b) => b.Date - a.Date)
          : [];
        break;
      case "SMOKING PACKS PER DAY":
        historyDatasToPass = datas.SmokingPacks?.length
          ? datas.SmokingPacks.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "packs";
        break;
      case "WEIGHT":
        historyDatasToPass = datas.Weight?.length
          ? datas.Weight.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "kg";
        break;
      case "WEIGHT LBS":
        historyDatasToPass = datas.Weight?.length
          ? datas.Weight.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "lbs";
        break;
      case "HEIGHT":
        historyDatasToPass = datas.Height?.length
          ? datas.Height.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "cm";
        break;
      case "HEIGHT FEET":
        historyDatasToPass = datas.Height?.length
          ? datas.Height.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "feet";
        break;
      case "WAIST CIRCUMFERENCE":
        historyDatasToPass = datas.WaistCircumference?.length
          ? datas.WaistCircumference.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "cm";
        break;
      case "BLOOD PRESSURE":
        historyDatasToPass = datas.BloodPressure?.length
          ? datas.BloodPressure.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "mmHg";
        break;
      case "BODY MASS INDEX":
        historyDatasToPass = datas.bodyMassIndex?.length
          ? datas.bodyMassIndex.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "kg/m2";
        break;
      case "BODY SURFACE AREA":
        historyDatasToPass = datas.bodySurfaceArea?.length
          ? datas.bodySurfaceArea.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "m2";
        break;
      case "FSH":
        historyDatasToPass = datas.FSH?.length
          ? datas.FSH.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "IU/L";
        break;
      case "E2":
        historyDatasToPass = datas.E2?.length
          ? datas.E2.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "pmol/L";
        break;
      case "LH":
        historyDatasToPass = datas.LH?.length
          ? datas.LH.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "IU/L";
        break;
      case "P4":
        historyDatasToPass = datas.P4?.length
          ? datas.P4.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "ng/mL";
        break;
      case "AMHP":
        historyDatasToPass = datas.AMHP?.length
          ? datas.AMHP.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "pmol/L";
        break;
      case "DHEA":
        historyDatasToPass = datas.DHEA?.length
          ? datas.DHEA.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "ug/dL";
        break;
      case "HCG":
        historyDatasToPass = datas.HCG?.length
          ? datas.HCG.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "IU/L";
        break;

      case "PRL":
        historyDatasToPass = datas.PRL?.length
          ? datas.PRL.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "ng/mL";
        break;
      case "TSH":
        historyDatasToPass = datas.TSH?.length
          ? datas.TSH.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "uIU/mL";
        break;
      case "TESTOSTERONE":
        historyDatasToPass = datas.Testosterone?.length
          ? datas.Testosterone.sort((a, b) => b.Date - a.Date)
          : [];
        historyUnitToPass = "nmol/L";
        break;
      default:
        break;
    }
    setHistoryDatas(historyDatasToPass);
    setHistoryUnit(historyUnitToPass);
    setHistoryVisible(true);
  };

  const handleSubmit = async () => {
    setErrMsgPost("");
    //Validation
    try {
      await careElementsSchema.validate(addFormDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    if (
      (addFormDatas.SmokingStatus?.Status === "Y" ||
        addFormDatas.SmokingStatus?.Status === "N") &&
      !addFormDatas.SmokingPacks?.PerDay
    ) {
      setErrMsgPost("Smoking Packs field is required (type 0 if no smoking)");
      return;
    }
    if (
      addFormDatas.BloodPressure?.SystolicBP &&
      !addFormDatas.BloodPressure?.DiastolicBP
    ) {
      setErrMsgPost("Diastolic field is required if you enter Systolic");
      return;
    }
    if (
      addFormDatas.BloodPressure?.DiastolicBP &&
      !addFormDatas.BloodPressure?.SystolicBP
    ) {
      setErrMsgPost("Systolic field is required if you enter Diastolic");
      return;
    }

    const careElementToPut: CareElementType = {
      ...datas,
      SmokingStatus: addFormDatas.SmokingStatus?.Status
        ? [...datas.SmokingStatus, addFormDatas.SmokingStatus]
        : [...datas.SmokingStatus],
      SmokingPacks: addFormDatas.SmokingPacks?.PerDay
        ? [...datas.SmokingPacks, addFormDatas.SmokingPacks]
        : [...datas.SmokingPacks],
      Weight: addFormDatas.Weight?.Weight
        ? [...datas.Weight, addFormDatas.Weight]
        : [...datas.Weight],
      Height: addFormDatas.Height?.Height
        ? [...datas.Height, addFormDatas.Height]
        : [...datas.Height],
      WaistCircumference: addFormDatas.WaistCircumference?.WaistCircumference
        ? [...datas.WaistCircumference, addFormDatas.WaistCircumference]
        : [...datas.WaistCircumference],
      FSH: addFormDatas.FSH?.FSH
        ? [...datas.FSH, addFormDatas.FSH]
        : [...datas.FSH],
      E2: addFormDatas.E2?.E2 ? [...datas.E2, addFormDatas.E2] : [...datas.E2],
      AMHP: addFormDatas.AMHP?.AMHP
        ? [...datas.AMHP, addFormDatas.AMHP]
        : [...datas.AMHP],
      DHEA: addFormDatas.DHEA?.DHEA
        ? [...datas.DHEA, addFormDatas.DHEA]
        : [...datas.DHEA],
      HCG: addFormDatas.HCG?.HCG
        ? [...datas.HCG, addFormDatas.HCG]
        : [...datas.HCG],
      LH: addFormDatas.LH?.LH ? [...datas.LH, addFormDatas.LH] : [...datas.LH],
      PRL: addFormDatas.PRL?.PRL
        ? [...datas.PRL, addFormDatas.PRL]
        : [...datas.PRL],
      P4: addFormDatas.P4?.P4 ? [...datas.P4, addFormDatas.P4] : [...datas.P4],
      TSH: addFormDatas.TSH?.TSH
        ? [...datas.TSH, addFormDatas.TSH]
        : [...datas.TSH],
      Testosterone: addFormDatas.Testosterone?.Testosterone
        ? [...datas.Testosterone, addFormDatas.Testosterone]
        : [...datas.Testosterone],
      BloodPressure:
        addFormDatas.BloodPressure?.SystolicBP &&
        addFormDatas.BloodPressure?.DiastolicBP
          ? [...datas.BloodPressure, addFormDatas.BloodPressure]
          : [...datas.BloodPressure],
      bodyMassIndex: addFormDatas.bodyMassIndex?.BMI //if BMI is entered
        ? [...datas.bodyMassIndex, addFormDatas.bodyMassIndex] // add it to the array
        : addFormDatas.Weight?.Weight // if weight is entered, calculate BMI and add it to the array
        ? [
            ...datas.bodyMassIndex,
            {
              //retrieve the last height before the date of the new weight and calculate BMI
              BMI: bodyMassIndex(
                datas.Height.filter(({ Date }) => Date <= addDate)
                  .sort((a, b) => b.Date - a.Date)
                  .at(-1)?.Height ?? "",
                addFormDatas.Weight?.Weight
              ),
              Date: addDate,
            },
          ]
        : addFormDatas.Height?.Height
        ? [
            ...datas.bodyMassIndex,
            {
              BMI: bodyMassIndex(
                addFormDatas.Height?.Height,
                datas.Weight.filter(({ Date }) => Date <= addDate)
                  .sort((a, b) => a.Date - b.Date)
                  .at(-1)?.Weight ?? ""
              ),
              Date: addDate,
            },
          ]
        : [...datas.bodyMassIndex],
      bodySurfaceArea: addFormDatas.bodySurfaceArea?.BSA
        ? [...datas.bodySurfaceArea, addFormDatas.bodySurfaceArea]
        : addFormDatas.Weight?.Weight
        ? [
            ...datas.bodySurfaceArea,
            {
              BSA: bodySurfaceArea(
                datas.Height?.filter(({ Date }) => Date <= addDate)
                  .sort((a, b) => a.Date - b.Date)
                  .at(-1)?.Height ?? "",
                addFormDatas.Weight?.Weight
              ),
              Date: addDate,
            },
          ]
        : addFormDatas.Height?.Height
        ? [
            ...datas.bodySurfaceArea,
            {
              BSA: bodySurfaceArea(
                addFormDatas.Height?.Height,
                datas.Weight?.filter(({ Date }) => Date <= addDate)
                  .sort((a, b) => a.Date - b.Date)
                  .at(-1)?.Weight ?? ""
              ),
              Date: addDate,
            },
          ]
        : [...datas.bodySurfaceArea],
      Additional: addFormAdditionalDatas
        .map((addAdditionalData) => {
          const foundData = additionalDatas.find(
            ({ Name }) => Name === addAdditionalData.Name
          );
          if (foundData) {
            if (addAdditionalData.Data.Value) {
              return {
                //Ok
                ...foundData,
                Data: [
                  ...foundData.Data,
                  {
                    Value: addAdditionalData.Data.Value,
                    Date: addAdditionalData.Data.Date,
                  },
                ],
              };
            } else {
              //Ok
              return foundData;
            }
          } else if (addAdditionalData.Data.Value) {
            return {
              Name: addAdditionalData.Name,
              Unit: addAdditionalData.Unit,
              Data: [
                {
                  Value: addAdditionalData.Data.Value,
                  Date: addAdditionalData.Data.Date,
                },
              ],
            };
          }
          return null;
        })
        .filter((item): item is CareElementAdditionalType => item !== null),

      updates: [
        ...datas.updates,
        { date_updated: nowTZTimestamp(), updated_by_id: user.id },
      ],
    };
    //Submission
    setProgress(true);
    careElementPut.mutate(careElementToPut, {
      onSuccess: () => {
        setAddFormDatas({
          SmokingStatus: { Status: "", Date: nowTZTimestamp() },
          SmokingPacks: { PerDay: "", Date: nowTZTimestamp() },
          Weight: { Weight: "", WeightUnit: "kg", Date: nowTZTimestamp() },
          WeightLbs: { Weight: "", WeightUnit: "lbs", Date: nowTZTimestamp() },
          Height: { Height: "", HeightUnit: "cm", Date: nowTZTimestamp() },
          HeightFeet: {
            Height: "",
            HeightUnit: "ft in",
            Date: nowTZTimestamp(),
          },
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
        setAddFormAdditionalDatas(
          addFormAdditionalDatas.map((additionalData) => ({
            Name: additionalData.Name,
            Unit: additionalData.Unit,
            Data: { Value: "", Date: nowTZTimestamp() },
          }))
        );
        setAddVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  const handleCancel = () => {
    setAddVisible(false);
    setAddFormDatas({
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
    setAddFormAdditionalDatas(
      additionalDatas.map((additionalData) => ({
        Name: additionalData.Name,
        Unit: additionalData.Unit,
        Data: { Value: "", Date: nowTZTimestamp() },
      }))
    );
    setErrMsgPost("");
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
          <span>
            {addVisible ? "Add new care elements" : "Last information"}
          </span>
          <div className="care-elements__card-btn-container">
            {!addVisible ? (
              <>
                <Button onClick={handleAdd} disabled={progress} label="Add" />
                <CloseButton onClick={handleClose} disabled={progress} />
              </>
            ) : (
              <>
                <SaveButton onClick={handleSubmit} disabled={progress} />
                <CancelButton onClick={handleCancel} disabled={progress} />
              </>
            )}
          </div>
        </div>
        <div className="care-elements__card-content">
          {addVisible && (
            <CareElementsListAdd
              addFormDatas={addFormDatas}
              addFormAdditionalDatas={addFormAdditionalDatas}
              setAddFormDatas={setAddFormDatas}
              setAddFormAdditionalDatas={setAddFormAdditionalDatas}
              setErrMsgPost={setErrMsgPost}
              addDate={addDate}
              setAddDate={setAddDate}
            />
          )}
          {!addVisible && (
            <CareElementsListContent
              careElementPut={careElementPut}
              datas={datas}
              lastDatas={lastDatas}
              lastAdditionalDatas={lastAdditionalDatas}
              handleClickHistory={handleClickHistory}
              handleClickAdditionalHistory={handleClickAdditionalHistory}
            />
          )}
        </div>
      </div>
      {historyVisible && (
        <FakeWindow
          title={`${historyTopic} HISTORY of ${patientName}`}
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#577399"
          setPopUpVisible={setHistoryVisible}
        >
          <CareElementHistory
            historyTopic={historyTopic}
            historyDatas={historyDatas}
            historyUnit={historyUnit}
          />
        </FakeWindow>
      )}
      {additionalHistoryVisible && (
        <FakeWindow
          title={`${historyTopic} HISTORY of ${patientName}`}
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#577399"
          setPopUpVisible={setAdditionalHistoryVisible}
        >
          <CareElementAdditionalHistory
            historyTopic={additionalHistoryTopic}
            historyDatas={additionalHistoryDatas}
            historyUnit={additionalHistoryUnit}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsList;
