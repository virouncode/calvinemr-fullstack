import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";

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
          <i
            className="fa-regular fa-pen-to-square"
            style={{ marginLeft: "5px" }}
            onClick={handleEditClick}
          ></i>
          <i
            className="fa-solid fa-trash"
            onClick={handleDelete}
            style={{ cursor: "pointer", marginLeft: "5px" }}
          ></i>
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

export default BillingCodesTemplateDisplay;
