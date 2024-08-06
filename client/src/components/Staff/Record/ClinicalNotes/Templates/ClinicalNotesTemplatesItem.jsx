import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  useClinicalNotesTemplatesDelete,
  useClinicalNotesTemplatesPost,
} from "../../../../../hooks/reactquery/mutations/clinicalNotesTemplatesMutations";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";

const ClinicalNotesTemplatesItem = ({
  template,
  handleSelectTemplate,
  handleEdit,
  lastItemRef = null,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();

  const templateDelete = useClinicalNotesTemplatesDelete();
  const templatePost = useClinicalNotesTemplatesPost();

  const handleDelete = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this template ?",
      })
    ) {
      templateDelete.mutate(template.id);
    }
  };

  const handleDuplicate = async (e, template) => {
    const templateToPost = {
      ...template,
      author_id: user.id,
      date_created: nowTZTimestamp(),
    };
    templatePost.mutate(templateToPost);
  };

  return (
    <li className="clinical-notes__templates-list-item" ref={lastItemRef}>
      <span onClick={(e) => handleSelectTemplate(e, template)}>
        {template.name}{" "}
        {template.author_id
          ? `(
          ${staffIdToTitleAndName(staffInfos, template.author_id)})`
          : ""}
      </span>
      {user.id === template.author_id && (
        <>
          <i
            className="fa-regular fa-pen-to-square"
            style={{ marginLeft: "5px" }}
            onClick={(e) => handleEdit(e, template.id)}
          />
          <i
            className="fa-solid fa-trash"
            style={{ marginLeft: "5px" }}
            onClick={handleDelete}
          />
        </>
      )}
      <i
        className="fa-solid fa-clone"
        onClick={(e) => handleDuplicate(e, template)}
        style={{ cursor: "pointer", marginLeft: "5px" }}
      />
    </li>
  );
};

export default ClinicalNotesTemplatesItem;
