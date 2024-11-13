import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  CareElementAdditionalType,
  CareElementType,
} from "../../../../../../types/api";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
  todayTZTimestamp,
} from "../../../../../../utils/dates/formatDates";
import CancelButton from "../../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../../UI/Buttons/SaveButton";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";

type NewCareElementItemFormProps = {
  setAddItemVisible: React.Dispatch<React.SetStateAction<boolean>>;
  careElementsDatas?: CareElementType;
  topicPut: UseMutationResult<CareElementType, Error, CareElementType, void>;
};

const NewCareElementItemForm = ({
  setAddItemVisible,
  careElementsDatas,
  topicPut,
}: NewCareElementItemFormProps) => {
  const [formDatas, setFormDatas] = useState<CareElementAdditionalType>({
    Name: "",
    Unit: "",
    Data: [{ Value: "", Date: todayTZTimestamp() }],
  });
  const [errMsgPost, setErrMsgPost] = useState("");
  const [progress, setProgress] = useState(false);
  const handleSubmit = async () => {
    setErrMsgPost("");
    if (formDatas.Name === "" || formDatas.Data[0].Value === "") {
      setErrMsgPost("All fields except Unit are required");
      return;
    }
    const topicToPut: CareElementType = {
      ...(careElementsDatas as CareElementType),
      Additional: [...(careElementsDatas?.Additional ?? []), formDatas],
    };
    setProgress(true);
    topicPut.mutate(topicToPut, {
      onSuccess: () => {
        setAddItemVisible(false);
      },
      onSettled: (error) => {
        setProgress(false);
      },
    });
  };

  const handleCancel = () => {
    setAddItemVisible(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const { name, value } = e.target;
    switch (name) {
      case "Date":
        if (value === "") return;
        setFormDatas({
          ...formDatas,
          Data: [
            {
              ...formDatas.Data[0],
              Date: dateISOToTimestampTZ(value) as number,
            },
          ],
        });
        return;
      case "Name":
        setFormDatas({ ...formDatas, Name: value });
        return;
      case "Unit":
        setFormDatas({ ...formDatas, Unit: value });
        return;
      case "Value":
        setFormDatas({
          ...formDatas,
          Data: [{ ...formDatas.Data[0], Value: value }],
        });
        return;
    }
  };

  return (
    <div className="care-elements__form-container">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="care-elements__form">
        <div className="care-elements__form-item">
          <Input
            label="Name"
            value={formDatas.Name}
            onChange={handleChange}
            name="Name"
            id="Name"
          />
        </div>
        <div className="care-elements__form-item">
          <Input
            label="Unit"
            value={formDatas.Unit}
            onChange={handleChange}
            name="Unit"
            id="Unit"
          />
        </div>
        <div className="care-elements__form-item">
          <Input
            label="Value"
            value={formDatas.Data[0].Value}
            onChange={handleChange}
            name="Value"
            id="Value"
          />
        </div>
        <div className="care-elements__form-item">
          <InputDate
            label="Date"
            value={timestampToDateISOTZ(formDatas.Data[0].Date)}
            onChange={handleChange}
            name="Date"
            id="Date"
          />
        </div>
      </div>
      <div className="care-elements__form-btn-container">
        <SaveButton onClick={handleSubmit} disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </div>
  );
};

export default NewCareElementItemForm;
