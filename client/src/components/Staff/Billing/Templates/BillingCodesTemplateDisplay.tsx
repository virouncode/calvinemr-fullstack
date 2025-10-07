import React from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useBillingCodeTemplatePut } from "../../../../hooks/reactquery/mutations/billingCodesTemplatesMutations";
import { AdminType, BillingCodeTemplateType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import CloneIcon from "../../../UI/Icons/CloneIcon";
import HeartIcon from "../../../UI/Icons/HeartIcon";
import PenIcon from "../../../UI/Icons/PenIcon";
import TrashIcon from "../../../UI/Icons/TrashIcon";

type BillingCodesTemplateDisplayProps = {
  targetRef?: (node: Element | null) => void;
  handleSelectTemplate: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    billing_codes: string[]
  ) => void;
  template: BillingCodeTemplateType;
  handleEditClick: () => void;
  handleDelete: () => void;
  handleDuplicate: (template: BillingCodeTemplateType) => Promise<void>;
};

const BillingCodesTemplateDisplay = ({
  targetRef,
  handleSelectTemplate,
  template,
  handleEditClick,
  handleDelete,
  handleDuplicate,
}: BillingCodesTemplateDisplayProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType | AdminType };
  const { staffInfos } = useStaffInfosContext();
  const templatePut = useBillingCodeTemplatePut();

  const handleLike = async (template: BillingCodeTemplateType) => {
    const templateToPut: BillingCodeTemplateType = {
      ...template,
      favorites_staff_ids:
        user.access_level === "staff"
          ? template.favorites_staff_ids.includes(user.id)
            ? template.favorites_staff_ids.filter((id) => id !== user.id)
            : [...template.favorites_staff_ids, user.id]
          : template.favorites_staff_ids,
      favorites_admin_ids:
        user.access_level === "admin"
          ? template.favorites_admin_ids.includes(user.id)
            ? template.favorites_admin_ids.filter((id) => id !== user.id)
            : [...template.favorites_admin_ids, user.id]
          : template.favorites_admin_ids,
    };
    templatePut.mutate(templateToPut);
  };

  return (
    <li className="templates__list-item" ref={targetRef}>
      <span onClick={(e) => handleSelectTemplate(e, template.billing_codes)}>
        {template.name} : {template.billing_codes.join(", ")}{" "}
        {template.author_id
          ? `(
          ${staffIdToTitleAndName(staffInfos, template.author_id)})`
          : ""}
      </span>
      <CloneIcon onClick={() => handleDuplicate(template)} ml={10} />
      <HeartIcon
        ml={15}
        onClick={() => handleLike(template)}
        active={
          user?.access_level === "staff"
            ? template.favorites_staff_ids.includes(user.id)
            : template.favorites_admin_ids.includes(user.id)
        }
      />
      {user.id === template.author_id && (
        <>
          <PenIcon ml={15} onClick={handleEditClick} />
          <TrashIcon ml={15} onClick={handleDelete} />
        </>
      )}
    </li>
  );
};

export default BillingCodesTemplateDisplay;
