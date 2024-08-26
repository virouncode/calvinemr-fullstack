import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { lifeStageCT } from "../../../../../omdDatas/codesTables";
import { PastHealthType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { pastHealthSchema } from "../../../../../validation/record/pastHealthValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import InputDateToggle from "../../../../UI/Inputs/InputDateToggle";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import GenericListToggle from "../../../../UI/Lists/GenericListToggle";
import SignCell from "../../../../UI/Tables/SignCell";

type PastHealthItemProps = {
  item: PastHealthType;
  editCounter: React.MutableRefObject<number>;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  lastItemRef?: (node: Element | null) => void;
  topicPut: UseMutationResult<PastHealthType, Error, PastHealthType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
};

const PastHealthItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef,
  topicPut,
  topicDelete,
}: PastHealthItemProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<PastHealthType | undefined>();
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  //HANDLERS
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    const name = e.target.name;
    let value: string | number | null = e.target.value;
    if (
      name === "ProcedureDate" ||
      name === "OnsetOrEventDate" ||
      name === "ResolvedDate"
    ) {
      value = dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...(itemInfos as PastHealthType), [name]: value });
  };

  const handleSubmit = async () => {
    setErrMsgPost("");
    //Formatting
    const topicToPut: PastHealthType = {
      ...(itemInfos as PastHealthType),
      PastHealthProblemDescriptionOrProcedures: firstLetterOfFirstWordUpper(
        itemInfos?.PastHealthProblemDescriptionOrProcedures ?? ""
      ),
      ProblemStatus: firstLetterOfFirstWordUpper(
        itemInfos?.ProblemStatus ?? ""
      ),
      Notes: firstLetterOfFirstWordUpper(itemInfos?.Notes ?? ""),
      updates: [
        ...item.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    //Validation
    try {
      await pastHealthSchema.validate(topicToPut);
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
    setEditVisible(true);
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
        className="pasthealth__item"
        style={{ border: errMsgPost && editVisible ? "solid 1.5px red" : "" }}
        ref={lastItemRef}
      >
        <td>
          <div className="pasthealth__item-btn-container">
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
          <InputTextToggle
            name="PastHealthProblemDescriptionOrProcedures"
            value={itemInfos.PastHealthProblemDescriptionOrProcedures}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputDateToggle
            name="OnsetOrEventDate"
            max={timestampToDateISOTZ(nowTZTimestamp())}
            value={timestampToDateISOTZ(itemInfos.OnsetOrEventDate)}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <td>
          <GenericListToggle
            list={lifeStageCT}
            value={itemInfos.LifeStage}
            name="LifeStage"
            handleChange={handleChange}
            placeHolder="Choose a lifestage..."
            noneOption={false}
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputDateToggle
            name="ProcedureDate"
            max={timestampToDateISOTZ(nowTZTimestamp())}
            value={timestampToDateISOTZ(itemInfos.ProcedureDate)}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputDateToggle
            name="ResolvedDate"
            max={timestampToDateISOTZ(nowTZTimestamp())}
            value={timestampToDateISOTZ(itemInfos.ResolvedDate)}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            name="ProblemStatus"
            value={itemInfos.ProblemStatus}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            name="Notes"
            value={itemInfos.Notes}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default PastHealthItem;
