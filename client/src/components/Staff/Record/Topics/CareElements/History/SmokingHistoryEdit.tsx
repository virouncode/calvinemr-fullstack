import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import { ynIndicatorsimpleCT } from "../../../../../../omdDatas/codesTables";
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
import GenericList from "../../../../../UI/Lists/GenericList";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";

type SmokingHistoryEditProps = {
  datas: CareElementType;
  careElementPut: UseMutationResult<
    CareElementType,
    Error,
    CareElementType,
    void
  >;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const SmokingHistoryEdit = ({
  datas,
  careElementPut,
  setEditVisible,
}: SmokingHistoryEditProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatasSmokingStatus, setFormDatasSmokingStatus] = useState(
    datas?.SmokingStatus?.map((item, index) => {
      return { ...item, id: index };
    })
  );
  const [formDatasSmokingPacks, setFormDatasSmokingPacks] = useState(
    datas?.SmokingPacks?.map((item, index) => {
      return { ...item, id: index };
    })
  );
  const [errMsgPost, setErrMsgPost] = useState("");

  const handleClose = () => {
    setEditVisible(false);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    const id = parseInt(e.target.id);
    const value = e.target.value;
    const name = e.target.name;
    if (name === "Date" && !value) return; //to avoid clearing the date field
    switch (name) {
      case "SmokingStatus":
        setFormDatasSmokingStatus(
          formDatasSmokingStatus.map((item) => {
            return item.id === id ? { ...item, Status: value } : item;
          })
        );
        setFormDatasSmokingPacks(
          formDatasSmokingPacks.map((item) => {
            return item.id === id
              ? { ...item, PerDay: value === "N" ? "0" : "" }
              : item;
          })
        );
        break;
      case "SmokingPacks":
        setFormDatasSmokingPacks(
          formDatasSmokingPacks.map((item) => {
            return item.id === id ? { ...item, PerDay: value } : item;
          })
        );
        setFormDatasSmokingStatus(
          formDatasSmokingStatus.map((item) => {
            return item.id === id
              ? { ...item, Status: Number(value) ? "Y" : "N" }
              : item;
          })
        );
        break;
      case "Date":
        setFormDatasSmokingStatus(
          formDatasSmokingStatus.map((item) => {
            return item.id === id
              ? { ...item, Date: dateISOToTimestampTZ(value) ?? 0 }
              : item;
          })
        );
        setFormDatasSmokingPacks(
          formDatasSmokingPacks.map((item) => {
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
    if (formDatasSmokingPacks.some(({ PerDay, Date }) => !PerDay || !Date)) {
      setErrMsgPost(
        "Please fill Date and Packs Per Day fields (enter 0 if no smoking)"
      );
      return;
    }
    if (
      formDatasSmokingPacks.some(
        ({ PerDay }) => !PerDay.match(/^\d+([.,]\d{0,2})?$/)
      )
    ) {
      setErrMsgPost("Please enter a valid number for Packs Per Day");
      return;
    }
    const careElementToPut = {
      ...datas,
      SmokingStatus: formDatasSmokingStatus,
      SmokingPacks: formDatasSmokingPacks,
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
      <ul className="care-elements__edit-list">
        {formDatasSmokingStatus?.map((item) => (
          <li className="care-elements__edit-item" key={item.id}>
            <span className="care-elements__edit-block">
              <InputDate
                label="Date:"
                value={timestampToDateISOTZ(
                  formDatasSmokingStatus.find(({ id }) => id === item.id)?.Date
                )}
                onChange={handleChange}
                id={item.id.toString()}
                name="Date"
              />
            </span>
            <span className="care-elements__edit-block">
              <GenericList
                list={ynIndicatorsimpleCT}
                name="SmokingStatus"
                handleChange={handleChange}
                value={
                  formDatasSmokingStatus.find(({ id }) => id === item.id)
                    ?.Status ?? ""
                }
                noneOption={false}
                id={item.id.toString()}
                label="Smoking:"
                placeHolder="Choose..."
              />
            </span>
            <span className="care-elements__edit-block">
              <Input
                label="Packs Per day:"
                value={
                  formDatasSmokingPacks.find(({ id }) => id === item.id)
                    ?.PerDay ?? ""
                }
                onChange={handleChange}
                id={item.id.toString()}
                name="SmokingPacks"
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

export default SmokingHistoryEdit;
