import { useEffect, useState } from "react";

import React from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useLinkPut } from "../../../hooks/reactquery/mutations/linksMutations";
import { LinkType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { linkSchema } from "../../../validation/reference/linkValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SubmitButton from "../../UI/Buttons/SubmitButton";
import Input from "../../UI/Inputs/Input";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";

type LinkEditProps = {
  link: LinkType;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ReferenceLinkEdit = ({ link, setEditVisible }: LinkEditProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [errMsg, setErrMsg] = useState("");
  const [editedLink, setEditedLink] = useState<LinkType>(link);
  const [progress, setProgress] = useState(false);
  const linkPut = useLinkPut(link.staff_id);

  useEffect(() => {
    setEditedLink(link);
  }, [link]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Validation
    try {
      await linkSchema.validate(editedLink);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    let urlFormatted = editedLink.url;
    if (!editedLink.url.includes("http") || !editedLink.url.includes("https")) {
      urlFormatted = ["https://", editedLink.url].join("");
    }
    const linkToPut: LinkType = {
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
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <div className="reference-links__form-row">
        <Input
          label="Name"
          value={editedLink.name}
          id="name"
          onChange={handleChange}
          autoFocus
        />
      </div>
      <div className="reference-links__form-row">
        <Input
          label="URL"
          value={editedLink.url}
          id="url"
          onChange={handleChange}
        />
      </div>
      <div className="reference-links__form-btns">
        <SubmitButton label="Save" disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </form>
  );
};

export default ReferenceLinkEdit;
