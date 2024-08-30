import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import { CareElementType } from "../../../../../../types/api";
import { UserStaffType } from "../../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../../utils/dates/formatDates";
import CloseButton from "../../../../../UI/Buttons/CloseButton";
import SaveButton from "../../../../../UI/Buttons/SaveButton";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";

type BPHistoryEditProps = {
  datas: CareElementType;
  careElementPut: UseMutationResult<
    CareElementType,
    Error,
    CareElementType,
    void
  >;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const BPHistoryEdit = ({
  datas,
  careElementPut,
  setEditVisible,
}: BPHistoryEditProps) => {
  //Hookq
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatasBP, setFormDatasBP] = useState<
    {
      id: number;
      SystolicBP: string;
      DiastolicBP: string;
      BPUnit: "mmHg";
      Date: number;
    }[]
  >(
    datas?.BloodPressure.map((item, index) => {
      return { ...item, id: index };
    })
  );
  const [errMsgPost, setErrMsgPost] = useState("");

  const handleClose = () => {
    setEditVisible(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const id = parseInt(e.target.id);
    const value = e.target.value;
    const name = e.target.name;
    if (name === "Date" && !value) return; //to avoid clearing the date field
    switch (name) {
      case "Systolic":
        setFormDatasBP(
          formDatasBP.map((item) => {
            return item.id === id ? { ...item, SystolicBP: value } : item;
          })
        );
        break;
      case "Diastolic":
        setFormDatasBP(
          formDatasBP.map((item) => {
            return item.id === id ? { ...item, DiastolicBP: value } : item;
          })
        );
        break;
      case "Date":
        setFormDatasBP(
          formDatasBP.map((item) => {
            return item.id === id
              ? { ...item, Date: dateISOToTimestampTZ(value) ?? 0 }
              : item;
          })
        );
        break;
      default:
        break;
    }
  };
  const handleSubmit = async () => {
    //Validation
    if (
      formDatasBP.some(
        ({ SystolicBP, DiastolicBP, Date }) =>
          !SystolicBP || !DiastolicBP || !Date
      )
    ) {
      setErrMsgPost("Please fill all fields");
      return;
    }
    if (
      formDatasBP.some(
        ({ SystolicBP, DiastolicBP }) =>
          !SystolicBP.match(/^\d+([.,]\d{0,2})?$/) ||
          !DiastolicBP.match(/^\d+([.,]\d{0,2})?$/)
      )
    ) {
      setErrMsgPost(
        "Please enter a valid number for Systolic and Diastolic Blood Pressure"
      );
      return;
    }
    const careElementToPut = {
      ...datas,
      BloodPressure: formDatasBP,
      updates: [
        ...datas.updates,
        { date_updated: nowTZTimestamp(), updated_by_id: user.id },
      ],
    };
    careElementPut.mutate(careElementToPut, {
      onSuccess: () => setEditVisible(false),
    });
  };
  return (
    <div className="care-elements__edit">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <ul
        className="care-elements__edit-list"
        style={{ border: errMsgPost && "solid 1px red" }}
      >
        {formDatasBP.map((item) => (
          <li className="care-elements__edit-item" key={item.id}>
            <span className="care-elements__edit-block">
              <InputDate
                value={timestampToDateISOTZ(
                  formDatasBP.find(({ id }) => id === item.id)?.Date
                )}
                onChange={handleChange}
                name="Date"
                id={item.id.toString()}
                label="Date"
              />
            </span>
            <span className="care-elements__edit-block">
              <Input
                value={
                  formDatasBP.find(({ id }) => id === item.id)?.SystolicBP ?? ""
                }
                onChange={handleChange}
                id={item.id.toString()}
                name="Systolic"
                label="Systolic (mmHg):"
              />
            </span>
            <span className="care-elements__edit-block">
              <Input
                value={
                  formDatasBP.find(({ id }) => id === item.id)?.DiastolicBP ??
                  ""
                }
                onChange={handleChange}
                id={item.id.toString()}
                name="Diastolic"
                label="Diastolic (mmHg):"
              />
            </span>
          </li>
        ))}
      </ul>
      <div className="care-elements__edit-btns">
        <SaveButton onClick={handleSubmit} />
        <CloseButton onClick={handleClose} />
      </div>
    </div>
  );
};

export default BPHistoryEdit;
