import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { CareElementType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { bodyMassIndex } from "../../../../../utils/measurements/measurements";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";

type HeightHistoryEditProps = {
  datas: CareElementType;
  careElementPut: UseMutationResult<
    CareElementType,
    Error,
    CareElementType,
    void
  >;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const HeightHistoryEdit = ({
  datas,
  careElementPut,
  setEditVisible,
}: HeightHistoryEditProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatasHeight, setFormDatasHeight] = useState<
    {
      id: number;
      Height: string;
      HeightUnit: "cm";
      Date: number;
    }[]
  >(
    datas?.Height.map((item, index) => {
      return { ...item, id: index };
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
    let lastWeight: string = "";
    switch (name) {
      case "Height":
        lastWeight =
          datas.Weight?.filter(
            ({ Date }) =>
              Date <=
              (
                formDatasHeight.find((item) => item.id === id) as {
                  id: number;
                  Height: string;
                  HeightUnit: "cm";
                  Date: number;
                }
              ).Date
          )?.sort((a, b) => b.Date - a.Date)[0].Weight ?? "";
        setFormDatasHeight(
          formDatasHeight.map((item) => {
            return item.id === id ? { ...item, Height: value } : item;
          })
        );
        setFormDatasBodyMassIndex(
          formDatasBodyMassIndex.map((item) => {
            return item.id === id
              ? { ...item, BMI: bodyMassIndex(value, lastWeight) }
              : item;
          })
        );
        setFormDatasBodySurfaceArea(
          formDatasBodySurfaceArea.map((item) => {
            return item.id === id
              ? { ...item, BSA: bodyMassIndex(value, lastWeight) }
              : item;
          })
        );
        break;
      case "Date":
        lastWeight =
          datas.Weight.filter(
            ({ Date }) => Date <= (dateISOToTimestampTZ(value) ?? 0)
          )?.sort((a, b) => b.Date - a.Date)[0].Weight ?? "";

        setFormDatasHeight(
          formDatasHeight.map((item) => {
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
                    formDatasHeight.find(({ id }) => id === id)?.Height ?? "",
                    lastWeight
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
                    formDatasHeight.find(({ id }) => id === id)?.Height ?? "",
                    lastWeight
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
    if (formDatasHeight.some(({ Height, Date }) => !Height || !Date)) {
      setErrMsgPost("Please fill both Height and Date fields");
      return;
    }
    if (
      formDatasHeight.some(({ Height }) => !Height.match(/^\d+([.,]\d{0,2})?$/))
    ) {
      setErrMsgPost("Please enter a valid number for Height");
      return;
    }
    const careElementToPut = {
      ...datas,
      Height: formDatasHeight,
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
        {formDatasHeight.map((item) => (
          <li className="care-elements__edit-item" key={item.id}>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <InputDate
                label="Date:"
                value={timestampToDateISOTZ(
                  formDatasHeight.find(({ id }) => id === item.id)?.Date
                )}
                onChange={handleChange}
                id={item.id.toString()}
                name="Date"
              />
            </span>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <Input
                label="Height (cm):"
                value={
                  formDatasHeight.find(({ id }) => id === item.id)?.Height ?? ""
                }
                onChange={handleChange}
                id={item.id.toString()}
                name="Height"
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

export default HeightHistoryEdit;
