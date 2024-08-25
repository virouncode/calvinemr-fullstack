import { RecImmunizationRouteType } from "./recommendedImmunizations";

export const getImmunizationLogo = (type: RecImmunizationRouteType) => {
  let logo = "";
  switch (type) {
    case "Intramuscular":
      logo = "\u25C6";
      break;
    case "Intramuscular/Subcutaneous":
      logo = `\u25C6/\u25A0`;
      break;
    case "Subcutaneous":
      logo = "\u25A0";
      break;
    case "Oral":
      logo = "\u25B2";
      break;
    default:
      break;
  }
  return logo;
};

//diamond U25C6
//square U25A0
//triangle 25B2
//circle 25CF
