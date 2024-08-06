import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useLabLinksCredentialsPost,
  useLabLinksCredentialsPut,
} from "../../../hooks/reactquery/mutations/labLinksMutations";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { copyCredentialToClipboard } from "../../../utils/js/copyToClipboard";
import Input from "../../UI/Inputs/Input";

const LabLinkItem = ({ link, credentials }) => {
  const { user } = useUserContext();
  const [login, setLogin] = useState("");
  const [pwd, setPwd] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const [addCredentialsVisible, setAddCredentialsVisible] = useState(false);
  const loginRef = useRef(null);
  const pwdRef = useRef(null);
  const credentialsPost = useLabLinksCredentialsPost(user.id);
  const credentialsPut = useLabLinksCredentialsPut(user.id);

  useEffect(() => {
    if (credentials) {
      setLogin(credentials.login);
      setPwd(credentials.pwd);
    }
  }, [credentials]);

  const handleChangeLogin = (e) => {
    setLogin(e.target.value);
  };
  const handleChangePwd = (e) => {
    setPwd(e.target.value);
  };
  const handleCopyLogin = async () => {
    try {
      await copyCredentialToClipboard(login);
      toast.success("Copied !", { containerId: "A" });
    } catch (err) {
      toast.error("Unable to copy login", { containerId: "A" });
    }
  };
  const handleCopyPwd = async () => {
    try {
      await copyCredentialToClipboard(pwd);
      toast.success("Copied !", { containerId: "A" });
    } catch (err) {
      toast.error("Unable to copy password", { containerId: "A" });
    }
  };
  const handleClickEdit = () => {
    setEditVisible(true);
  };
  const handleClickSave = async () => {
    const linkCredentialsToPut = {
      id: credentials.id,
      date_created: nowTZTimestamp(),
      staff_id: user.id,
      lablink_id: link.id,
      login,
      pwd,
    };
    credentialsPut.mutate(linkCredentialsToPut, {
      onSuccess: () => {
        setEditVisible(false);
      },
    });
  };
  const handleCancel = () => {
    setEditVisible(false);
  };
  const handleCancelNew = () => {
    setAddCredentialsVisible(false);
  };
  const handleClickSaveNew = async () => {
    const linkCredentialsToPost = {
      date_created: nowTZTimestamp(),
      staff_id: user.id,
      lablink_id: link.id,
      login,
      pwd,
    };
    credentialsPost.mutate(linkCredentialsToPost, {
      onSuccess: () => {
        setAddCredentialsVisible(false);
      },
    });
  };
  return (
    <li className="lablink__item">
      <div className="lablink__item-link">
        <a href={link.url} target="_blank" rel="noreferrer">
          {link.name}
        </a>
        {credentials && !editVisible && (
          <i
            className="fa-regular fa-pen-to-square"
            onClick={handleClickEdit}
          />
        )}
        {credentials && editVisible && (
          <>
            <i
              className="fa-solid fa-floppy-disk"
              onClick={handleClickSave}
              style={{ color: "#f53f77" }}
            />
            <i className="fa-solid fa-xmark" onClick={handleCancel} />
          </>
        )}
        {addCredentialsVisible && (
          <>
            <i
              className="fa-solid fa-floppy-disk"
              onClick={handleClickSaveNew}
              style={{ color: "#f53f77" }}
            />
            <i className="fa-solid fa-xmark" onClick={handleCancelNew} />
          </>
        )}
        {!credentials && !addCredentialsVisible && (
          <i
            className="fa-solid fa-plus"
            onClick={() => setAddCredentialsVisible(true)}
          ></i>
        )}
      </div>
      <div className="lablink__item-login">
        <label htmlFor="lablink-login">
          Login{" "}
          {login && (
            <i className="fa-solid fa-copy" onClick={handleCopyLogin} />
          )}
        </label>
        {editVisible || addCredentialsVisible ? (
          <Input
            value={login}
            onChange={handleChangeLogin}
            ref={loginRef}
            id="lablink-login"
          />
        ) : (
          <Input value={login} readOnly ref={loginRef} />
        )}
      </div>
      <div className="lablink__item-pwd">
        <label htmlFor="lablink-pwd">
          Password
          {pwd && <i className="fa-solid fa-copy" onClick={handleCopyPwd} />}
        </label>
        {editVisible || addCredentialsVisible ? (
          <Input
            value={pwd}
            onChange={handleChangePwd}
            ref={pwdRef}
            id="lablink-pwd"
          />
        ) : (
          <Input value={pwd.replace(/./g, "*")} readOnly ref={pwdRef} />
        )}
      </div>
    </li>
  );
};

export default LabLinkItem;
