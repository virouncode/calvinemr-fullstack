import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import {
  toCodeTableName,
  ynIndicatorsimpleCT,
} from "../../../../../omdDatas/codesTables";
import {
  CareElementAdditionalType,
  CareElementLastDatasType,
  CareElementType,
  XanoPaginatedType,
} from "../../../../../types/api";
import {
  cmToFeetAndInches,
  kgToLbs,
} from "../../../../../utils/measurements/measurements";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type CareElementsDropDownProps = {
  topicDatas:
    | InfiniteData<XanoPaginatedType<CareElementType>, unknown>
    | undefined;
  isPending: boolean;
  error: Error | null;
};

const CareElementsDropDown = ({
  topicDatas,
  isPending,
  error,
}: CareElementsDropDownProps) => {
  if (isPending)
    return (
      <div className="topic-content">
        <CircularProgressMedium />
      </div>
    );
  if (error)
    return (
      <div className="topic-content">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  const datas = topicDatas?.pages?.flatMap((page) => page.items)[0];

  const additionalDatas: CareElementAdditionalType[] = datas?.Additional ?? [];

  const lastDatas: CareElementLastDatasType | null = datas
    ? {
        SmokingStatus: datas.SmokingStatus?.sort((a, b) => b.Date - a.Date)[0],
        SmokingPacks: datas.SmokingPacks?.sort((a, b) => b.Date - a.Date)[0],
        Weight: datas.Weight?.sort((a, b) => b.Date - a.Date)[0],
        Height: datas.Height?.sort((a, b) => b.Date - a.Date)[0],
        WaistCircumference: datas.WaistCircumference?.sort(
          (a, b) => b.Date - a.Date
        )[0],
        BloodPressure: datas.BloodPressure?.sort((a, b) => b.Date - a.Date)[0],
        bodyMassIndex: datas.bodyMassIndex?.sort((a, b) => b.Date - a.Date)[0],
        bodySurfaceArea: datas.bodySurfaceArea?.sort(
          (a, b) => b.Date - a.Date
        )[0],
        FSH: datas.FSH?.sort((a, b) => b.Date - a.Date)[0],
        E2: datas.E2?.sort((a, b) => b.Date - a.Date)[0],
        AMH: datas.AMH?.sort((a, b) => b.Date - a.Date)[0],
        DHEAS: datas.DHEAS?.sort((a, b) => b.Date - a.Date)[0],
        HCG: datas.HCG?.sort((a, b) => b.Date - a.Date)[0],
        LH: datas.LH?.sort((a, b) => b.Date - a.Date)[0],
        PRL: datas.PRL?.sort((a, b) => b.Date - a.Date)[0],
        P4: datas.P4?.sort((a, b) => b.Date - a.Date)[0],
        TSH: datas.TSH?.sort((a, b) => b.Date - a.Date)[0],
        Testosterone: datas.Testosterone?.sort((a, b) => b.Date - a.Date)[0],
      }
    : null;

  const lastAdditionalDatas = additionalDatas.map((additionalData) => ({
    ...additionalData,
    Data: additionalData.Data.sort((a, b) => b.Date - a.Date)[0],
  }));

  return (
    <div className="topic-content">
      {lastDatas ? (
        <>
          <p>
            <label>Smoking: </label>
            {toCodeTableName(
              ynIndicatorsimpleCT,
              lastDatas.SmokingStatus?.Status
            )}
          </p>
          <p>
            <label>Smoking Packs (per day): </label>
            {lastDatas.SmokingPacks?.PerDay}
          </p>
          <p>
            <label>Weight (kg): </label>
            {lastDatas.Weight?.Weight}
          </p>
          <p>
            <label>Weight (lbs): </label>
            {kgToLbs(lastDatas.Weight?.Weight)}
          </p>
          <p>
            <label>Height (cm): </label>
            {lastDatas.Height?.Height}
          </p>
          <p>
            <label>Height (ft in): </label>
            {cmToFeetAndInches(lastDatas.Height?.Height)}
          </p>
          <p>
            <label>Body Mass Index (kg/m2): </label>
            {lastDatas.bodyMassIndex?.BMI}
          </p>
          <p>
            <label>Body Surface Area (m2): </label>
            {lastDatas.bodySurfaceArea?.BSA}
          </p>
          <p>
            <label>Waist Circumference (cm): </label>
            {lastDatas.WaistCircumference?.WaistCircumference}
          </p>
          <p>
            <label>Systolic (mmHg): </label>
            {lastDatas.BloodPressure?.SystolicBP}
          </p>
          <p>
            <label>Diastolic (mmHg): </label>
            {lastDatas.BloodPressure?.DiastolicBP}
          </p>
          <p>
            <label>E2 (pmol/L): </label>
            {lastDatas.E2?.E2}
          </p>
          <p>
            <label>LH (IU/L): </label>
            {lastDatas.LH?.LH}
          </p>
          <p>
            <label>P4 (ng/mL): </label>
            {lastDatas.P4?.P4}
          </p>
          <p>
            <label>FSH (IU/L): </label>
            {lastDatas.FSH?.FSH}
          </p>
          <p>
            <label>AMH (pmol/L): </label>
            {lastDatas.AMH?.AMH}
          </p>
          <p>
            <label>DHEAS (umol/L): </label>
            {lastDatas.DHEAS?.DHEAS}
          </p>
          <p>
            <label>HCG (IU/L): </label>
            {lastDatas.HCG?.HCG}
          </p>
          <p>
            <label>PRL (ng/mL): </label>
            {lastDatas.PRL?.PRL}
          </p>
          <p>
            <label>TSH (mIU/L): </label>
            {lastDatas.TSH?.TSH}
          </p>
          <p>
            <label>Testosterone (nmol/L): </label>
            {lastDatas.Testosterone?.Testosterone}
          </p>
          {lastAdditionalDatas.length > 0 &&
            lastAdditionalDatas.map((additionalData) => (
              <p key={additionalData.Name}>
                <label>
                  {additionalData.Name} ({additionalData.Unit}):{" "}
                </label>
                {additionalData.Data?.Value}
              </p>
            ))}
        </>
      ) : (
        "No care elements"
      )}
    </div>
  );
};

export default CareElementsDropDown;
