import { useState } from "react";
import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useBillingCodeTemplatePost } from "../../../../hooks/reactquery/mutations/billingCodesTemplatesMutations";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../utils/strings/firstLetterUpper";
import { removeLastLetter } from "../../../../utils/strings/removeLastLetter";

const BillingCodesTemplateForm = ({
  errMsgPost,
  setErrMsgPost,
  setNewTemplateVisible,
}) => {
  const { user } = useUserContext();
  const userType = user.access_level;
  const [formDatas, setFormDatas] = useState({
    name: "",
    author_id: user.id,
    billing_codes: [],
  });
  const billingCodeTemplatePost = useBillingCodeTemplatePost();

  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "billing_codes") {
      value = value.split(",").map((billing_code) => billing_code.trim());
    }
    setFormDatas({ ...formDatas, [name]: value });
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
    const billingCodeTemplateToPost = {
      ...formDatas,
      name: firstLetterOfFirstWordUpper(formDatas.name),
      date_created: nowTZTimestamp(),
      billing_codes: formDatas.billing_codes.map((billing_code) =>
        billing_code.toUpperCase()
      ),
    };
    billingCodeTemplatePost.mutate(billingCodeTemplateToPost, {
      onSuccess: () => setNewTemplateVisible(false),
    });
  };
  const handleCancel = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    setNewTemplateVisible(false);
  };

  return (
    <li
      className="billing-codes__templates-list-item billing-codes__templates-list-item--edit"
      style={{ border: errMsgPost && "solid 1px red" }}
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
  );
};

export default BillingCodesTemplateForm;
