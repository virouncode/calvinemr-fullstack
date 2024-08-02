import { useState } from "react";

import useUserContext from "../../../hooks/context/useUserContext";
import { useLinkPut } from "../../../hooks/reactquery/mutations/linksMutations";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { linkSchema } from "../../../validation/reference/linkValidation";

const LinkEdit = ({ link, setEditVisible }) => {
  const { user } = useUserContext();
  const [errMsg, setErrMsg] = useState("");
  const [editedLink, setEditedLink] = useState(link);
  const [progress, setProgress] = useState(false);
  const linkPut = useLinkPut(link.staff_id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await linkSchema.validate(editedLink);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    let urlFormatted = editedLink.url;
    if (!editedLink.url.includes("http") || !editedLink.url.includes("https")) {
      urlFormatted = ["https://", editedLink.url].join("");
    }
    const linkToPut = {
      ...editedLink,
      url: urlFormatted,
      updates: [
        ...link.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    setProgress(true);
    linkPut.mutate(linkToPut, {
      onSuccess: () => {
        setEditVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };
  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.id;
    const value = e.target.value;
    setEditedLink({ ...editedLink, [name]: value });
  };
  const handleCancel = () => {
    setEditVisible(false);
  };
  return (
    <form
      className="reference-links__form reference-links__form--edit"
      onSubmit={handleSubmit}
      style={{ border: errMsg && "1px solid red" }}
    >
      {errMsg && <p className="reference-links__form-err">{errMsg}</p>}
      <div className="reference-links__form-row">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          value={editedLink.name}
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
          value={editedLink.url}
          id="url"
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="reference-links__form-btns">
        <input type="submit" value="Save" disabled={progress} />
        <button onClick={handleCancel} disabled={progress}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default LinkEdit;
