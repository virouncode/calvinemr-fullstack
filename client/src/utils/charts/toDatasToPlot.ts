import { CareElementHistoryTopicType } from "../../types/api";
import { cmToFeet, kgToLbs } from "../measurements/measurements";

export const toDatasToPlot = (
  historyTopic: CareElementHistoryTopicType,
  historyDatas: unknown
) => {
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
    case "E2":
      datasToPlot = (historyDatas as { E2: ""; Date: number }[]).map((data) => {
        return {
          ...data,
          E2: data.E2 ? parseFloat(data.E2) : 0,
          Date: new Date(data.Date),
        };
      });
      break;
    case "LH":
      datasToPlot = (historyDatas as { LH: ""; Date: number }[]).map((data) => {
        return {
          ...data,
          LH: data.LH ? parseFloat(data.LH) : 0,
          Date: new Date(data.Date),
        };
      });
      break;
    case "P4":
      datasToPlot = (historyDatas as { P4: ""; Date: number }[]).map((data) => {
        return {
          ...data,
          P4: data.P4 ? parseFloat(data.P4) : 0,
          Date: new Date(data.Date),
        };
      });
      break;
    case "FSH":
      datasToPlot = (historyDatas as { FSH: ""; Date: number }[]).map(
        (data) => {
          return {
            ...data,
            FSH: data.FSH ? parseFloat(data.FSH) : 0,
            Date: new Date(data.Date),
          };
        }
      );
      break;
    case "AMHP":
      datasToPlot = (historyDatas as { AMHP: ""; Date: number }[]).map(
        (data) => {
          return {
            ...data,
            AMHP: data.AMHP ? parseFloat(data.AMHP) : 0,
            Date: new Date(data.Date),
          };
        }
      );
      break;
    case "DHEA":
      datasToPlot = (historyDatas as { DHEA: ""; Date: number }[]).map(
        (data) => {
          return {
            ...data,
            DHEA: data.DHEA ? parseFloat(data.DHEA) : 0,
            Date: new Date(data.Date),
          };
        }
      );
      break;
    case "HCG":
      datasToPlot = (historyDatas as { HCG: ""; Date: number }[]).map(
        (data) => {
          return {
            ...data,
            HCG: data.HCG ? parseFloat(data.HCG) : 0,
            Date: new Date(data.Date),
          };
        }
      );
      break;
    case "PRL":
      datasToPlot = (historyDatas as { PRL: ""; Date: number }[]).map(
        (data) => {
          return {
            ...data,
            PRL: data.PRL ? parseFloat(data.PRL) : 0,
            Date: new Date(data.Date),
          };
        }
      );
      break;
    case "TSH":
      datasToPlot = (historyDatas as { TSH: ""; Date: number }[]).map(
        (data) => {
          return {
            ...data,
            TSH: data.TSH ? parseFloat(data.TSH) : 0,
            Date: new Date(data.Date),
          };
        }
      );
      break;
    case "TESTOSTERONE":
      datasToPlot = (historyDatas as { Testosterone: ""; Date: number }[]).map(
        (data) => {
          return {
            ...data,
            Testosterone: data.Testosterone ? parseFloat(data.Testosterone) : 0,
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
