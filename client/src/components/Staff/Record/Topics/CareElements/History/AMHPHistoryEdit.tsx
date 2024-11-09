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

type AMHPHistoryEditProps = {
  datas: CareElementType;
  careElementPut: UseMutationResult<
    CareElementType,
    Error,
    CareElementType,
    void
  >;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const AMHPHistoryEdit = ({
  datas,
  careElementPut,
  setEditVisible,
}: AMHPHistoryEditProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatasAMHP, setFormDatasAMHP] = useState<
    {
      id: number;
      AMHP: string;
      AMHPUnit: "pmol/L";
      Date: number;
    }[]
  >(
    datas?.AMHP.map((item, index) => {
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
      case "AMHP":
        setFormDatasAMHP(
          formDatasAMHP.map((item) => {
            return item.id === id ? { ...item, AMHP: value } : item;
          })
        );
        break;
      case "Date":
        setFormDatasAMHP(
          formDatasAMHP.map((item) => {
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
    if (formDatasAMHP.some(({ AMHP, Date }) => !AMHP || !Date)) {
      setErrMsgPost("Please fill both AMHP and Date fields");
      return;
    }
    if (formDatasAMHP.some(({ AMHP }) => !AMHP.match(/^\d+(\.\d{0,2})?$/))) {
      setErrMsgPost("Please enter a valid number for AMHP");
      return;
    }
    const careElementToPut = {
      ...datas,
      AMHP: formDatasAMHP,
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
        {formDatasAMHP.map((item) => (
          <li className="care-elements__edit-item" key={item.id}>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <InputDate
                label="Date:"
                value={timestampToDateISOTZ(
                  formDatasAMHP.find(({ id }) => id === item.id)?.Date
                )}
                onChange={handleChange}
                id={item.id.toString()}
                name="Date"
              />
            </span>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <Input
                label="AMHP (pmol/L):"
                value={
                  formDatasAMHP.find(({ id }) => id === item.id)?.AMHP ?? ""
                }
                onChange={handleChange}
                id={item.id.toString()}
                name="AMHP"
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

export default AMHPHistoryEdit;
