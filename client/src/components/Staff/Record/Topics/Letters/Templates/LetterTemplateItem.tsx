import React, { useState } from "react";
import useStaffInfosContext from "../../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import {
  useLettersTemplateDelete,
  useLettersTemplatePost,
} from "../../../../../../hooks/reactquery/mutations/lettersTemplatesMutations";
import { LetterTemplateType } from "../../../../../../types/api";
import { UserStaffType } from "../../../../../../types/app";
import { nowTZTimestamp } from "../../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../../../UI/Confirm/ConfirmGlobal";
import CloneIcon from "../../../../../UI/Icons/CloneIcon";
import PenIcon from "../../../../../UI/Icons/PenIcon";
import TrashIcon from "../../../../../UI/Icons/TrashIcon";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import LetterTemplateEdit from "./LetterTemplateEdit";

type LetterTemplateItemProps = {
  template: LetterTemplateType;
  handleSelectTemplate: (template: LetterTemplateType) => void;
  lastItemRef?: (node: Element | null) => void;
};

const LetterTemplateItem = ({
  template,
  handleSelectTemplate,
  lastItemRef,
}: LetterTemplateItemProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [editTemplateVisible, setEditTemplateVisible] = useState(false);
  //Queries
  const letterTemplatePost = useLettersTemplatePost();
  const letterTemplateDelete = useLettersTemplateDelete();

  const handleEditClick = () => {
    setEditTemplateVisible(true);
  };

  const handleDelete = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this template ?",
      })
    ) {
      letterTemplateDelete.mutate(template.id);
    }
  };

  const handleDuplicate = async (template: LetterTemplateType) => {
    const letterTemplateToPost = {
      ...template,
      author_id: user.id,
      date_created: nowTZTimestamp(),
    };
    letterTemplatePost.mutate(letterTemplateToPost);
  };

  return (
    <>
      <li className="templates__list-item" key={template.id} ref={lastItemRef}>
        <span onClick={() => handleSelectTemplate(template)}>
          {template.name}{" "}
          {template.author_id
            ? `(
          ${staffIdToTitleAndName(staffInfos, template.author_id)})`
            : ""}
        </span>
        <>
          <CloneIcon onClick={() => handleDuplicate(template)} ml={10} />
          {template.author_id === user.id && (
            <PenIcon ml={15} onClick={handleEditClick} />
          )}
          {template.author_id === user.id && (
            <TrashIcon onClick={handleDelete} ml={15} />
          )}
        </>
      </li>
      {editTemplateVisible && (
        <FakeWindow
          title="EDIT LETTER TEMPLATE"
          width={800}
          height={630}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 630) / 2}
          color="#848484"
          setPopUpVisible={setEditTemplateVisible}
        >
          <LetterTemplateEdit
            setEditTemplateVisible={setEditTemplateVisible}
            template={template}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default LetterTemplateItem;
