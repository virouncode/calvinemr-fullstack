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

type TestosteroneHistoryEditProps = {
  datas: CareElementType;
  careElementPut: UseMutationResult<
    CareElementType,
    Error,
    CareElementType,
    void
  >;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const TestosteroneHistoryEdit = ({
  datas,
  careElementPut,
  setEditVisible,
}: TestosteroneHistoryEditProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatasTestosterone, setFormDatasTestosterone] = useState<
    {
      id: number;
      Testosterone: string;
      TestosteroneUnit: "nmol/L";
      Date: number;
    }[]
  >(
    datas?.Testosterone.map((item, index) => {
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
      case "Testosterone":
        setFormDatasTestosterone(
          formDatasTestosterone.map((item) => {
            return item.id === id ? { ...item, Testosterone: value } : item;
          })
        );
        break;
      case "Date":
        setFormDatasTestosterone(
          formDatasTestosterone.map((item) => {
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
      formDatasTestosterone.some(
        ({ Testosterone, Date }) => !Testosterone || !Date
      )
    ) {
      setErrMsgPost("Please fill both Testosterone and Date fields");
      return;
    }
    if (
      formDatasTestosterone.some(
        ({ Testosterone }) => !Testosterone.match(/^\d+(\.\d{0,2})?$/)
      )
    ) {
      setErrMsgPost("Please enter a valid number for Testosterone");
      return;
    }
    const careElementToPut = {
      ...datas,
      Testosterone: formDatasTestosterone,
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
        {formDatasTestosterone.map((item) => (
          <li className="care-elements__edit-item" key={item.id}>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <InputDate
                label="Date:"
                value={timestampToDateISOTZ(
                  formDatasTestosterone.find(({ id }) => id === item.id)?.Date
                )}
                onChange={handleChange}
                id={item.id.toString()}
                name="Date"
              />
            </span>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <Input
                label="Testosterone (nmol/L):"
                value={
                  formDatasTestosterone.find(({ id }) => id === item.id)
                    ?.Testosterone ?? ""
                }
                onChange={handleChange}
                id={item.id.toString()}
                name="Testosterone"
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

export default TestosteroneHistoryEdit;
