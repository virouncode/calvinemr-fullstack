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

type E2HistoryEditProps = {
  datas: CareElementType;
  careElementPut: UseMutationResult<
    CareElementType,
    Error,
    CareElementType,
    void
  >;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const E2HistoryEdit = ({
  datas,
  careElementPut,
  setEditVisible,
}: E2HistoryEditProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatasE2, setFormDatasE2] = useState<
    {
      id: number;
      E2: string;
      E2Unit: "pmol/L";
      Date: number;
    }[]
  >(
    datas?.E2.map((item, index) => {
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
      case "E2":
        setFormDatasE2(
          formDatasE2.map((item) => {
            return item.id === id ? { ...item, E2: value } : item;
          })
        );
        break;
      case "Date":
        setFormDatasE2(
          formDatasE2.map((item) => {
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
    if (formDatasE2.some(({ E2, Date }) => !E2 || !Date)) {
      setErrMsgPost("Please fill both E2 and Date fields");
      return;
    }
    if (formDatasE2.some(({ E2 }) => !E2.match(/^\d+(\.\d{0,2})?$/))) {
      setErrMsgPost("Please enter a valid number for E2");
      return;
    }
    const careElementToPut = {
      ...datas,
      E2: formDatasE2,
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
        {formDatasE2.map((item) => (
          <li className="care-elements__edit-item" key={item.id}>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <InputDate
                label="Date:"
                value={timestampToDateISOTZ(
                  formDatasE2.find(({ id }) => id === item.id)?.Date
                )}
                onChange={handleChange}
                id={item.id.toString()}
                name="Date"
              />
            </span>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <Input
                label="E2 (pmol/L):"
                value={formDatasE2.find(({ id }) => id === item.id)?.E2 ?? ""}
                onChange={handleChange}
                id={item.id.toString()}
                name="E2"
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

export default E2HistoryEdit;
