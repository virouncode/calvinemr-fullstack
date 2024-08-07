import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useCalvinAITemplateDelete,
  useCalvinAITemplatePost,
} from "../../../hooks/reactquery/mutations/calvinaiTemplatesMutations";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import CloneIcon from "../../UI/Icons/CloneIcon";
import PenIcon from "../../UI/Icons/PenIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";

const CalvinAITemplateItem = ({
  template,
  handleSelectTemplate,
  handleEdit,
  lastItemRef = null,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();

  const templateDelete = useCalvinAITemplateDelete();
  const templatePost = useCalvinAITemplatePost();

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
    <li className="calvinai__templates-list-item" ref={lastItemRef}>
      <span onClick={(e) => handleSelectTemplate(e, template)}>
        {template.name}{" "}
        {template.author_id
          ? `(${staffIdToTitleAndName(staffInfos, template.author_id)})`
          : ""}
      </span>
      {user.id === template.author_id && (
        <>
          <PenIcon ml={5} onClick={(e) => handleEdit(e, template.id)} />
          <TrashIcon ml={5} onClick={handleDelete} />
        </>
      )}
      <CloneIcon onClick={(e) => handleDuplicate(e, template)} ml={5} />
    </li>
  );
};

export default CalvinAITemplateItem;
