import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ImmunizationType,
  RecImmunizationAgeType,
  RecImmunizationRouteType,
  RecImmunizationTypeListType,
} from "../../../../../types/api";
import Checkbox from "../../../../UI/Checkbox/Checkbox";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import RecImmunizationEdit from "./RecImmunizationEdit";
import RecImmunizationForm from "./RecImmunizationForm";
import RecImmunizationLabel from "./RecImmunizationLabel";

type RecImmunizationItemSingleProps = {
  age: RecImmunizationAgeType;
  type: RecImmunizationTypeListType;
  route: RecImmunizationRouteType;
  immunizationInfos: ImmunizationType;
  rangeStart: number;
  rangeEnd: number;
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

const RecImmunizationItemSingle = ({
  age,
  type,
  route,
  immunizationInfos,
  rangeStart,
  rangeEnd,
  patientId,
  topicPost,
  topicPut,
  topicDelete,
}: RecImmunizationItemSingleProps) => {
  //HOOKS
  const [formVisible, setFormVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  //STYLES

  //HANDLERS
  const handleCheck = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      setFormVisible(true);
    } else {
      setEditVisible(true);
    }
  };

  const isChecked = () => {
    return immunizationInfos.Date ? true : false;
  };

  return (
    <div className="recimmunizations-item__cell">
      <Checkbox
        id="recimmunizations-item__checkbox"
        name={type}
        onChange={handleCheck}
        checked={isChecked()}
      />
      <RecImmunizationLabel
        immunizationInfos={immunizationInfos}
        route={route}
        age={age}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
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
          <RecImmunizationForm
            setFormVisible={setFormVisible}
            type={type}
            patientId={patientId}
            errMsgPost={errMsgPost}
            setErrMsgPost={setErrMsgPost}
            topicPost={topicPost}
          />
        </FakeWindow>
      )}
      {editVisible && (
        <FakeWindow
          title={`IMMUNIZATION (${type})`}
          width={700}
          height={650}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 650) / 2}
          color="#931621"
          setPopUpVisible={setEditVisible}
        >
          <RecImmunizationEdit
            immunizationInfos={immunizationInfos}
            type={type}
            setEditVisible={setEditVisible}
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

export default RecImmunizationItemSingle;
