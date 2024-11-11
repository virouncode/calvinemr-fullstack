import { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import {
  CareElementHistoryTopicType,
  CareElementLastDatasType,
  CareElementType,
} from "../../../../../types/api";
import { timestampToDateTimeSecondsStrTZ } from "../../../../../utils/dates/formatDates";
import { getLastUpdate, isUpdated } from "../../../../../utils/dates/updates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import CareElementsAdditional from "./CareElementsAdditional";
import CareElementsAMH from "./CareElementsAMH";
import CareElementsBMI from "./CareElementsBMI";
import CareElementsBSA from "./CareElementsBSA";
import CareElementsDHEAS from "./CareElementsDHEAS";
import CareElementsDiastolic from "./CareElementsDiastolic";
import CareElementsE2 from "./CareElementsE2";
import CareElementsFSH from "./CareElementsFSH";
import CareElementsHCG from "./CareElementsHCG";
import CareElementsHeight from "./CareElementsHeight";
import CareElementsHeightFeet from "./CareElementsHeightFeet";
import CareElementsLH from "./CareElementsLH";
import CareElementsP4 from "./CareElementsP4";
import CareElementsPacks from "./CareElementsPacks";
import CareElementsPRL from "./CareElementsPRL";
import CareElementsSmoking from "./CareElementsSmoking";
import CareElementsSystolic from "./CareElementsSystolic";
import CareElementsTestosterone from "./CareElementsTestosterone";
import CareElementsTSH from "./CareElementsTSH";
import CareElementsWaist from "./CareElementsWaist";
import CareElementsWeight from "./CareElementsWeight";
import CareElementsWeightLbs from "./CareElementsWeightLbs";

type CareElementsListContentProps = {
  careElementPut: UseMutationResult<
    CareElementType,
    Error,
    CareElementType,
    void
  >;
  datas: CareElementType;
  handleClickHistory: (rowName: CareElementHistoryTopicType) => void;
  handleClickAdditionalHistory: (rowName: string) => void;
  lastDatas: CareElementLastDatasType;
  lastAdditionalDatas: {
    Data: {
      Value: string;
      Date: number;
    };
    Name: string;
    Unit: string;
  }[];
};

const CareElementsListContent = ({
  careElementPut,
  datas,
  lastDatas,
  lastAdditionalDatas,
  handleClickHistory,
  handleClickAdditionalHistory,
}: CareElementsListContentProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  return (
    <>
      <CareElementsSmoking
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsPacks
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsWeight
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsWeightLbs
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsHeight
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsHeightFeet
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsBMI
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsBSA
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsWaist
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsSystolic
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsDiastolic
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsE2
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsLH
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsP4
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsFSH
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsAMH
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsDHEAS
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsHCG
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsPRL
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsTSH
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />
      <CareElementsTestosterone
        careElementPut={careElementPut}
        datas={datas}
        lastDatas={lastDatas}
        handleClickHistory={handleClickHistory}
      />

      {lastAdditionalDatas.map((lastAdditionalData) => (
        <CareElementsAdditional
          key={lastAdditionalData.Name}
          datas={datas}
          lastAdditionalData={lastAdditionalData}
          careElementPut={careElementPut}
          handleClickAdditionalHistory={handleClickAdditionalHistory}
        />
      ))}
      <p className="care-elements__sign">
        {datas && isUpdated(datas) ? (
          <em>
            Updated by{" "}
            {staffIdToTitleAndName(
              staffInfos,
              getLastUpdate(datas)?.updated_by_id
            )}{" "}
            on{" "}
            {timestampToDateTimeSecondsStrTZ(
              getLastUpdate(datas)?.date_updated
            )}
          </em>
        ) : (
          datas && (
            <em>
              Created by{" "}
              {staffIdToTitleAndName(staffInfos, datas.created_by_id)} on{" "}
              {timestampToDateTimeSecondsStrTZ(datas.date_created)}
            </em>
          )
        )}
      </p>
    </>
  );
};

export default CareElementsListContent;
