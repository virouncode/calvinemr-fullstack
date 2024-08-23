import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ImmunizationType,
  RecImmunizationTypeListType,
} from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import {
  RecImmunizationAgeType,
  RecImmunizationRouteType,
} from "../../../../../utils/immunizations/recommendedImmunizations";
import DotsButton from "../../../../UI/Buttons/DotsButton";
import PlusButton from "../../../../UI/Buttons/PlusButton";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import RecImmunizationFormMultiple from "./RecImmunizationFormMultiple";
import RecImmunizationHistory from "./RecImmunizationHistory";

type RecImmunizationItemMultipleProps = {
  age: RecImmunizationAgeType;
  type: RecImmunizationTypeListType;
  route: RecImmunizationRouteType;
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

const RecImmunizationItemMultiple = ({
  age,
  type,
  route,
  immunizationInfos,
  patientId,
  topicPost,
  topicPut,
  topicDelete,
}: RecImmunizationItemMultipleProps) => {
  const [formVisible, setFormVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  const handleAddClick = () => {
    setErrMsgPost("");
    setFormVisible((v) => !v);
  };

  const handleHistoryClick = () => {
    setErrMsgPost("");
    setHistoryVisible((v) => !v);
  };

  return (
    <div className="recimmunizations-item__cell">
      {type === "Inf" ? (
        <label>
          Every year in the fall{" "}
          {immunizationInfos.length
            ? `(last : ${timestampToDateISOTZ(
                immunizationInfos
                  .sort((a, b) => (a.Date as number) - (b.Date as number))
                  .slice(-1)[0].Date
              )})`
            : ""}{" "}
        </label>
      ) : type === "Tdap_pregnancy" ? (
        <label>
          One dose in every pregnancy, ideally between 27-32 weeks of gestation{" "}
          {immunizationInfos.length
            ? `(last : ${timestampToDateISOTZ(
                immunizationInfos
                  .sort((a, b) => (a.Date as number) - (b.Date as number))
                  .slice(-1)[0].Date
              )})`
            : ""}{" "}
        </label>
      ) : (
        <label>
          Every ten years <br />{" "}
          {immunizationInfos.length
            ? `(last : ${timestampToDateISOTZ(
                immunizationInfos
                  .sort((a, b) => (a.Date as number) - (b.Date as number))
                  .slice(-1)[0].Date
              )})`
            : ""}{" "}
        </label>
      )}
      <PlusButton
        onClick={handleAddClick}
        className="recimmunizations-item__cell-multiple-btn"
      />
      <DotsButton
        onClick={handleHistoryClick}
        className="recimmunizations-item__cell-multiple-btn"
      />
      {formVisible && (
        <FakeWindow
          title={`NEW IMMUNIZATION (${type})`}
          width={700}
          height={650}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 650) / 2}
          color="#931621"
          setPopUpVisible={setFormVisible}
        >
          <RecImmunizationFormMultiple
            setFormVisible={setFormVisible}
            type={type}
            age={age}
            errMsgPost={errMsgPost}
            setErrMsgPost={setErrMsgPost}
            route={route}
            patientId={patientId}
            topicPost={topicPost}
          />
        </FakeWindow>
      )}
      {historyVisible && (
        <FakeWindow
          title={`${type} IMMUNIZATION HISTORY`}
          width={700}
          height={300}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 300) / 2}
          color="#931621"
          setPopUpVisible={setHistoryVisible}
        >
          <RecImmunizationHistory
            immunizationInfos={immunizationInfos}
            type={type}
            errMsgPost={errMsgPost}
            setErrMsgPost={setErrMsgPost}
            topicPut={topicPut}
            topicDelete={topicDelete}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default RecImmunizationItemMultiple;
