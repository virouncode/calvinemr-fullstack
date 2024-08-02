import { useRef, useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useLabLinksPersonalDelete,
  useLabLinksPersonalPut,
} from "../../../hooks/reactquery/mutations/labLinksMutations";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { copyCredentialToClipboard } from "../../../utils/js/copyToClipboard";
import { lablinkSchema } from "../../../validation/lablinks/lablinkValidation";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";

const LabLinkPersonalItem = ({ link, errMsgPost, setErrMsgPost }) => {
  const { user } = useUserContext();
  const [editVisible, setEditVisible] = useState(false);
  const loginRef = useRef(null);
  const pwdRef = useRef(null);
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
              <label htmlFor="lablink-name">Name</label>
              <input
                type="text"
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
              <label htmlFor="lablink-url">URL</label>
              <input
                type="text"
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
            <i class="fa-solid fa-pen-to-square" onClick={handleClickEdit} />
            <i class="fa-solid fa-trash" onClick={handleDelete} />
          </>
        )}
        {editVisible && (
          <>
            <i
              class="fa-solid fa-floppy-disk"
              onClick={handleClickSave}
              style={{ color: "#f53f77" }}
            />
            <i class="fa-solid fa-xmark" onClick={handleCancel} />
          </>
        )}
      </div>
      <div className="lablink__item-login">
        <label htmlFor="lablink-login">
          Login <i className="fa-solid fa-copy" onClick={handleCopyLogin}></i>
        </label>
        {editVisible ? (
          <input
            type="text"
            name="login"
            value={itemInfos.login}
            onChange={handleChange}
            ref={loginRef}
            id="lablink-login"
          />
        ) : (
          <input type="text" value={link.login} readOnly ref={loginRef} />
        )}
      </div>
      <div className="lablink__item-pwd">
        <label htmlFor="lablink-pwd">
          Password
          <i className="fa-solid fa-copy" onClick={handleCopyPwd}></i>
        </label>
        {editVisible ? (
          <input
            type="text"
            name="pwd"
            value={itemInfos.pwd}
            onChange={handleChange}
            ref={pwdRef}
            id="lablink-pwd"
          />
        ) : (
          <input
            type="text"
            value={link.pwd.replace(/./g, "*")}
            readOnly
            ref={pwdRef}
          />
        )}
      </div>
    </li>
  );
};

export default LabLinkPersonalItem;
