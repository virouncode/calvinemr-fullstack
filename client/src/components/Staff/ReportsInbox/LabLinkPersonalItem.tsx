import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useLabLinksPersonalDelete,
  useLabLinksPersonalPut,
} from "../../../hooks/reactquery/mutations/labLinksMutations";
import { LabLinkPersonalType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { copyTextToClipboard } from "../../../utils/js/copyToClipboard";
import { lablinkSchema } from "../../../validation/lablinks/lablinkValidation";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import CopyIcon from "../../UI/Icons/CopyIcon";
import PenIcon from "../../UI/Icons/PenIcon";
import SaveIcon from "../../UI/Icons/SaveIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";
import XmarkIcon from "../../UI/Icons/XmarkIcon";
import Input from "../../UI/Inputs/Input";

type LabLinkPersonalItemProps = {
  link: LabLinkPersonalType;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  targetRef?: (node: Element | null) => void;
};

const LabLinkPersonalItem = ({
  link,
  setErrMsgPost,
  targetRef,
}: LabLinkPersonalItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<LabLinkPersonalType>(link);
  const labLinkPersonalPut = useLabLinksPersonalPut(user.id);
  const labLinkPersonalDelete = useLabLinksPersonalDelete(user.id);

  useEffect(() => {
    setItemInfos(link);
  }, [link]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setErrMsgPost("");
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleCopyLogin = async () => {
    try {
      await copyTextToClipboard(link.login);
      toast.success("Copied !", { containerId: "A" });
    } catch {
      toast.error("Unable to copy login", { containerId: "A" });
    }
  };
  const handleCopyPwd = async () => {
    try {
      await copyTextToClipboard(link.pwd);
      toast.success("Copied !", { containerId: "A" });
    } catch {
      toast.error("Unable to copy password", { containerId: "A" });
    }
  };
  const handleClickEdit = () => {
    setErrMsgPost("");
    setItemInfos(link);
    setEditVisible(true);
  };
  const handleClickSave = async () => {
    const labLinkPersonalToPut: LabLinkPersonalType = {
      ...itemInfos,
      updates:
        itemInfos.updates.length > 0
          ? [
              ...itemInfos.updates,
              {
                date_updated: nowTZTimestamp(),
                updated_by_id: user.id,
              },
            ]
          : [
              {
                date_updated: nowTZTimestamp(),
                updated_by_id: user.id,
              },
            ],
    };
    try {
      await lablinkSchema.validate(labLinkPersonalToPut);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    labLinkPersonalPut.mutate(labLinkPersonalToPut, {
      onSuccess: () => {
        setEditVisible(false);
        setErrMsgPost("");
      },
    });
  };

  const handleCancel = () => {
    setErrMsgPost("");
    setEditVisible(false);
  };
  const handleDelete = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      labLinkPersonalDelete.mutate(link.id);
    }
  };

  return (
    <li className="lablinks__item" ref={targetRef}>
      <div className="lablinks__item-link">
        <a href={link.url} target="_blank" rel="noreferrer">
          {link.name}
        </a>
        {editVisible ? (
          <>
            <SaveIcon onClick={handleClickSave} color="#f53f77" ml={5} />
            <XmarkIcon onClick={handleCancel} ml={15} />
          </>
        ) : (
          <>
            <PenIcon onClick={handleClickEdit} ml={5} />
            <TrashIcon onClick={handleDelete} ml={15} />
          </>
        )}
      </div>
      <div className="lablinks__item-credentials">
        <div className="lablinks__item-login">
          <label htmlFor="lablink-login">
            Login
            <CopyIcon ml={5} onClick={handleCopyLogin} />
          </label>
          {editVisible ? (
            <Input
              name="login"
              value={itemInfos.login}
              onChange={handleChange}
              id="lablink-login"
            />
          ) : (
            <Input value={link.login} readOnly />
          )}
        </div>
        <div className="lablinks__item-pwd">
          <label htmlFor="lablink-pwd">
            Password
            <CopyIcon ml={5} onClick={handleCopyPwd} />
          </label>
          {editVisible ? (
            <Input
              name="pwd"
              value={itemInfos.pwd}
              onChange={handleChange}
              id="lablink-pwd"
            />
          ) : (
            <Input value={link.pwd.replace(/./g, "*")} readOnly />
          )}
        </div>
      </div>
    </li>
  );
};

export default LabLinkPersonalItem;
