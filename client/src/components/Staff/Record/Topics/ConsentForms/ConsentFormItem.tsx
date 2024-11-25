import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  ConsentFormType,
  EformType,
  MessageAttachmentType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { showDocument } from "../../../../../utils/files/showDocument";
import Button from "../../../../UI/Buttons/Button";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import SignCell from "../../../../UI/Tables/SignCell";

type ConsentFormItemProps = {
  item: EformType;
  editCounter: React.MutableRefObject<number>;
  lastItemRef?: (node: Element | null) => void;
  topicPut: UseMutationResult<ConsentFormType, Error, ConsentFormType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
  setFaxVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFileToFax: React.Dispatch<
    React.SetStateAction<Partial<MessageAttachmentType> | undefined>
  >;
  setNewMessageExternalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setAttachmentsToSend: React.Dispatch<
    React.SetStateAction<Partial<MessageAttachmentType>[] | undefined>
  >;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  isLoadingFile: boolean;
  setIsLoadingFile: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConsentFormItem = ({
  item,
  editCounter,
  lastItemRef,
  topicPut,
  topicDelete,
  setFaxVisible,
  setFileToFax,
  setNewMessageExternalVisible,
  setAttachmentsToSend,
  errMsgPost,
  setErrMsgPost,
  isLoadingFile,
  setIsLoadingFile,
}: ConsentFormItemProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [progress, setProgress] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(item);

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  const handleCancel = () => {
    editCounter.current -= 1;
    setErrMsgPost("");
    setItemInfos(item);
    setEditVisible(false);
  };

  const handleSave = async () => {
    setErrMsgPost("");
    const consentFormToPut: ConsentFormType = {
      ...itemInfos,
      updates: [
        ...itemInfos.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    //Validation
    if (consentFormToPut.name === "") {
      setErrMsgPost("Name field is required");
      return;
    }
    if (!consentFormToPut.file) {
      setErrMsgPost("Please upload a file");
      return;
    }

    setProgress(true);
    topicPut.mutate(consentFormToPut, {
      onSuccess: () => {
        setEditVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const { value } = e.target;
    setItemInfos({ ...itemInfos, name: value });
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
    showDocument(item.file.url, item.file.mime);
  };

  return (
    <tr className="consentforms__item" ref={lastItemRef}>
      <td>
        <div className="consentforms__item-btn-container">
          {editVisible ? (
            <>
              <SaveButton onClick={handleSave} disabled={progress} />
              <CancelButton onClick={handleCancel} disabled={progress} />
            </>
          ) : (
            <>
              <Button onClick={handleSend} disabled={progress} label="Send" />
              <Button onClick={handleFax} disabled={progress} label="Fax" />
              <Button
                onClick={handleEditClick}
                disabled={progress}
                label="Edit"
              />
              <DeleteButton onClick={handleDeleteClick} disabled={progress} />
            </>
          )}
        </div>
      </td>
      <td>
        {editVisible ? (
          <input
            type="text"
            autoComplete="off"
            autoFocus
            value={itemInfos.name}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        ) : (
          item.name
        )}
      </td>
      <td className="consentforms__link">
        <span onClick={handleClick}>{item.file.name}</span>
      </td>
      <SignCell item={item} />
    </tr>
  );
};

export default ConsentFormItem;
