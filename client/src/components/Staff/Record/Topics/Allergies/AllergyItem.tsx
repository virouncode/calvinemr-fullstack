import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  lifeStageCT,
  propertyOfOffendingAgentCT,
  reactionSeverityCT,
  reactionTypeCT,
} from "../../../../../omdDatas/codesTables";
import { AllergyType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { allergySchema } from "../../../../../validation/record/allergyValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import InputDateToggle from "../../../../UI/Inputs/InputDateToggle";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import GenericListToggle from "../../../../UI/Lists/GenericListToggle";
import SignCell from "../../../../UI/Tables/SignCell";

type AllergyItemProps = {
  item: AllergyType;
  editCounter: React.MutableRefObject<number>;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  lastItemRef?: (node: Element | null) => void;
  topicPut: UseMutationResult<AllergyType, Error, AllergyType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
};

const AllergyItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef,
  topicPut,
  topicDelete,
}: AllergyItemProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<AllergyType | undefined>();
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
    if (name === "StartDate" || name === "RecordedDate") {
      value = dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...(itemInfos as AllergyType), [name]: value });
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    //Formatting
    const topicToPut: AllergyType = {
      ...(itemInfos as AllergyType),
      OffendingAgentDescription: firstLetterOfFirstWordUpper(
        itemInfos?.OffendingAgentDescription ?? ""
      ),
      Reaction: firstLetterOfFirstWordUpper(itemInfos?.Reaction ?? ""),
      Notes: firstLetterOfFirstWordUpper(itemInfos?.Notes ?? ""),
      updates: [
        ...(itemInfos?.updates ?? []),
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    //Validation
    try {
      await allergySchema.validate(topicToPut);
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

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
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
        className="allergies__item"
        style={{ border: errMsgPost && editVisible ? "solid 1.5px red" : "" }}
        ref={lastItemRef}
      >
        <td>
          <div className="allergies__item-btn-container">
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
            value={itemInfos.OffendingAgentDescription}
            onChange={handleChange}
            name="OffendingAgentDescription"
            editVisible={editVisible}
          />
        </td>
        <td>
          <GenericListToggle
            list={propertyOfOffendingAgentCT}
            value={itemInfos.PropertyOfOffendingAgent}
            name="PropertyOfOffendingAgent"
            handleChange={handleChange}
            editVisible={editVisible}
            noneOption={false}
            placeHolder="Choose..."
          />
        </td>
        <td>
          <GenericListToggle
            list={reactionTypeCT}
            value={itemInfos.ReactionType}
            name="ReactionType"
            handleChange={handleChange}
            editVisible={editVisible}
            noneOption={false}
            placeHolder="Choose..."
          />
        </td>
        <td>
          <InputDateToggle
            value={timestampToDateISOTZ(itemInfos.StartDate)}
            onChange={handleChange}
            name="StartDate"
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
            noneOption={false}
            placeHolder="Choose..."
          />
        </td>
        <td>
          <GenericListToggle
            list={reactionSeverityCT}
            value={itemInfos.Severity}
            name="Severity"
            handleChange={handleChange}
            editVisible={editVisible}
            noneOption={false}
            placeHolder="Choose..."
          />
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.Reaction}
            onChange={handleChange}
            name="Reaction"
            editVisible={editVisible}
          />
        </td>
        <td>{timestampToDateISOTZ(itemInfos.RecordedDate)}</td>
        <td>
          <InputTextToggle
            value={itemInfos.Notes}
            onChange={handleChange}
            name="Notes"
            editVisible={editVisible}
          />
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default AllergyItem;
