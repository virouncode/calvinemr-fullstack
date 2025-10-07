import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { lifeStageCT } from "../../../../../omdDatas/codesTables";
import { ProblemListType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { problemListSchema } from "../../../../../validation/record/problemListValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import InputDateToggle from "../../../../UI/Inputs/InputDateToggle";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import GenericListToggle from "../../../../UI/Lists/GenericListToggle";
import SignCell from "../../../../UI/Tables/SignCell";

type ProblemListItemProps = {
  item: ProblemListType;
  editCounter: React.MutableRefObject<number>;
  setErrMsgPost: React.Dispatch<string>;
  errMsgPost: string;
  targetRef?: (node: Element | null) => void;
  topicPut: UseMutationResult<ProblemListType, Error, ProblemListType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
};

const ProblemListItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  targetRef,
  topicPut,
  topicDelete,
}: ProblemListItemProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<ProblemListType>(item);
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
    if (name === "OnsetDate" || name === "ResolutionDate") {
      value = dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async () => {
    //Formatting
    const topicToPut: ProblemListType = {
      ...itemInfos,
      ProblemDiagnosisDescription: firstLetterOfFirstWordUpper(
        itemInfos.ProblemDiagnosisDescription
      ),
      ProblemDescription: firstLetterOfFirstWordUpper(
        itemInfos.ProblemDescription
      ),
      ProblemStatus: firstLetterOfFirstWordUpper(itemInfos.ProblemStatus),
      Notes: firstLetterOfFirstWordUpper(itemInfos.Notes),
      updates: [
        ...itemInfos.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    //Validation
    try {
      await problemListSchema.validate(topicToPut);
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
      },
      onSettled: () => {
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
        className="problemlist__item"
        style={{ border: errMsgPost && editVisible ? "solid 1.5px red" : "" }}
        ref={targetRef}
      >
        <td>
          <div className="problemlist__item-btn-container">
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
            name="ProblemDiagnosisDescription"
            value={itemInfos.ProblemDiagnosisDescription}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            name="ProblemDescription"
            value={itemInfos.ProblemDescription}
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
          <InputDateToggle
            name="OnsetDate"
            value={timestampToDateISOTZ(itemInfos.OnsetDate)}
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
            editVisible={editVisible}
            placeHolder="Select life stage..."
          />
        </td>
        <td>
          <InputDateToggle
            name="ResolutionDate"
            value={timestampToDateISOTZ(itemInfos.ResolutionDate)}
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

export default ProblemListItem;
