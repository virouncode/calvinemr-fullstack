import { useState } from "react";

import React from "react";
import { useLinkDelete } from "../../../hooks/reactquery/mutations/linksMutations";
import { LinkType } from "../../../types/api";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import PenIcon from "../../UI/Icons/PenIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";
import ReferenceLinkEdit from "./ReferenceLinkEdit";

type MyLinkItemProps = {
  link: LinkType;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  lastItemRef?: (node: Element | null) => void;
};

const ReferenceLinkItem = ({
  link,
  setAddVisible,
  lastItemRef,
}: MyLinkItemProps) => {
  const [editVisible, setEditVisible] = useState(false);
  const linkDelete = useLinkDelete(link.staff_id);

  const handleEdit = () => {
    setEditVisible((v) => !v);
  };
  const handleRemoveLink = async () => {
    if (
      await confirmAlert({ content: "Do you reall want to remove this link ?" })
    ) {
      linkDelete.mutate(link.id, {
        onSuccess: () => {
          setAddVisible(false);
        },
      });
    }
  };

  return (
    <li key={link.name} ref={lastItemRef}>
      <a href={link.url} target="_blank" rel="noreferrer">
        {link.name}
      </a>
      <PenIcon ml={5} onClick={handleEdit} />
      <TrashIcon ml={5} onClick={handleRemoveLink}></TrashIcon>
      {editVisible && (
        <ReferenceLinkEdit link={link} setEditVisible={setEditVisible} />
      )}
    </li>
  );
};

export default ReferenceLinkItem;
