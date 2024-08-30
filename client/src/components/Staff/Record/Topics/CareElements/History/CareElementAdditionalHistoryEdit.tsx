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

type CareElementAdditionalHistoryEditProps = {
  datas: CareElementType;
  lastAdditionalData: {
    Data: {
      Value: string;
      Date: number;
    };
    Name: string;
    Unit: string;
  };
  careElementPut: UseMutationResult<
    CareElementType,
    Error,
    CareElementType,
    void
  >;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const CareElementAdditionalHistoryEdit = ({
  datas,
  careElementPut,
  setEditVisible,
  lastAdditionalData,
}: CareElementAdditionalHistoryEditProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<
    { id: number; Value: string; Date: number }[]
  >(
    datas.Additional.find(
      ({ Name }) => Name === lastAdditionalData.Name
    )?.Data.map((item, index) => ({ ...item, id: index })) ?? []
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
      case "Value":
        setFormDatas(
          formDatas?.map((item) => {
            return item.id === id ? { ...item, Value: value } : item;
          })
        );
        break;
      case "Date":
        setFormDatas(
          formDatas.map((item) => {
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
    if (formDatas.some(({ Value, Date }) => !Value || !Date)) {
      setErrMsgPost("Please fill both Value and Date fields");
      return;
    }
    const careElementToPut = {
      ...datas,
      Additional: datas.Additional.map((item) =>
        item.Name === lastAdditionalData.Name
          ? { ...item, Data: formDatas }
          : item
      ),
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
        {formDatas.map((item) => (
          <li className="care-elements__edit-item" key={item.id}>
            <div className="care-elements__edit-block care-elements__edit-block--double">
              <InputDate
                label="Date:"
                value={timestampToDateISOTZ(
                  formDatas.find(({ id }) => id === item.id)?.Date
                )}
                onChange={handleChange}
                id={item.id.toString()}
                name="Date"
              />
            </div>
            <div
              className="care-elements__edit-block care-elements__edit-block--double"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Input
                label="Value:"
                value={formDatas.find(({ id }) => id === item.id)?.Value ?? ""}
                onChange={handleChange}
                id={item.id.toString()}
                name="Value"
              />
            </div>
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

export default CareElementAdditionalHistoryEdit;
