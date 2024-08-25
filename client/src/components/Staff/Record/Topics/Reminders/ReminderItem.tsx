import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { ReminderType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { reminderSchema } from "../../../../../validation/record/reminderValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import SignCell from "../../../../UI/Tables/SignCell";

type ReminderItemProps = {
  item: ReminderType;
  editCounter: React.MutableRefObject<number>;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  lastItemRef?: (node: Element | null) => void;
  topicPut: UseMutationResult<ReminderType, Error, ReminderType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
};

const ReminderItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef,
  topicPut,
  topicDelete,
}: ReminderItemProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<ReminderType | undefined>();
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  //HANDLERS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    setItemInfos({ ...(itemInfos as ReminderType), [name]: value });
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    //Formatting
    const topicToPut: ReminderType = {
      ...(itemInfos as ReminderType),
      reminder: firstLetterOfFirstWordUpper(itemInfos?.reminder ?? ""),
      updates: [
        ...(itemInfos?.updates ?? []),
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    //Validation
    try {
      await reminderSchema.validate(topicToPut);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    //Submission
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
        className="reminders__item"
        style={{ border: errMsgPost && editVisible ? "solid 1.5px red" : "" }}
        ref={lastItemRef}
      >
        <td>
          <div className="reminders__item-btn-container">
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
            value={itemInfos.reminder}
            name="reminder"
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default ReminderItem;
