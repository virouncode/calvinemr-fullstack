import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { PregnancyType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { pregnancySchema } from "../../../../../validation/record/pregnancyValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import InputDateToggle from "../../../../UI/Inputs/InputDateToggle";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import SignCell from "../../../../UI/Tables/SignCell";
import PregnanciesList from "./PregnanciesList";

type PregnancyItemProps = {
  item: PregnancyType;
  editCounter: React.MutableRefObject<number>;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  lastItemRef?: (node: Element | null) => void;
  topicPut: UseMutationResult<PregnancyType, Error, PregnancyType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
};

const PregnancyItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef,
  topicPut,
  topicDelete,
}: PregnancyItemProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<PregnancyType | undefined>();
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    let parsedValue: string | number | null;
    if (name === "date_of_event") {
      parsedValue = dateISOToTimestampTZ(value);
    } else if (name === "term_nbr_of_weeks" || name === "term_nbr_of_days") {
      parsedValue = parseInt(value ?? "0");
    } else {
      parsedValue = value;
    }
    setItemInfos({ ...(itemInfos as PregnancyType), [name]: parsedValue });
  };

  const handleChangePregnancyEvent = (value: string) => {
    setItemInfos({ ...(itemInfos as PregnancyType), description: value });
  };

  const handleSubmit = async () => {
    //Formatting
    const topicToPut: PregnancyType = {
      ...(itemInfos as PregnancyType),
      premises: firstLetterOfFirstWordUpper(itemInfos?.premises ?? ""),
      updates: [
        ...item.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    try {
      await pregnancySchema.validate(topicToPut);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    //Submission
    setProgress(true);
    topicPut.mutate(topicToPut, {
      onSuccess: () => {
        editCounter.current -= 1;
        setEditVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleCancel = () => {
    editCounter.current -= 1;
    setErrMsgPost("");
    setItemInfos(item);
    setEditVisible(false);
  };

  const handleEditClick = () => {
    editCounter.current += 1;
    setErrMsgPost("");
    setEditVisible((v) => !v);
  };

  const handleDeleteClick = async () => {
    setErrMsgPost("");
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      setProgress(true);
      topicDelete.mutate(item.id, {
        onSuccess: () => {
          setProgress(false);
        },
        onError: () => {
          setProgress(false);
        },
      });
    }
  };

  return (
    itemInfos && (
      <tr
        className="pregnancies-item"
        style={{ border: errMsgPost && editVisible ? "solid 1.5px red" : "" }}
        ref={lastItemRef}
      >
        <td>
          <div className="pregnancies-item__btn-container">
            {!editVisible ? (
              <>
                <EditButton onClick={handleEditClick} disabled={progress} />
                <DeleteButton onClick={handleDeleteClick} disabled={progress} />
              </>
            ) : (
              <>
                <SaveButton onClick={handleSubmit} disabled={progress} />
                <CancelButton onClick={handleCancel} disabled={progress} />
              </>
            )}
          </div>
        </td>
        <td>
          {editVisible ? (
            <PregnanciesList
              value={itemInfos.description}
              handleChange={handleChangePregnancyEvent}
            />
          ) : (
            <p>{itemInfos.description}</p>
          )}
        </td>
        <td>
          <InputDateToggle
            name="date_of_event"
            value={timestampToDateISOTZ(itemInfos.date_of_event)}
            onChange={handleChange}
            editVisible={editVisible}
            width={120}
          />
        </td>
        <td>
          <InputTextToggle
            name="premises"
            value={itemInfos.premises}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <td>
          {editVisible ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
              }}
            >
              <input
                name="term_nbr_of_weeks"
                type="number"
                value={itemInfos.term_nbr_of_weeks}
                onChange={handleChange}
                style={{ width: "50px", marginRight: "5px" }}
                autoComplete="off"
                min={0}
              />
              <span style={{ marginRight: "5px" }}>w</span>
              <input
                name="term_nbr_of_days"
                type="number"
                value={itemInfos.term_nbr_of_days}
                onChange={handleChange}
                style={{ width: "50px", marginRight: "5px" }}
                autoComplete="off"
                min={0}
              />
              <span>d</span>
            </div>
          ) : (
            (itemInfos.term_nbr_of_weeks || itemInfos.term_nbr_of_days) && (
              <p>
                {`${itemInfos.term_nbr_of_weeks}w ${itemInfos.term_nbr_of_days}d`}
              </p>
            )
          )}
        </td>
        <td>
          <InputTextToggle
            name="notes"
            value={itemInfos.notes}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default PregnancyItem;
