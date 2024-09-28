import React from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { AdminType, BillingCodeTemplateType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import CloneIcon from "../../../UI/Icons/CloneIcon";
import PenIcon from "../../../UI/Icons/PenIcon";
import TrashIcon from "../../../UI/Icons/TrashIcon";

type BillingCodesTemplateDisplayProps = {
  lastItemRef?: (node: Element | null) => void;
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
  lastItemRef,
  handleSelectTemplate,
  template,
  handleEditClick,
  handleDelete,
  handleDuplicate,
}: BillingCodesTemplateDisplayProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType | AdminType };
  const { staffInfos } = useStaffInfosContext();

  return (
    <li className="templates__list-item" ref={lastItemRef}>
      <span onClick={(e) => handleSelectTemplate(e, template.billing_codes)}>
        {template.name} : {template.billing_codes.join(", ")}{" "}
        {template.author_id
          ? `(
          ${staffIdToTitleAndName(staffInfos, template.author_id)})`
          : ""}
      </span>
      <CloneIcon onClick={() => handleDuplicate(template)} ml={10} />
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
