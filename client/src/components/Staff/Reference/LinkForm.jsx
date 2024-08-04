import { useState } from "react";

import useUserContext from "../../../hooks/context/useUserContext";
import { useLinkPost } from "../../../hooks/reactquery/mutations/linksMutations";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { linkSchema } from "../../../validation/reference/linkValidation";

const LinkForm = ({ links, setAddVisible }) => {
  const { user } = useUserContext();
  const [newLink, setNewLink] = useState({
    name: "",
    url: "",
    staff_id: user.id,
    created_by_id: user.id,
  });
  const [errMsg, setErrMsg] = useState("");
  const [progress, setProgress] = useState(false);
  const linkPost = useLinkPost(user.id);

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setNewLink({ ...newLink, [id]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await linkSchema.validate(newLink);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    if (links.find(({ name }) => name === newLink.name)) {
      setErrMsg("You already have a link with this name");
      return;
    }
    let urlFormatted;
    if (!newLink.url.includes("http") || !newLink.url.includes("https")) {
      urlFormatted = ["https://", newLink.url].join("");
    }
    const linkToPost = {
      ...newLink,
      url: urlFormatted,
      date_created: nowTZTimestamp(),
    };
    setProgress(true);

    linkPost.mutate(linkToPost, {
      onSuccess: () => {
        setAddVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };
  const handleCancel = (e) => {
    setAddVisible(false);
  };
  return (
    <form
      className="reference-links__form"
      onSubmit={handleSubmit}
      style={{ border: errMsg && "solid 1px red" }}
    >
      {errMsg && <p className="reference-links__form-err">{errMsg}</p>}
      <div className="reference-links__form-row">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          value={newLink.name}
          id="name"
          onChange={handleChange}
          autoComplete="off"
          autoFocus
        />
      </div>
      <div className="reference-links__form-row">
        <label htmlFor="url">URL</label>
        <input
          type="text"
          value={newLink.url}
          id="url"
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="reference-links__form-btns">
        <input type="submit" value="Save" disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </form>
  );
};

export default LinkForm;
