import React from "react";
import {
  ImmunizationType,
  RecImmunizationTypeListType,
} from "../../../../../types/api";
import {
  nowTZTimestamp,
  timestampMonthsLaterTZ,
  timestampToDateISOTZ,
  timestampToDateMonthsLaterISOTZ,
} from "../../../../../utils/dates/formatDates";
import { getImmunizationLogo } from "../../../../../utils/immunizations/getImmunizationLogo";
import {
  RecImmunizationAgeType,
  RecImmunizationRouteType,
} from "../../../../../utils/immunizations/recommendedImmunizations";

type RecImmunizationSecondDoseLabelProps = {
  immunizationInfos: ImmunizationType[];
  type: RecImmunizationTypeListType;
  age: RecImmunizationAgeType;
  route: RecImmunizationRouteType;
};

const RecImmunizationSecondDoseLabel = ({
  immunizationInfos,
  type,
  age,
  route,
}: RecImmunizationSecondDoseLabelProps) => {
  return immunizationInfos.length === 2 &&
    immunizationInfos.find(({ doseNumber }) => doseNumber === 2)?.Date ? (
    <label
      style={{
        color:
          immunizationInfos.find(({ doseNumber }) => doseNumber === 2)
            ?.RefusedFlag.ynIndicatorsimple === "Y"
            ? "red"
            : "forestgreen",
      }}
      htmlFor="second-dose-checkbox"
    >
      {timestampToDateISOTZ(
        immunizationInfos.find(({ doseNumber }) => doseNumber === 2)?.Date
      )}{" "}
      {getImmunizationLogo(route)}
    </label>
  ) : (
    <label htmlFor="second-dose-checkbox">
      <span style={{ color: "black" }}>
        {age === "Grade 7" &&
          (immunizationInfos.length &&
          immunizationInfos.find(({ doseNumber }) => doseNumber === 1)?.Date ? (
            <span
              style={{
                color:
                  timestampMonthsLaterTZ(
                    immunizationInfos.find(({ doseNumber }) => doseNumber === 1)
                      ?.Date ?? 0,
                    7
                  ) < nowTZTimestamp()
                    ? "orange"
                    : "black",
              }}
            >
              {timestampToDateMonthsLaterISOTZ(
                immunizationInfos.find(({ doseNumber }) => doseNumber === 1)
                  ?.Date,
                6
              ) +
                " to " +
                timestampToDateMonthsLaterISOTZ(
                  immunizationInfos.find(({ doseNumber }) => doseNumber === 1)
                    ?.Date,
                  7
                )}
            </span>
          ) : (
            `6 months after`
          ))}
        {age === "65 Years" &&
          (immunizationInfos.length &&
          immunizationInfos.find(({ doseNumber }) => doseNumber === 1)?.Date ? (
            <span
              style={{
                color:
                  timestampMonthsLaterTZ(
                    immunizationInfos.find(({ doseNumber }) => doseNumber === 1)
                      ?.Date ?? 0,
                    7
                  ) < nowTZTimestamp()
                    ? "orange"
                    : "black",
              }}
            >
              {timestampToDateMonthsLaterISOTZ(
                immunizationInfos.find(({ doseNumber }) => doseNumber === 1)
                  ?.Date,
                2
              ) +
                " to " +
                timestampToDateMonthsLaterISOTZ(
                  immunizationInfos.find(({ doseNumber }) => doseNumber === 1)
                    ?.Date,
                  7
                )}
            </span>
          ) : (
            `2 to 6 months after`
          ))}
      </span>{" "}
      {getImmunizationLogo(route)}
    </label>
  );
};

export default RecImmunizationSecondDoseLabel;
