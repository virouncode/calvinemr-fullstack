import { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import {
  ImmunizationType,
  RecImmunizationAgeType,
  RecImmunizationTypeListType,
} from "../../../../../types/api";
import { recommendedImmunizationsList } from "../../../../../utils/immunizations/recommendedImmunizations";
import RecImmunizationCell from "./RecImmunizationCell";
import RecImmunizationEmptyCell from "./RecImmunizationEmptyCell";

const allImmunizationsAges = [
  "2 Months",
  "4 Months",
  "6 Months",
  "1 Year",
  "15 Months",
  "18 Months",
  "4 Years",
  "Grade 7",
  "14 Years",
  "24 Years",
  ">=34 Years",
  "65 Years",
] as const;

type RecImmunizationRowProps = {
  type: RecImmunizationTypeListType;
  patientDob: number;
  immunizationInfos: ImmunizationType[];
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

const RecImmunizationRow = ({
  type,
  patientDob,
  immunizationInfos,
  patientId,
  topicPost,
  topicPut,
  topicDelete,
}: RecImmunizationRowProps) => {
  const immunization = recommendedImmunizationsList.find(
    (immunization) => immunization.type === type
  );
  const immunizationId = immunization?.id ?? 1;
  const immunizationType = immunization?.type ?? "DTaP-IPV-Hib";
  const immunizationDose = immunization?.dose ?? "single";
  const immunizationRoute = immunization?.route ?? "Intramuscular";
  const immunizationAges = immunization?.ages ?? [
    "2 Months",
    "4 Months",
    "6 Months",
    "18 Months",
  ];

  const allImmunizationsAgesToDisplay =
    immunizationId === 16
      ? allImmunizationsAges.slice(0, 8)
      : immunizationId === 17
      ? allImmunizationsAges.slice(0, 3)
      : immunizationId === 13
      ? allImmunizationsAges.slice(0, 11)
      : allImmunizationsAges;

  return allImmunizationsAgesToDisplay.map(
    (immunizationAge: RecImmunizationAgeType, index: number) =>
      immunizationAges?.includes(immunizationAge) ? (
        <RecImmunizationCell
          key={index}
          age={immunizationAge}
          type={immunizationType}
          route={immunizationRoute}
          immunizationId={immunizationId}
          dose={immunizationDose}
          immunizationInfos={immunizationInfos.filter(
            ({ age }) => age === immunizationAge
          )}
          patientDob={patientDob}
          patientId={patientId}
          topicPost={topicPost}
          topicPut={topicPut}
          topicDelete={topicDelete}
        />
      ) : (
        <RecImmunizationEmptyCell key={index} />
      )
  );
};

export default RecImmunizationRow;
