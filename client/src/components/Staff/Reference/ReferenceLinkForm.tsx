import { useState } from "react";

import React from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useLinkPost } from "../../../hooks/reactquery/mutations/linksMutations";
import { LinkFormType, LinkType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { linkSchema } from "../../../validation/reference/linkValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SubmitButton from "../../UI/Buttons/SubmitButton";
import Input from "../../UI/Inputs/Input";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";

type LinkFormProps = {
  links: LinkType[];
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ReferenceLinkForm = ({ links, setAddVisible }: LinkFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [newLink, setNewLink] = useState<LinkFormType>({
    staff_id: user.id,
    name: "",
    url: "",
    date_created: nowTZTimestamp(),
    created_by_id: user.id,
  });
  const [errMsg, setErrMsg] = useState("");
  const [progress, setProgress] = useState(false);
  const linkPost = useLinkPost(user.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;
    setNewLink({ ...newLink, [id]: value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Validation
    try {
      await linkSchema.validate(newLink);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    if (links.find(({ name }) => name === newLink.name)) {
      setErrMsg("You already have a link with this name");
      return;
    }
    let urlFormatted: string = newLink.url;
    if (!newLink.url?.includes("http") || !newLink.url?.includes("https")) {
      urlFormatted = ["https://", newLink.url].join("");
    }
    const linkToPost: LinkFormType = {
      ...newLink,
      url: urlFormatted,
      date_created: nowTZTimestamp(),
    };
    setProgress(true);

    linkPost.mutate(linkToPost, {
      onSuccess: () => {
        setAddVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };
  const handleCancel = () => {
    setAddVisible(false);
  };
  return (
    <form
      className="reference__links-form"
      onSubmit={handleSubmit}
      style={{ border: errMsg && "solid 1px red" }}
    >
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <div className="reference__links-form-row">
        <Input
          label="Name"
          value={newLink.name}
          id="name"
          onChange={handleChange}
          autoFocus
        />
      </div>
      <div className="reference__links-form-row">
        <Input
          label="URL"
          value={newLink.url}
          id="url"
          onChange={handleChange}
        />
      </div>
      <div className="reference__links-form-btns">
        <SubmitButton label="Save" disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </form>
  );
};

export default ReferenceLinkForm;
