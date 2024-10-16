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
import {
  bodyMassIndex,
  kgToLbs,
  lbsToKg,
} from "../../../../../../utils/measurements/measurements";
import CloseButton from "../../../../../UI/Buttons/CloseButton";
import SaveButton from "../../../../../UI/Buttons/SaveButton";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";

type WeightLbsHistoryEditProps = {
  datas: CareElementType;
  careElementPut: UseMutationResult<
    CareElementType,
    Error,
    CareElementType,
    void
  >;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const WeightLbsHistoryEdit = ({
  datas,
  careElementPut,
  setEditVisible,
}: WeightLbsHistoryEditProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatasWeight, setFormDatasWeight] = useState<
    {
      id: number;
      Weight: string;
      WeightUnit: "kg";
      Date: number;
    }[]
  >(
    datas?.Weight?.map((item, index) => {
      return { ...item, id: index, Weight: kgToLbs(item.Weight) };
    })
  );
  const [formDatasBodyMassIndex, setFormDatasBodyMassIndex] = useState<
    {
      id: number;
      BMI: string;
      Date: number;
    }[]
  >(
    datas?.bodyMassIndex?.map((item, index) => {
      return { ...item, id: index };
    })
  );
  const [formDatasBodySurfaceArea, setFormDatasBodySurfaceArea] = useState<
    {
      id: number;
      BSA: string;
      Date: number;
    }[]
  >(
    datas?.bodySurfaceArea?.map((item, index) => {
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
    let lastHeight: string = "";
    switch (name) {
      case "Weight":
        lastHeight =
          datas.Height.filter(
            ({ Date }) =>
              Date <=
              (
                formDatasWeight.find((item) => item.id === id) as {
                  id: number;
                  Weight: string;
                  WeightUnit: "kg";
                  Date: number;
                }
              ).Date
          ).sort((a, b) => b.Date - a.Date)[0].Height ?? "";

        setFormDatasWeight(
          formDatasWeight.map((item) => {
            return item.id === id ? { ...item, Weight: value } : item;
          })
        );
        setFormDatasBodyMassIndex(
          formDatasBodyMassIndex.map((item) => {
            return item.id === id
              ? { ...item, BMI: bodyMassIndex(lastHeight, lbsToKg(value)) }
              : item;
          })
        );
        setFormDatasBodySurfaceArea(
          formDatasBodySurfaceArea.map((item) => {
            return item.id === id
              ? { ...item, BSA: bodyMassIndex(lastHeight, lbsToKg(value)) }
              : item;
          })
        );
        break;
      case "Date":
        lastHeight =
          datas.Height.filter(
            ({ Date }) => Date <= (dateISOToTimestampTZ(value) ?? 0)
          ).sort((a, b) => b.Date - a.Date)[0].Height ?? "";

        setFormDatasWeight(
          formDatasWeight.map((item) => {
            return item.id === id
              ? { ...item, Date: dateISOToTimestampTZ(value) ?? 0 }
              : item;
          })
        );
        setFormDatasBodyMassIndex(
          formDatasBodyMassIndex.map((item) => {
            return item.id === id
              ? {
                  ...item,
                  BMI: bodyMassIndex(
                    lastHeight,
                    lbsToKg(
                      formDatasWeight.find(({ id }) => id === id)?.Weight ?? ""
                    )
                  ),
                  Date: dateISOToTimestampTZ(value) ?? 0,
                }
              : item;
          })
        );
        setFormDatasBodySurfaceArea(
          formDatasBodySurfaceArea.map((item) => {
            return item.id === id
              ? {
                  ...item,
                  BSA: bodyMassIndex(
                    lastHeight,
                    lbsToKg(
                      formDatasWeight.find(({ id }) => id === id)?.Weight ?? ""
                    )
                  ),
                  Date: dateISOToTimestampTZ(value) ?? 0,
                }
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
    if (formDatasWeight.some(({ Weight, Date }) => !Weight || !Date)) {
      setErrMsgPost("Please fill both Weight and Date fields");
      return;
    }
    if (
      formDatasWeight.some(({ Weight }) => !Weight.match(/^\d+(\.\d{0,2})?$/))
    ) {
      setErrMsgPost("Please enter a valid number for Weight");
      return;
    }
    const careElementToPut = {
      ...datas,
      Weight: formDatasWeight.map((item) => {
        return { ...item, Weight: lbsToKg(item.Weight) };
      }),
      bodyMassIndex: formDatasBodyMassIndex,
      bodySurfaceArea: formDatasBodySurfaceArea,
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
        {formDatasWeight.map((item) => (
          <li className="care-elements__edit-item" key={item.id}>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <InputDate
                label="Date:"
                value={timestampToDateISOTZ(
                  formDatasWeight.find(({ id }) => id === item.id)?.Date
                )}
                onChange={handleChange}
                id={item.id.toString()}
                name="Date"
              />
            </span>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <Input
                label="Weight (lbs):"
                value={
                  formDatasWeight.find(({ id }) => id === item.id)?.Weight ?? ""
                }
                onChange={handleChange}
                id={item.id.toString()}
                name="Weight"
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

export default WeightLbsHistoryEdit;
