import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useLabLinksCredentialsPost,
  useLabLinksCredentialsPut,
} from "../../../hooks/reactquery/mutations/labLinksMutations";
import { LabLinkCredentialsType, LabLinkType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { copyCredentialToClipboard } from "../../../utils/js/copyToClipboard";
import CopyIcon from "../../UI/Icons/CopyIcon";
import PenIcon from "../../UI/Icons/PenIcon";
import SaveIcon from "../../UI/Icons/SaveIcon";
import SquarePlusIcon from "../../UI/Icons/SquarePlusIcon";
import XmarkIcon from "../../UI/Icons/XmarkIcon";
import Input from "../../UI/Inputs/Input";

type LabLinkItemProps = {
  link: LabLinkType;
  credentials: LabLinkCredentialsType;
};

const LabLinkItem = ({ link, credentials }: LabLinkItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [login, setLogin] = useState("");
  const [pwd, setPwd] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const [addCredentialsVisible, setAddCredentialsVisible] = useState(false);
  const loginRef = useRef<HTMLInputElement | null>(null);
  const pwdRef = useRef<HTMLInputElement | null>(null);
  const credentialsPost = useLabLinksCredentialsPost(user.id);
  const credentialsPut = useLabLinksCredentialsPut(user.id);

  useEffect(() => {
    if (credentials) {
      setLogin(credentials.login);
      setPwd(credentials.pwd);
    }
  }, [credentials]);

  const handleChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };
  const handleChangePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwd(e.target.value);
  };
  const handleCopyLogin = async () => {
    try {
      await copyCredentialToClipboard(login);
      toast.success("Copied !", { containerId: "A" });
    } catch {
      toast.error("Unable to copy login", { containerId: "A" });
    }
  };
  const handleCopyPwd = async () => {
    try {
      await copyCredentialToClipboard(pwd);
      toast.success("Copied !", { containerId: "A" });
    } catch {
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
    const linkCredentialsToPost: Partial<LabLinkCredentialsType> = {
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
    <li className="lablinks__item">
      <div className="lablinks__item-link">
        <a href={link.url} target="_blank" rel="noreferrer">
          {link.name}
        </a>
        {credentials && !editVisible && (
          <PenIcon onClick={handleClickEdit} ml={5} />
        )}
        {credentials && editVisible && (
          <>
            <SaveIcon onClick={handleClickSave} color="#f53f77" ml={5} />
            <XmarkIcon onClick={handleCancel} ml={15} />
          </>
        )}
        {addCredentialsVisible && (
          <>
            <SaveIcon onClick={handleClickSaveNew} color="#f53f77" ml={5} />
            <XmarkIcon onClick={handleCancelNew} ml={15} />
          </>
        )}
        {!credentials && !addCredentialsVisible && (
          <SquarePlusIcon
            onClick={() => setAddCredentialsVisible(true)}
            ml={5}
          />
        )}
      </div>
      <div className="lablinks__item-credentials">
        <div className="lablinks__item-login">
          <label htmlFor="lablink-login">
            Login {login && <CopyIcon onClick={handleCopyLogin} ml={5} />}
          </label>
          {editVisible || addCredentialsVisible ? (
            <Input
              value={login}
              onChange={handleChangeLogin}
              inputRef={loginRef}
              id="lablink-login"
            />
          ) : (
            <Input value={login} readOnly inputRef={loginRef} />
          )}
        </div>
        <div className="lablinks__item-pwd">
          <label htmlFor="lablink-pwd">
            Password
            {pwd && <CopyIcon onClick={handleCopyPwd} ml={5} />}
          </label>
          {editVisible || addCredentialsVisible ? (
            <Input
              value={pwd}
              onChange={handleChangePwd}
              inputRef={pwdRef}
              id="lablink-pwd"
            />
          ) : (
            <Input value={pwd.replace(/./g, "*")} readOnly inputRef={pwdRef} />
          )}
        </div>
      </div>
    </li>
  );
};

export default LabLinkItem;
