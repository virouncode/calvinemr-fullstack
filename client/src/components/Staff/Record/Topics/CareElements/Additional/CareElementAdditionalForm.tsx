import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import {
  CareElementAdditionalType,
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
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";

type CareElementAdditionalFormProps = {
  setAddAdditionalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  careElementAdditionalToAdd: {
    Name: string;
    Unit: string;
  };
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

const CareElementAdditionalForm = ({
  setAddAdditionalVisible,
  careElementAdditionalToAdd,
  careElementsDatas,
  patientId,
  topicPost,
  topicPut,
}: CareElementAdditionalFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [errMsgPost, setErrMsgPost] = useState<string | null>(null);
  const [progress, setProgress] = useState(false);
  const [formDatas, setFormDatas] = useState({
    Value: "",
    Date: todayTZTimestamp(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const { name, value } = e.target;
    if (name === "Date") {
      if (value === "") return;
      setFormDatas({
        ...formDatas,
        Date: dateISOToTimestampTZ(value) as number,
      });
      return;
    }
    setFormDatas({ ...formDatas, Value: value });
  };

  const handleSubmit = async () => {
    setErrMsgPost("");
    if (formDatas.Value === "") {
      setErrMsgPost("Please fill all fields");
      return;
    }
    if (careElementsDatas) {
      const topicToPut: CareElementType = {
        ...careElementsDatas,
        updates: [
          ...careElementsDatas.updates,
          { updated_by_id: user.id, date_updated: nowTZTimestamp() },
        ],
        Additional: careElementsDatas.Additional?.map(
          (additional: CareElementAdditionalType) => {
            if (additional.Name === careElementAdditionalToAdd.Name) {
              return {
                ...additional,
                Data: [
                  ...additional.Data,
                  { Value: formDatas.Value, Date: formDatas.Date },
                ],
              };
            }
            return additional;
          }
        ),
      };
      setProgress(true);
      topicPut.mutate(topicToPut, {
        onSuccess: () => {
          setAddAdditionalVisible(false);
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
        Additional: [
          {
            Name: careElementAdditionalToAdd.Name,
            Unit: careElementAdditionalToAdd.Unit,
            Data: [{ Value: formDatas.Value, Date: formDatas.Date }],
          },
        ],
      };
      setProgress(true);
      topicPost.mutate(topicToPost, {
        onSuccess: () => {
          setAddAdditionalVisible(false);
        },
        onSettled: () => {
          setProgress(false);
        },
      });
    }
  };
  const handleCancel = () => {
    setAddAdditionalVisible(false);
  };

  return (
    <div className="care-elements__form-container">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="care-elements__form">
        <div className="care-elements__form-item">
          <label htmlFor="">Item</label>
          <p>
            {careElementAdditionalToAdd.Name} ({careElementAdditionalToAdd.Unit}
            )
          </p>
        </div>
        <div className="care-elements__form-item">
          <Input
            label="Result"
            value={formDatas.Value as string}
            onChange={handleChange}
            name="Value"
            id="result"
          />
        </div>
        <div className="care-elements__form-item">
          <InputDate
            label="Date"
            value={timestampToDateISOTZ(formDatas.Date)}
            onChange={handleChange}
            name="Date"
            id="date"
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

export default CareElementAdditionalForm;
