import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { ChecklistType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  getLimitDate,
  isTestExpired,
  toValidityText,
} from "../../../../../utils/checklist/checklistUtils";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { checklistSchema } from "../../../../../validation/record/checklistValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import InputDateToggle from "../../../../UI/Inputs/InputDateToggle";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import DurationPickerLong from "../../../../UI/Pickers/DurationPickerLong";

type ChecklistHistoryItemProps = {
  result: ChecklistType;
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  topicPut: UseMutationResult<ChecklistType, Error, ChecklistType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
};

const ChecklistHistoryItem = ({
  result,
  errMsgPost,
  setErrMsgPost,
  topicPut,
  topicDelete,
}: ChecklistHistoryItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<ChecklistType>(result);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setItemInfos(result);
  }, [result]);

  const handleEdit = () => {
    setErrMsgPost("");
    setEditVisible(true);
  };
  const handleDelete = async () => {
    setErrMsgPost("");
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      setProgress(true);
      topicDelete.mutate(result.id, {
        onSuccess: () => {
          setProgress(false);
        },
        onError: () => {
          setProgress(false);
        },
      });
    }
  };

  const handleDurationPickerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "Y" | "M" | "W" | "D"
  ) => {
    setErrMsgPost("");
    const value = parseInt(e.target.value);
    let name;
    switch (type) {
      case "Y":
        name = "years";
        break;
      case "M":
        name = "months";
        break;
      case "W":
        name = "weeks";
        break;
      case "D":
        name = "days";
        break;
      default:
        name = "days";
    }
    setItemInfos({
      ...itemInfos,
      validity: { ...itemInfos.validity, [name]: value },
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const { name, value } = e.target;
    if (name === "date") {
      if (value === "") return;
      setItemInfos({
        ...itemInfos,
        date: dateISOToTimestampTZ(value) as number,
      });
      return;
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSave = async () => {
    const topicToPut: ChecklistType = {
      ...itemInfos,
      validity: {
        years: !isNaN(itemInfos.validity.years) ? itemInfos.validity.years : 0,
        months: !isNaN(itemInfos.validity.months)
          ? itemInfos.validity.months
          : 0,
        weeks: !isNaN(itemInfos.validity.weeks) ? itemInfos.validity.weeks : 0,
        days: !isNaN(itemInfos.validity.days) ? itemInfos.validity.days : 0,
      },
      updates: [
        ...result.updates,
        {
          updated_by_id: user.id,
          date_updated: nowTZTimestamp(),
        },
      ],
    };
    //Validation
    try {
      await checklistSchema.validate(topicToPut);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    //Submission
    setProgress(true);
    topicPut.mutate(topicToPut, {
      onSuccess: () => {
        setEditVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  const handleCancel = () => {
    setErrMsgPost("");
    setEditVisible(false);
    setItemInfos(result);
  };
  return (
    <tr
      className="checklist__item"
      style={{
        color:
          isTestExpired(itemInfos.date, itemInfos.validity) === "Y"
            ? "red"
            : "green",
        borderColor: errMsgPost ? "red" : "",
      }}
    >
      <td className="checklist__item-btn-container">
        {editVisible ? (
          <>
            <SaveButton onClick={handleSave} disabled={progress} />
            <CancelButton onClick={handleCancel} disabled={progress} />
          </>
        ) : (
          <>
            <EditButton onClick={handleEdit} disabled={progress} />
            <DeleteButton onClick={handleDelete} disabled={progress} />
          </>
        )}
      </td>
      <td>
        {editVisible ? (
          <DurationPickerLong
            durationYears={itemInfos.validity.years}
            durationMonths={itemInfos.validity.months}
            durationWeeks={itemInfos.validity.weeks}
            durationDays={itemInfos.validity.days}
            handleDurationPickerChange={handleDurationPickerChange}
          />
        ) : (
          toValidityText(itemInfos.validity)
        )}
      </td>
      <td>
        <InputTextToggle
          value={itemInfos.result}
          onChange={handleChange}
          name="result"
          id="result"
          editVisible={editVisible}
        />
      </td>
      <td>
        <InputDateToggle
          value={timestampToDateISOTZ(itemInfos.date)}
          onChange={handleChange}
          name="date"
          id="date"
          editVisible={editVisible}
        />
      </td>
      <td>{getLimitDate(itemInfos.date, itemInfos.validity)}</td>
      <td>{isTestExpired(itemInfos.date, itemInfos.validity)}</td>
    </tr>
  );
};

export default ChecklistHistoryItem;
