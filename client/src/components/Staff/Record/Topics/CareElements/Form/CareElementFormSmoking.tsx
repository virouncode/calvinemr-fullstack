import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import { ynIndicatorsimpleCT } from "../../../../../../omdDatas/codesTables";
import {
  CareElementListItemType,
  CareElementType,
} from "../../../../../../types/api";
import { UserStaffType } from "../../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
  todayTZTimestamp,
} from "../../../../../../utils/dates/formatDates";
import CancelButton from "../../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../../UI/Buttons/SaveButton";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";
import GenericList from "../../../../../UI/Lists/GenericList";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";

type CareElementFormSmokingProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  careElementToAdd: CareElementListItemType;
  careElementsDatas?: CareElementType;
  patientId: number;
  topicPost: UseMutationResult<
    CareElementType,
    Error,
    Partial<CareElementType>,
    void
  >;
  topicPut: UseMutationResult<CareElementType, Error, CareElementType, void>;
};

const CareElementFormSmoking = ({
  setAddVisible,
  careElementToAdd,
  careElementsDatas,
  patientId,
  topicPost,
  topicPut,
}: CareElementFormSmokingProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [errMsgPost, setErrMsgPost] = useState<string | null>(null);
  const [progress, setProgress] = useState(false);
  const [formDatasSmokingStatus, setFormDatasSmokingStatus] = useState({
    Status: "",
    Date: todayTZTimestamp(),
  });
  const [formDatasSmokingPacks, setFormDatasSmokingPacks] = useState({
    PerDay: "",
    Date: todayTZTimestamp(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    const { name, value } = e.target;
    switch (name) {
      case "Date":
        if (value === "") return;
        setFormDatasSmokingStatus({
          ...formDatasSmokingStatus,
          Date: dateISOToTimestampTZ(value) as number,
        });
        setFormDatasSmokingPacks({
          ...formDatasSmokingPacks,
          Date: dateISOToTimestampTZ(value) as number,
        });
        return;
      case "Status":
        setFormDatasSmokingStatus({
          ...formDatasSmokingStatus,
          Status: value,
        });
        setFormDatasSmokingPacks({
          ...formDatasSmokingPacks,
          PerDay: value === "N" ? "0" : "",
        });
        return;
      case "PerDay":
        setFormDatasSmokingPacks({
          ...formDatasSmokingPacks,
          PerDay: value,
        });
        setFormDatasSmokingStatus({
          ...formDatasSmokingStatus,
          Status: !value ? "N" : "Y",
        });
        return;
    }
  };

  const handleSubmit = async () => {
    setErrMsgPost("");
    if (!formDatasSmokingStatus.Status) {
      setErrMsgPost(`Please select a status.`);
      return;
    }
    if (
      formDatasSmokingStatus.Status === "Y" &&
      !formDatasSmokingPacks.PerDay
    ) {
      setErrMsgPost(`Please enter the number of packs per day.`);
      return;
    }
    const regex = /^\d+(\.\d{0,5})?$/;
    if (
      formDatasSmokingPacks.PerDay &&
      !regex.test(formDatasSmokingPacks.PerDay)
    ) {
      setErrMsgPost(`Invalid Packs Per Day : Please enter a valid number.`);
      return;
    }
    if (careElementsDatas) {
      const topicToPut: CareElementType = {
        ...careElementsDatas,
        updates: [
          ...careElementsDatas.updates,
          { updated_by_id: user.id, date_updated: nowTZTimestamp() },
        ],
        SmokingStatus: [
          ...careElementsDatas.SmokingStatus,
          formDatasSmokingStatus,
        ],
        SmokingPacks: [
          ...careElementsDatas.SmokingPacks,
          {
            PerDay: formDatasSmokingPacks.PerDay ?? "0",
            Date: formDatasSmokingPacks.Date,
          },
        ],
      };
      setProgress(true);
      topicPut.mutate(topicToPut, {
        onSuccess: () => {
          setAddVisible(false);
        },
        onSettled: () => {
          setProgress(false);
        },
      });
    } else {
      const topicToPost: Partial<CareElementType> = {
        patient_id: patientId,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
        SmokingStatus: [formDatasSmokingStatus],
        SmokingPacks: [
          {
            PerDay: formDatasSmokingPacks.PerDay ?? "0",
            Date: formDatasSmokingPacks.Date,
          },
        ],
      };
      setProgress(true);
      topicPost.mutate(topicToPost, {
        onSuccess: () => {
          setAddVisible(false);
        },
        onSettled: () => {
          setProgress(false);
        },
      });
    }
  };
  const handleCancel = () => {
    setAddVisible(false);
  };

  return (
    <div className="care-elements__form-container">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="care-elements__form">
        <div className="care-elements__form-item">
          <label htmlFor="">Item</label>
          <p>Smoking</p>
        </div>
        <div className="care-elements__form-item">
          <GenericList
            list={ynIndicatorsimpleCT}
            name="Status"
            handleChange={handleChange}
            value={formDatasSmokingStatus.Status}
            noneOption={false}
            label="Status"
            placeHolder="Choose..."
            id="status"
          />
        </div>
        <div className="care-elements__form-item">
          <Input
            label="Packs Per Day"
            value={formDatasSmokingPacks.PerDay}
            onChange={handleChange}
            name="PerDay"
            id="perDay"
          />
        </div>
        <div className="care-elements__form-item">
          <InputDate
            label="Date"
            value={timestampToDateISOTZ(formDatasSmokingStatus.Date)}
            onChange={handleChange}
            name="Date"
            id="date"
          />
        </div>
      </div>
      <div className="checklist__form-btn-container">
        <SaveButton onClick={handleSubmit} disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </div>
  );
};

export default CareElementFormSmoking;
