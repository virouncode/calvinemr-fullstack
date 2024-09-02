import { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import {
  ImmunizationType,
  RecImmunizationAgeType,
  RecImmunizationRouteType,
  RecImmunizationTypeListType,
} from "../../../../../types/api";
import { getImmunizationInterval } from "../../../../../utils/immunizations/getImmunizationInterval";
import RecImmunizationItemDouble from "./RecImmunizationItemDouble";
import RecImmunizationItemMultiple from "./RecImmunizationItemMultiple";
import RecImmunizationItemSingle from "./RecImmunizationItemSingle";

type RecImmunizationCellProps = {
  age: RecImmunizationAgeType;
  type: RecImmunizationTypeListType;
  route: RecImmunizationRouteType;
  immunizationId: number;
  dose: string;
  immunizationInfos: ImmunizationType[];
  patientDob: number;
  patientId: number;
  topicPost: UseMutationResult<
    ImmunizationType,
    Error,
    Partial<ImmunizationType>,
    void
  >;
  topicPut: UseMutationResult<ImmunizationType, Error, ImmunizationType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
};

const RecImmunizationCell = ({
  age,
  type,
  route,
  immunizationId,
  dose,
  immunizationInfos,
  patientDob,
  patientId,
  topicPost,
  topicPut,
  topicDelete,
}: RecImmunizationCellProps) => {
  return (
    immunizationInfos && (
      <td
        colSpan={
          immunizationId === 16
            ? 5
            : immunizationId === 17
            ? 10
            : immunizationId === 13
            ? 2
            : 0
        }
      >
        {dose === "single" ? ( //single dose
          <RecImmunizationItemSingle
            age={age}
            type={type}
            route={route}
            immunizationInfos={immunizationInfos[0] || {}}
            rangeStart={getImmunizationInterval(age, patientDob).rangeStart}
            rangeEnd={getImmunizationInterval(age, patientDob).rangeEnd}
            patientId={patientId}
            topicPost={topicPost}
            topicPut={topicPut}
            topicDelete={topicDelete}
          />
        ) : //double dose
        dose === "double" ? (
          <RecImmunizationItemDouble
            age={age}
            type={type}
            route={route}
            immunizationInfos={immunizationInfos}
            patientDob={patientDob}
            rangeEnd={getImmunizationInterval(age, patientDob).rangeEnd}
            patientId={patientId}
            topicPost={topicPost}
            topicPut={topicPut}
            topicDelete={topicDelete}
          />
        ) : (
          <RecImmunizationItemMultiple
            age={age}
            type={type}
            route={route}
            immunizationInfos={immunizationInfos}
            patientId={patientId}
            topicPost={topicPost}
            topicPut={topicPut}
            topicDelete={topicDelete}
          />
        )}
      </td>
    )
  );
};
export default RecImmunizationCell;
