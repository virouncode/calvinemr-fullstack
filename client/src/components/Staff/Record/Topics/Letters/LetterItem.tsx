import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { LetterType, MessageAttachmentType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { showDocument } from "../../../../../utils/files/showDocument";
import Button from "../../../../UI/Buttons/Button";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import SignCell from "../../../../UI/Tables/SignCell";

type LetterItemType = {
  item: LetterType;
  editCounter: React.MutableRefObject<number>;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  targetRef?: (node: Element | null) => void;
  topicPut: UseMutationResult<LetterType, Error, LetterType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
  setFaxVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFileToFax: React.Dispatch<
    React.SetStateAction<Partial<MessageAttachmentType> | undefined>
  >;
  setNewMessageExternalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setNewMessageInternalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setAttachmentsToSend: React.Dispatch<
    React.SetStateAction<Partial<MessageAttachmentType>[] | undefined>
  >;
};

const LetterItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  targetRef,
  topicPut,
  topicDelete,
  setFaxVisible,
  setFileToFax,
  setNewMessageExternalVisible,
  setNewMessageInternalVisible,
  setAttachmentsToSend,
}: LetterItemType) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<LetterType>(item);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  //HANDLERS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async () => {
    const topicToPut: LetterType = {
      ...itemInfos,
      updates: [
        ...itemInfos.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };

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

  const handleFax = () => {
    setFileToFax({ alias: item.name, file: item.file });
    setFaxVisible(true);
  };
  const handleSendExternal = () => {
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

  const handleSendInternal = () => {
    setAttachmentsToSend([
      {
        file: item.file,
        alias: item.name,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
        created_by_user_type: "staff",
      },
    ]);
    setNewMessageInternalVisible(true);
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
        className="letters__item"
        style={{ border: errMsgPost && editVisible ? "solid 1.5px red" : "" }}
        ref={targetRef}
      >
        <td>
          <div className="letters__item-btn-container">
            {!editVisible ? (
              <>
                <EditButton onClick={handleEditClick} disabled={progress} />
                <Button
                  onClick={handleSendInternal}
                  disabled={progress}
                  label="Send (Internal)"
                />
                <Button
                  onClick={handleSendExternal}
                  disabled={progress}
                  label="Send (External)"
                />
                <Button onClick={handleFax} disabled={progress} label="Fax" />
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
            value={itemInfos.name}
            onChange={handleChange}
            name="name"
            editVisible={editVisible}
          />
        </td>
        <td>
          <span
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => showDocument(item.file.url, "pdf")}
          >
            {item.file.name}
          </span>
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.description}
            onChange={handleChange}
            name="description"
            editVisible={editVisible}
          />
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default LetterItem;
