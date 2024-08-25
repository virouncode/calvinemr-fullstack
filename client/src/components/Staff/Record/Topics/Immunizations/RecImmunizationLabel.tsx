import React from "react";
import { ImmunizationType } from "../../../../../types/api";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { getImmunizationLogo } from "../../../../../utils/immunizations/getImmunizationLogo";
import {
  RecImmunizationAgeType,
  RecImmunizationRouteType,
} from "../../../../../utils/immunizations/recommendedImmunizations";

type RecImmunizationLabelProps = {
  immunizationInfos: ImmunizationType;
  route: RecImmunizationRouteType;
  age: RecImmunizationAgeType;
  rangeStart: number;
  rangeEnd: number;
};

const RecImmunizationLabel = ({
  immunizationInfos,
  route,
  age,
  rangeStart,
  rangeEnd,
}: RecImmunizationLabelProps) => {
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
