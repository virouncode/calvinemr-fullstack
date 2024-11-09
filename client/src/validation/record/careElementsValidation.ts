import * as yup from "yup";

export const careElementsSchema = yup.object({
  SmokingPacks: yup.object({
    PerDay: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid Smoking Packs value",
      excludeEmptyString: true,
    }),
  }),
  Weight: yup.object({
    Weight: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid Weight value",
      excludeEmptyString: true,
    }),
  }),
  Height: yup.object({
    Height: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid Height value",
      excludeEmptyString: true,
    }),
  }),
  HeightFeet: yup.object({
    Height: yup.string().matches(/^\s*\d{1,2}'\d{1,2}"?\s*$|^\s*\d{1,2}\s*$/, {
      message: `Invalid Height (ft in) value, please enter the following format: feet'inches" (5'7") or feet (5)`,
      excludeEmptyString: true,
    }),
  }),
  WaistCircumference: yup.object({
    WaistCircumference: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid Waist Circumference value",
      excludeEmptyString: true,
    }),
  }),
  BloodPressure: yup.object({
    SystolicBP: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid SystolicBP value",
      excludeEmptyString: true,
    }),
    DiastolicBP: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid DiastolicBP value",
      excludeEmptyString: true,
    }),
  }),
  E2: yup.object({
    E2: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid E2 value",
      excludeEmptyString: true,
    }),
  }),
  LH: yup.object({
    LH: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid LH value",
      excludeEmptyString: true,
    }),
  }),
  P4: yup.object({
    P4: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid P4 value",
      excludeEmptyString: true,
    }),
  }),
  FSH: yup.object({
    FSH: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid FSH value",
      excludeEmptyString: true,
    }),
  }),
  AMHP: yup.object({
    AMHP: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid AMHP value",
      excludeEmptyString: true,
    }),
  }),
  DHEA: yup.object({
    DHEA: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid DHEA value",
      excludeEmptyString: true,
    }),
  }),
  HCG: yup.object({
    HCG: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid HCG value",
      excludeEmptyString: true,
    }),
  }),
  PRL: yup.object({
    PRL: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid PRL value",
      excludeEmptyString: true,
    }),
  }),
  TSH: yup.object({
    TSH: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid TSH value",
      excludeEmptyString: true,
    }),
  }),
  Testosterone: yup.object({
    Testosterone: yup.string().matches(/^\d+(\.\d{0,2})?$/, {
      message: "Invalid Testosterone value",
      excludeEmptyString: true,
    }),
  }),
});
