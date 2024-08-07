import { useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useLabLinksPersonalDelete,
  useLabLinksPersonalPut,
} from "../../../hooks/reactquery/mutations/labLinksMutations";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { copyCredentialToClipboard } from "../../../utils/js/copyToClipboard";
import { lablinkSchema } from "../../../validation/lablinks/lablinkValidation";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import CopyIcon from "../../UI/Icons/CopyIcon";
import PenIcon from "../../UI/Icons/PenIcon";
import SaveIcon from "../../UI/Icons/SaveIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";
import XmarkIcon from "../../UI/Icons/XmarkIcon";
import Input from "../../UI/Inputs/Input";

const LabLinkPersonalItem = ({ link, setErrMsgPost }) => {
  const { user } = useUserContext();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(link);
  const labLinkPersonalPut = useLabLinksPersonalPut(user.id);
  const labLinkPersonalDelete = useLabLinksPersonalDelete(user.id);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setErrMsgPost("");
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleCopyLogin = async () => {
    try {
      await copyCredentialToClipboard(link.login);
      toast.success("Copied !", { containerId: "A" });
    } catch (err) {
      toast.error("Unable to copy login", { containerId: "A" });
    }
  };
  const handleCopyPwd = async () => {
    try {
      await copyCredentialToClipboard(link.pwd);
      toast.success("Copied !", { containerId: "A" });
    } catch (err) {
      toast.error("Unable to copy password", { containerId: "A" });
    }
  };
  const handleClickEdit = () => {
    setErrMsgPost("");
    setItemInfos(link);
    setEditVisible(true);
  };
  const handleClickSave = async () => {
    const labLinkPersonalToPut = {
      ...itemInfos,
      updates: itemInfos.updates.length
        ? itemInfos.updates.push({
            date_updated: nowTZTimestamp(),
            updated_by_id: user.id,
          })
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
      setErrMsgPost(err.message);
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
    <li className="lablink__item">
      <div
        className="lablink__item-link"
        style={{ textDecoration: editVisible && "none" }}
      >
        {editVisible ? (
          <div style={{ display: "flex" }}>
            <div
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                marginRight: "20px",
              }}
            >
              <Input
                label="Name"
                name="name"
                value={itemInfos.name}
                onChange={handleChange}
                id="lablink-name"
              />
            </div>
            <div
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Input
                label="URL"
                name="url"
                value={itemInfos.url}
                onChange={handleChange}
                id="lablink-url"
              />
            </div>
          </div>
        ) : (
          <a href={link.url} target="_blank" rel="noreferrer">
            {link.name}
          </a>
        )}

        {!editVisible && (
          <>
            <PenIcon onClick={handleClickEdit} />
            <TrashIcon onClick={handleDelete} />
          </>
        )}
        {editVisible && (
          <>
            <SaveIcon onClick={handleClickSave} color="#f53f77" />
            <XmarkIcon onClick={handleCancel} />
          </>
        )}
      </div>
      <div className="lablink__item-login">
        <label htmlFor="lablink-login">
          Login <CopyIcon onClick={handleCopyLogin} />
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
      <div className="lablink__item-pwd">
        <label htmlFor="lablink-pwd">
          Password
          <CopyIcon onClick={handleCopyPwd} />
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
    </li>
  );
};

export default LabLinkPersonalItem;
