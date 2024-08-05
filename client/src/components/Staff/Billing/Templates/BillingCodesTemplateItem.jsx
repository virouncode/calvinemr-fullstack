import { useState } from "react";
import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  useBillingCodeTemplateDelete,
  useBillingCodeTemplatePost,
  useBillingCodeTemplatePut,
} from "../../../../hooks/reactquery/mutations/billingCodesTemplatesMutations";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { removeLastLetter } from "../../../../utils/strings/removeLastLetter";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";
import BillingCodesTemplateDisplay from "./BillingCodesTemplateDisplay";
import BillingCodesTemplateEdit from "./BillingCodesTemplateEdit";

const BillingCodesTemplateItem = ({
  template,
  handleSelectTemplate,
  errMsgPost,
  setErrMsgPost,
  lastItemRef = null,
}) => {
  const { user } = useUserContext();
  const userType = user.access_level;
  const [editVisible, setEditVisible] = useState(false);
  const [formDatas, setFormDatas] = useState(template);
  const billingCodeTemplatePost = useBillingCodeTemplatePost();
  const billingCodeTemplatePut = useBillingCodeTemplatePut();
  const billingCodeTemplateDelete = useBillingCodeTemplateDelete();

  const handleEditClick = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    setEditVisible(true);
  };
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "billing_codes") {
      value = value.split(",").map((billing_code) => billing_code.trim());
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleDuplicate = async (e, template) => {
    setErrMsgPost("");
    const billingCodeTemplateToToPost = {
      ...template,
      author_id: user.id,
      date_created: nowTZTimestamp(),
    };
    billingCodeTemplatePost.mutate(billingCodeTemplateToToPost);
  };

  const handleSave = async (e) => {
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
    const billingCodeTemplateToPut = {
      ...formDatas,
      date_created: nowTZTimestamp(),
    };
    billingCodeTemplatePut.mutate(billingCodeTemplateToPut, {
      onSuccess: () => setEditVisible(false),
    });
  };
  const handleCancel = (e) => {
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
      billingCodeTemplateDelete.mutate(template.id);
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
