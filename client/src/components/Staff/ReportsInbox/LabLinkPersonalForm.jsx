import { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useLabLinksPersonalPost } from "../../../hooks/reactquery/mutations/labLinksMutations";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { lablinkSchema } from "../../../validation/lablinks/lablinkValidation";

const LabLinkPersonalForm = ({ setAddVisible, errMsgPost, setErrMsgPost }) => {
  const { user } = useUserContext();
  const [name, setName] = useState("");
  const [url, setURL] = useState("");
  const [pwd, setPwd] = useState("");
  const [login, setLogin] = useState("");
  const labLinkPersonalPost = useLabLinksPersonalPost(user.id);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setErrMsgPost("");
  };
  const handleURLChange = (e) => {
    setURL(e.target.value);
    setErrMsgPost("");
  };
  const handleCancel = () => {
    setAddVisible(false);
    setErrMsgPost("");
  };
  const handleLoginChange = (e) => {
    const value = e.target.value;
    setErrMsgPost("");
    setLogin(value);
  };
  const handlePwdChange = (e) => {
    const value = e.target.value;
    setErrMsgPost("");
    setPwd(value);
  };
  const handleSave = async () => {
    let urlFormatted = url;
    if (!url.includes("http") || !url.includes("https")) {
      urlFormatted = ["https://", url].join("");
    }
    const labLinkPersonalToPost = {
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
      setErrMsgPost(err.message);
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
            <label htmlFor="lablink-name">Name</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              id="lablink-name"
            />
          </div>
          <div className="lablinks__form-item">
            <label htmlFor="lablink-url">URL</label>
            <input
              type="text"
              value={url}
              onChange={handleURLChange}
              id="lablink-url"
            />
          </div>
        </div>
        <div className="lablinks__form-row">
          <div className="lablinks__form-item">
            <label htmlFor="lablink-login">Login</label>
            <input
              type="text"
              value={login}
              onChange={handleLoginChange}
              id="lablink-login"
            />
          </div>
          <div className="lablinks__form-item">
            <label htmlFor="lablink-pwd">Password</label>
            <input
              type="text"
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
