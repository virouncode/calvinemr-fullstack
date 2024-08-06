import { useState } from "react";
import Checkbox from "../../../../UI/Checkbox/Checkbox";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import RecImmunizationEditFirstDose from "./RecImmunizationEditFirstDose";
import RecImmunizationEditSecondDose from "./RecImmunizationEditSecondDose";
import RecImmunizationFirstDoseLabel from "./RecImmunizationFirstDoseLabel";
import RecImmunizationFormFirstDose from "./RecImmunizationFormFirstDose";
import RecImmunizationFormSecondDose from "./RecImmunizationFormSecondDose";
import RecImmunizationSecondDoseLabel from "./RecImmunizationSecondDoseLabel";

const RecImmunizationItemDouble = ({
  age,
  type,
  route,
  immunizationInfos,
  patientDob,
  rangeStart,
  rangeEnd,
  patientId,
  topicPost,
  topicPut,
  topicDelete,
}) => {
  //HOOKS

  const [formVisibleFirstDose, setFormVisibleFirstDose] = useState(false);
  const [formVisibleSecondDose, setFormVisibleSecondDose] = useState(false);
  const [editVisibleFirstDose, setEditVisibleFirstDose] = useState(false);
  const [editVisibleSecondDose, setEditVisibleSecondDose] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  //HANDLERS
  const handleCheckFirstDose = async (e) => {
    const checked = e.target.checked;
    if (checked) {
      setFormVisibleFirstDose(true);
    } else {
      setEditVisibleFirstDose(true);
    }
  };

  const handleCheckSecondDose = async (e) => {
    const checked = e.target.checked;
    if (checked) {
      if (immunizationInfos.length < 1) {
        alert("Please enter the first dose first.");
        return;
      }
      setFormVisibleSecondDose(true);
    } else {
      setEditVisibleSecondDose(true);
    }
  };

  const isFirstDoseChecked = () => {
    if (!immunizationInfos.length) return false;
    return immunizationInfos.find(({ doseNumber }) => doseNumber === 1)
      ? true
      : false;
  };
  const isSecondDoseChecked = () => {
    if (immunizationInfos.length < 2) return false;
    return immunizationInfos.find(({ doseNumber }) => doseNumber === 2)
      ? true
      : false;
  };

  return (
    <>
      <div className="recimmunizations-item__cell">
        <Checkbox
          id="first-dose-checkbox"
          name={type}
          onChange={handleCheckFirstDose}
          checked={isFirstDoseChecked()}
        />
        <RecImmunizationFirstDoseLabel
          immunizationInfos={immunizationInfos}
          type={type}
          age={age}
          patientDob={patientDob}
        />
        {formVisibleFirstDose && (
          <FakeWindow
            title={`NEW IMMUNIZATION (${type}, first dose)`}
            width={700}
            height={650}
            x={(window.innerWidth - 700) / 2}
            y={(window.innerHeight - 650) / 2}
            color="#931621"
            setPopUpVisible={setFormVisibleFirstDose}
          >
            <RecImmunizationFormFirstDose
              setFormVisible={setFormVisibleFirstDose}
              type={type}
              age={age}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              route={route}
              patientId={patientId}
              errMsgPost={errMsgPost}
              setErrMsgPost={setErrMsgPost}
              topicPost={topicPost}
            />
          </FakeWindow>
        )}
        {editVisibleFirstDose && (
          <FakeWindow
            title={`IMMUNIZATION (${type}, first dose)`}
            width={700}
            height={650}
            x={(window.innerWidth - 700) / 2}
            y={(window.innerHeight - 650) / 2}
            color="#931621"
            setPopUpVisible={setEditVisibleFirstDose}
          >
            <RecImmunizationEditFirstDose
              immunizationInfos={immunizationInfos.find(
                ({ doseNumber }) => doseNumber === 1
              )}
              immunizationInfosSecondDose={immunizationInfos.find(
                ({ doseNumber }) => doseNumber === 2
              )}
              type={type}
              setEditVisible={setEditVisibleFirstDose}
              errMsgPost={errMsgPost}
              setErrMsgPost={setErrMsgPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
            />
          </FakeWindow>
        )}
      </div>
      <div className="recimmunizations-item__cell">
        {type !== "Tdap_pregnancy" && type !== "Inf" && type !== "Td" && (
          <>
            <Checkbox
              id="second-dose-checkbox"
              name={type}
              onChange={handleCheckSecondDose}
              checked={isSecondDoseChecked()}
            />
            <RecImmunizationSecondDoseLabel
              immunizationInfos={immunizationInfos}
              type={type}
              age={age}
            />
          </>
        )}
        {formVisibleSecondDose && (
          <FakeWindow
            title={`NEW IMMUNIZATION (${type}, second dose)`}
            width={700}
            height={650}
            x={(window.innerWidth - 700) / 2}
            y={(window.innerHeight - 650) / 2}
            color="#931621"
            setPopUpVisible={setFormVisibleSecondDose}
          >
            <RecImmunizationFormSecondDose
              setFormVisible={setFormVisibleSecondDose}
              type={type}
              age={age}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              route={route}
              patientId={patientId}
              immunizationInfos={immunizationInfos}
              errMsgPost={errMsgPost}
              setErrMsgPost={setErrMsgPost}
              topicPost={topicPost}
            />
          </FakeWindow>
        )}
        {editVisibleSecondDose && (
          <FakeWindow
            title={`IMMUNIZATION (${type}, second dose)`}
            width={700}
            height={650}
            x={(window.innerWidth - 700) / 2}
            y={(window.innerHeight - 650) / 2}
            color="#931621"
            setPopUpVisible={setEditVisibleSecondDose}
          >
            <RecImmunizationEditSecondDose
              immunizationInfos={immunizationInfos.find(
                ({ doseNumber }) => doseNumber === 2
              )}
              type={type}
              setEditVisible={setEditVisibleSecondDose}
              errMsgPost={errMsgPost}
              setErrMsgPost={setErrMsgPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
            />
          </FakeWindow>
        )}
      </div>
    </>
  );
};

export default RecImmunizationItemDouble;
