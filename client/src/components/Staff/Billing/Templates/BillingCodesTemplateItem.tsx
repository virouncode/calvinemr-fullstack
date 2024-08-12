import React, { useState } from "react";
import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  useBillingCodeTemplateDelete,
  useBillingCodeTemplatePost,
  useBillingCodeTemplatePut,
} from "../../../../hooks/reactquery/mutations/billingCodesTemplatesMutations";
import { AdminType, BillingCodeTemplateType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { removeLastLetter } from "../../../../utils/strings/removeLastLetter";
import { confirmAlert } from "../../../UI/Confirm/ConfirmGlobal";
import BillingCodesTemplateDisplay from "./BillingCodesTemplateDisplay";
import BillingCodesTemplateEdit from "./BillingCodesTemplateEdit";

type BillingCodesTemplateItemProps = {
  template: BillingCodeTemplateType;
  handleSelectTemplate: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    billing_codes: string[]
  ) => void;
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  lastItemRef?: (node: Element | null) => void;
};

const BillingCodesTemplateItem = ({
  template,
  handleSelectTemplate,
  errMsgPost,
  setErrMsgPost,
  lastItemRef,
}: BillingCodesTemplateItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType | AdminType };
  const userType = user.access_level;
  const [editVisible, setEditVisible] = useState(false);
  const [formDatas, setFormDatas] = useState(template);
  const billingCodeTemplatePost = useBillingCodeTemplatePost();
  const billingCodeTemplatePut = useBillingCodeTemplatePut();
  const billingCodeTemplateDelete = useBillingCodeTemplateDelete();

  const handleEditClick = () => {
    setErrMsgPost("");
    setEditVisible(true);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    let value: string | string[] = e.target.value;
    const name = e.target.name;
    if (name === "billing_codes") {
      value = value.split(",").map((billing_code) => billing_code.trim());
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleDuplicate = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    template: BillingCodeTemplateType
  ) => {
    setErrMsgPost("");
    const billingCodeTemplateToToPost: BillingCodeTemplateType = {
      ...template,
      author_id: user.id as number,
      date_created: nowTZTimestamp(),
    };
    billingCodeTemplatePost.mutate(billingCodeTemplateToToPost);
  };

  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setErrMsgPost("");
    if (!formDatas.billing_codes.join(",") || !formDatas.name) {
      setErrMsgPost("All fields are required");
      return;
    }
    for (let billing_code of formDatas.billing_codes) {
      billing_code = removeLastLetter(billing_code.toUpperCase());
      const response = await xanoGet("/ohip_fee_schedule_for_code", userType, {
        billing_code,
      });
      if (!response) {
        setErrMsgPost(`Billing code ${billing_code} doesn't exist`);
        return;
      }
    }
    const billingCodeTemplateToPut: BillingCodeTemplateType = {
      ...formDatas,
      date_created: nowTZTimestamp(),
    };
    billingCodeTemplatePut.mutate(billingCodeTemplateToPut, {
      onSuccess: () => setEditVisible(false),
    });
  };
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setErrMsgPost("");
    setFormDatas(template);
    setEditVisible(false);
  };

  const handleDelete = async () => {
    setErrMsgPost("");
    if (
      await confirmAlert({
        content: "Do you really want to remove this template ?",
      })
    ) {
      billingCodeTemplateDelete.mutate(template.id as number);
    }
  };
  return editVisible ? (
    <BillingCodesTemplateEdit
      formDatas={formDatas}
      handleChange={handleChange}
      lastItemRef={lastItemRef}
      handleSave={handleSave}
      handleCancel={handleCancel}
      errMsgPost={errMsgPost}
    />
  ) : (
    <BillingCodesTemplateDisplay
      lastItemRef={lastItemRef}
      handleSelectTemplate={handleSelectTemplate}
      template={template}
      handleEditClick={handleEditClick}
      handleDelete={handleDelete}
      handleDuplicate={handleDuplicate}
    />
  );
};

export default BillingCodesTemplateItem;
