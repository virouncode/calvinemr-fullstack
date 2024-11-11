import { CareElementHistoryTopicType } from "../../types/api";

export const toYDataKey = (historyTopic: CareElementHistoryTopicType) => {
  if (historyTopic === "SMOKING STATUS") {
    return "Status";
  } else if (historyTopic === "SMOKING PACKS PER DAY") {
    return "PerDay";
  } else if (historyTopic === "WEIGHT" || historyTopic === "WEIGHT LBS") {
    return "Weight";
  } else if (historyTopic === "HEIGHT" || historyTopic === "HEIGHT FEET") {
    return "Height";
  } else if (historyTopic === "WAIST CIRCUMFERENCE") {
    return "WaistCircumference";
  } else if (historyTopic === "BLOOD PRESSURE") {
    return "";
  } else if (historyTopic === "BODY MASS INDEX") {
    return "BMI";
  } else if (historyTopic === "BODY SURFACE AREA") {
    return "BSA";
  } else if (historyTopic === "E2") {
    return "E2";
  } else if (historyTopic === "LH") {
    return "LH";
  } else if (historyTopic === "P4") {
    return "P4";
  } else if (historyTopic === "FSH") {
    return "FSH";
  } else if (historyTopic === "AMH") {
    return "AMH";
  } else if (historyTopic === "DHEAS") {
    return "DHEAS";
  } else if (historyTopic === "HCG") {
    return "HCG";
  } else if (historyTopic === "PRL") {
    return "PRL";
  } else if (historyTopic === "TSH") {
    return "TSH";
  } else if (historyTopic === "TESTOSTERONE") {
    return "Testosterone";
  } else {
    return "";
  }
};
