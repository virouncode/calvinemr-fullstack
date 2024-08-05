import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Input from "../../../UI/Inputs/Input";

const BillingCodesTemplateEdit = ({
  formDatas,
  handleChange,
  lastItemRef,
  handleSave,
  handleCancel,
  errMsgPost,
}) => {
  return (
    <li
      className="billing-codes__templates-list-item billing-codes__templates-list-item--edit"
      style={{ border: errMsgPost && "solid 1px red" }}
      ref={lastItemRef}
    >
      <Input
        value={formDatas.name}
        onChange={handleChange}
        name="name"
        id="template-billing-name"
        label="Name"
        autoFocus={true}
      />
      <Input
        placeholder="A001,B423,F404,..."
        value={
          formDatas.billing_codes.length > 0
            ? formDatas.billing_codes.join(",")
            : ""
        }
        onChange={handleChange}
        name="billing_codes"
        id="template-billing-code"
        label="Billing code(s)"
      />
      <SaveButton onClick={handleSave} />
      <CancelButton onClick={handleCancel} />
    </li>
  );
};

export default BillingCodesTemplateEdit;
