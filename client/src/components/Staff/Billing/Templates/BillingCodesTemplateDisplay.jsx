import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import CloneIcon from "../../../UI/Icons/CloneIcon";
import PenIcon from "../../../UI/Icons/PenIcon";
import TrashIcon from "../../../UI/Icons/TrashIcon";

const BillingCodesTemplateDisplay = ({
  lastItemRef,
  handleSelectTemplate,
  template,
  handleEditClick,
  handleDelete,
  handleDuplicate,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  return (
    <li className="billing-codes__templates-list-item" ref={lastItemRef}>
      <span onClick={(e) => handleSelectTemplate(e, template.billing_codes)}>
        {template.name} : {template.billing_codes.join(", ")}{" "}
        {template.author_id
          ? `(
          ${staffIdToTitleAndName(staffInfos, template.author_id)})`
          : ""}
      </span>
      {user.id === template.author_id && (
        <>
          <PenIcon ml={5} onClick={handleEditClick}></PenIcon>
          <TrashIcon ml={5} onClick={handleDelete} />
        </>
      )}
      <CloneIcon onClick={(e) => handleDuplicate(e, template)} ml={5} />
    </li>
  );
};

export default BillingCodesTemplateDisplay;
