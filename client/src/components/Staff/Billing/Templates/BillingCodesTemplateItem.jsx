import { useState } from "react";
import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
    useBillingCodeTemplateDelete,
    useBillingCodeTemplatePost,
    useBillingCodeTemplatePut,
} from "../../../../hooks/reactquery/mutations/billingCodesTemplatesMutations";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { removeLastLetter } from "../../../../utils/strings/removeLastLetter";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";

const BillingCodesTemplateItem = ({
  template,
  handleSelectTemplate,
  errMsgPost,
  setErrMsgPost,
  lastItemRef = null,
}) => {
  const { user } = useUserContext();
  const userType = user.access_level;
  const { staffInfos } = useStaffInfosContext();
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
    <li
      className="billing-codes__templates-list-item billing-codes__templates-list-item--edit"
      style={{ border: errMsgPost && "solid 1px red" }}
      ref={lastItemRef}
    >
      <label htmlFor="template-billing-name">Name</label>
      <input
        type="text"
        value={formDatas.name}
        onChange={handleChange}
        name="name"
        autoComplete="off"
        autoFocus
        id="template-billing-name"
      />
      <label htmlFor="template-billing-code">Billing code(s)</label>
      <input
        type="text"
        placeholder="A001,B423,F404,..."
        value={
          formDatas.billing_codes.length > 0
            ? formDatas.billing_codes.join(",")
            : ""
        }
        onChange={handleChange}
        name="billing_codes"
        autoComplete="off"
        id="template-billing-code"
      />
      <button onClick={handleSave} className="save-btn">
        Save
      </button>
      <button onClick={handleCancel}>Cancel</button>
    </li>
  ) : (
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
            className="fa-solid fa-pen-to-square"
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

export default BillingCodesTemplateItem;
