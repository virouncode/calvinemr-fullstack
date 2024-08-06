import {
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToDateYearsLaterISOTZ,
  timestampYearsLaterTZ,
} from "../../../../../utils/dates/formatDates";
import { getImmunizationLogo } from "../../../../../utils/immunizations/getImmunizationLogo";

const RecImmunizationFirstDoseLabel = ({
  immunizationInfos,
  type,
  age,
  patientDob,
}) => {
  //STYLES
  const INTERVAL_GRADE_7_STYLE = {
    color:
      timestampYearsLaterTZ(patientDob, 15) < nowTZTimestamp()
        ? "orange"
        : "black",
  };
  const INTERVAL_65_YEARS_STYLE = {
    color:
      timestampYearsLaterTZ(patientDob, 70) < nowTZTimestamp()
        ? "orange"
        : "black",
  };
  return immunizationInfos.length &&
    immunizationInfos.find(({ doseNumber }) => doseNumber === 1)?.Date ? (
    <label
      style={{
        color:
          immunizationInfos.find(({ doseNumber }) => doseNumber === 1)
            .RefusedFlag.ynIndicatorsimple === "Y"
            ? "red"
            : "forestgreen",
      }}
      htmlFor="first-dose-checkbox"
    >
      {timestampToDateISOTZ(
        immunizationInfos.find(({ doseNumber }) => doseNumber === 1).Date
      )}{" "}
      {getImmunizationLogo(type)}
    </label>
  ) : (
    <label htmlFor="first-dose-checkbox">
      {age === "Grade 7" &&
        type !== "Tdap_pregnancy" && ( //not a pregnancy
          <span style={INTERVAL_GRADE_7_STYLE}>
            Grade 7 to 12 &#40;til{" "}
            {timestampToDateYearsLaterISOTZ(patientDob, 15)}
            &#41;
          </span>
        )}
      {age === "Grade 7" &&
        type === "Tdap_pregnancy" &&
        `One dose in every pregnancy, ideally between 27-32 weeks of gestation`}
      {age === ">=34 Years" && `Every 10 Years`}
      {age === "65 Years" && (
        <span style={INTERVAL_65_YEARS_STYLE}>
          {timestampToDateYearsLaterISOTZ(patientDob, 65)} to{" "}
          {timestampToDateYearsLaterISOTZ(patientDob, 70)}
        </span>
      )}
      {age === "6 Months" && `Every year in the fall *`}{" "}
      {getImmunizationLogo(type)}
    </label>
  );
};

export default RecImmunizationFirstDoseLabel;
