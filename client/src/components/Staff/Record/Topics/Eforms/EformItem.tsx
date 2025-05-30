import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { EformType, MessageAttachmentType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import Button from "../../../../UI/Buttons/Button";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import SignCell from "../../../../UI/Tables/SignCell";

type EformItemType = {
  item: EformType;
  lastItemRef?: (node: Element | null) => void;
  topicPut: UseMutationResult<EformType, Error, EformType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
  setFaxVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFileToFax: React.Dispatch<
    React.SetStateAction<Partial<MessageAttachmentType> | undefined>
  >;
  setNewMessageExternalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setAttachmentsToSend: React.Dispatch<
    React.SetStateAction<Partial<MessageAttachmentType>[] | undefined>
  >;
  setEformToEdit: React.Dispatch<React.SetStateAction<EformType | undefined>>;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const EformItem = ({
  item,
  lastItemRef,
  topicPut,
  topicDelete,
  setFaxVisible,
  setFileToFax,
  setNewMessageExternalVisible,
  setAttachmentsToSend,
  setEformToEdit,
  setEditVisible,
}: EformItemType) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [progress, setProgress] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const [name, setName] = useState(item.name);

  const handleCancel = () => {
    setName(item.name);
    setRenameVisible(false);
  };

  const handleSave = async () => {
    const eformToPut = {
      ...item,
      name,
      updates: [
        ...item.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    setProgress(true);
    topicPut.mutate(eformToPut, {
      onSuccess: () => {
        setRenameVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleRenameClick = () => {
    setRenameVisible(true);
  };

  const handleDeleteClick = async () => {
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

  const handleFax = () => {
    setFileToFax({ alias: item.name, file: item.file });
    setFaxVisible(true);
  };
  const handleSend = () => {
    setAttachmentsToSend([
      {
        file: item.file,
        alias: item.name,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
        created_by_user_type: "staff",
      },
    ]);
    setNewMessageExternalVisible(true);
  };

  const handleClick = () => {
    setEformToEdit(item);
    setEditVisible(true);
  };

  return (
    <tr className="eforms__item" ref={lastItemRef}>
      <td>
        <div className="eforms__item-btn-container">
          {renameVisible ? (
            <>
              <SaveButton onClick={handleSave} disabled={progress} />
              <CancelButton onClick={handleCancel} disabled={progress} />
            </>
          ) : (
            <>
              <Button onClick={handleSend} disabled={progress} label="Send" />
              <Button onClick={handleFax} disabled={progress} label="Fax" />
              <Button
                onClick={handleRenameClick}
                disabled={progress}
                label="Rename"
              />
              <DeleteButton onClick={handleDeleteClick} disabled={progress} />
            </>
          )}
        </div>
      </td>
      <td className="eforms__link">
        {renameVisible ? (
          <input
            type="text"
            autoComplete="off"
            autoFocus
            value={name}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        ) : (
          <span onClick={handleClick}>{item.name}</span>
        )}
      </td>
      <SignCell item={item} />
    </tr>
  );
};

export default EformItem;
