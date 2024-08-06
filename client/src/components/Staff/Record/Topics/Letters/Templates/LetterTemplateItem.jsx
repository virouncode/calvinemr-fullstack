import { useState } from "react";
import useStaffInfosContext from "../../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import {
  useLettersTemplateDelete,
  useLettersTemplatePost,
} from "../../../../../../hooks/reactquery/mutations/lettersTemplatesMutations";
import { nowTZTimestamp } from "../../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import LetterTemplateEdit from "./LetterTemplateEdit";

const LetterTemplateItem = ({
  template,
  handleSelectTemplate,
  lastItemRef = null,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [editTemplateVisible, setEditTemplateVisible] = useState(false);
  const letterTemplatePost = useLettersTemplatePost();
  const letterTemplateDelete = useLettersTemplateDelete();

  const handleEditClick = (e) => {
    e.preventDefault();
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

  const handleDuplicate = async (e, template) => {
    const letterTemplateToPost = {
      ...template,
      author_id: user.id,
      date_created: nowTZTimestamp(),
    };
    letterTemplatePost.mutate(letterTemplateToPost);
  };

  return (
    <>
      <li
        className="letters__templates-list-item"
        key={template.id}
        ref={lastItemRef}
      >
        <span onClick={(e) => handleSelectTemplate(e, template)}>
          {template.name}{" "}
          {template.author_id
            ? `(
          ${staffIdToTitleAndName(staffInfos, template.author_id)})`
            : ""}
        </span>
        <>
          {template.author_id === user.id && (
            <i
              className="fa-regular fa-pen-to-square"
              style={{ cursor: "pointer", marginLeft: "5px" }}
              onClick={handleEditClick}
            ></i>
          )}
          {template.author_id === user.id && (
            <i
              className="fa-solid fa-trash"
              onClick={handleDelete}
              style={{ cursor: "pointer", marginLeft: "5px" }}
            ></i>
          )}
          <i
            className="fa-solid fa-clone"
            onClick={(e) => handleDuplicate(e, template)}
            style={{ cursor: "pointer", marginLeft: "5px" }}
          ></i>
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
