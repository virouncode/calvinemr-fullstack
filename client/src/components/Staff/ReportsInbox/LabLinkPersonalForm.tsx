import React, { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useLabLinksPersonalPost } from "../../../hooks/reactquery/mutations/labLinksMutations";
import { LabLinkPersonalType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { lablinkSchema } from "../../../validation/lablinks/lablinkValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Input from "../../UI/Inputs/Input";

type LabLinkPersonalFormProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
};

const LabLinkPersonalForm = ({
  setAddVisible,
  errMsgPost,
  setErrMsgPost,
}: LabLinkPersonalFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [name, setName] = useState("");
  const [url, setURL] = useState("");
  const [pwd, setPwd] = useState("");
  const [login, setLogin] = useState("");
  const labLinkPersonalPost = useLabLinksPersonalPost(user.id);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setErrMsgPost("");
  };
  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setURL(e.target.value);
    setErrMsgPost("");
  };
  const handleCancel = () => {
    setAddVisible(false);
    setErrMsgPost("");
  };
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setErrMsgPost("");
    setLogin(value);
  };
  const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setErrMsgPost("");
    setPwd(value);
  };
  const handleSave = async () => {
    let urlFormatted = url;
    if (!url.includes("http") || !url.includes("https")) {
      urlFormatted = ["https://", url].join("");
    }
    const labLinkPersonalToPost: Partial<LabLinkPersonalType> = {
      staff_id: user.id,
      name,
      url: urlFormatted,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
      login,
      pwd,
    };
    //Validation
    try {
      await lablinkSchema.validate(labLinkPersonalToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    labLinkPersonalPost.mutate(labLinkPersonalToPost, {
      onSuccess: () => {
        setAddVisible(false);
        setErrMsgPost("");
      },
    });
  };
  return (
    <div
      className="lablinks__form"
      style={{ border: errMsgPost && "solid 1px red" }}
    >
      <div className="lablinks__form-inputs">
        <div className="lablinks__form-row">
          <div className="lablinks__form-item">
            <Input
              label="Name"
              value={name}
              onChange={handleNameChange}
              id="lablink-name"
            />
          </div>
          <div className="lablinks__form-item">
            <Input
              label="URL"
              value={url}
              onChange={handleURLChange}
              id="lablink-url"
            />
          </div>
        </div>
        <div className="lablinks__form-row">
          <div className="lablinks__form-item">
            <Input
              label="Login"
              value={login}
              onChange={handleLoginChange}
              id="lablink-login"
            />
          </div>
          <div className="lablinks__form-item">
            <Input
              label="Password"
              value={pwd}
              onChange={handlePwdChange}
              id="lablink-pwd"
            />
          </div>
        </div>
      </div>
      <div className="lablinks__form-btns">
        <SaveButton onClick={handleSave} />
        <CancelButton onClick={handleCancel} />
      </div>
    </div>
  );
};

export default LabLinkPersonalForm;
