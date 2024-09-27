import { cmToFeet, kgToLbs } from "../measurements/measurements";

export const toDatasToPlot = (historyTopic: string, historyDatas: unknown) => {
  let datasToPlot;
  switch (historyTopic) {
    case "SMOKING STATUS":
      datasToPlot = (historyDatas as { Status: string; Date: number }[]).map(
        (data) => {
          return {
            ...data,
            Status: data.Status === "Y" ? 1 : 0,
            Date: new Date(data.Date),
          };
        }
      );
      break;
    case "SMOKING PACKS PER DAY":
      datasToPlot = (historyDatas as { PerDay: string; Date: number }[]).map(
        (data) => {
          return {
            ...data,
            PerDay: data.PerDay ? parseFloat(data.PerDay) : 0,
            Date: new Date(data.Date),
          };
        }
      );
      break;
    case "WEIGHT":
      datasToPlot = (
        historyDatas as { Weight: string; WeightUnit: "kg"; Date: number }[]
      ).map((data) => {
        return {
          ...data,
          Weight: data.Weight ? parseFloat(data.Weight) : 0,
          Date: new Date(data.Date),
        };
      });
      break;
    case "WEIGHT LBS":
      datasToPlot = (
        historyDatas as { Weight: string; WeightUnit: "kg"; Date: number }[]
      ).map((data) => {
        return {
          ...data,
          Weight: data.Weight
            ? parseFloat(kgToLbs(parseFloat(data.Weight).toString()))
            : 0,
          Date: new Date(data.Date),
          WeightUnit: "lbs",
        };
      });
      break;
    case "HEIGHT":
      datasToPlot = (
        historyDatas as { Height: string; HeightUnit: "cm"; Date: number }[]
      ).map((data) => {
        return {
          ...data,
          Height: data.Height ? parseFloat(data.Height) : 0,
          Date: new Date(data.Date),
        };
      });
      break;
    case "HEIGHT FEET":
      datasToPlot = (
        historyDatas as { Height: string; HeightUnit: "cm"; Date: number }[]
      ).map((data) => {
        return {
          ...data,
          Height: data.Height
            ? parseFloat(cmToFeet(parseFloat(data.Height).toString()))
            : 0,
          Date: new Date(data.Date),
          HeightUnit: "feet",
        };
      });
      break;
    case "WAIST CIRCUMFERENCE":
      datasToPlot = (
        historyDatas as {
          WaistCircumference: string;
          WaistCircumferenceUnit: "cm";
          Date: number;
        }[]
      ).map((data) => {
        return {
          ...data,
          WaistCircumference: data.WaistCircumference
            ? parseFloat(data.WaistCircumference)
            : 0,
          Date: new Date(data.Date),
        };
      });
      break;
    case "BLOOD PRESSURE":
      datasToPlot = (
        historyDatas as {
          SystolicBP: string;
          DiastolicBP: string;
          BPUnit: "mmHg";
          Date: number;
        }[]
      ).map((data) => {
        return {
          Date: new Date(data.Date),
          SystolicBP: data.SystolicBP ? parseFloat(data.SystolicBP) : 0,
          DiastolicBP: data.DiastolicBP ? parseFloat(data.DiastolicBP) : 0,
        };
      });
      break;
    case "BODY MASS INDEX":
      datasToPlot = (historyDatas as { BMI: ""; Date: number }[]).map(
        (data) => {
          return {
            ...data,
            BMI: data.BMI ? parseFloat(data.BMI) : 0,
            Date: new Date(data.Date),
          };
        }
      );
      break;
    case "BODY SURFACE AREA":
      datasToPlot = (historyDatas as { BSA: ""; Date: number }[]).map(
        (data) => {
          return {
            ...data,
            BSA: data.BSA ? parseFloat(data.BSA) : 0,
            Date: new Date(data.Date),
          };
        }
      );
      break;
    default:
      break;
  }
  return datasToPlot;
};
