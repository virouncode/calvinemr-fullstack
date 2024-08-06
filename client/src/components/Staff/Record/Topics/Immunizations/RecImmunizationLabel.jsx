import {
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { getImmunizationLogo } from "../../../../../utils/immunizations/getImmunizationLogo";

const RecImmunizationLabel = ({
  immunizationInfos,
  route,
  age,
  rangeStart,
  rangeEnd,
}) => {
  const INTERVAL_STYLE = {
    color: rangeEnd < nowTZTimestamp() ? "orange" : "black",
  };
  return immunizationInfos.Date ? (
    <label
      style={{
        color:
          immunizationInfos.RefusedFlag.ynIndicatorsimple === "Y"
            ? "red"
            : "forestgreen",
      }}
      htmlFor="recimmunizations-item__checkbox"
    >
      {timestampToDateISOTZ(immunizationInfos.Date)}{" "}
      {getImmunizationLogo(route)}
    </label>
  ) : (
    <label htmlFor="recimmunizations-item__checkbox">
      <span style={INTERVAL_STYLE}>
        {age === "Grade 7"
          ? `Grade 7 to 12 (til ${timestampToDateISOTZ(rangeEnd)})`
          : `${timestampToDateISOTZ(rangeStart)} to ${timestampToDateISOTZ(
              rangeEnd
            )}`}
      </span>{" "}
      {getImmunizationLogo(route)}
    </label>
  );
};

export default RecImmunizationLabel;
