import React, { useState } from "react";
import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useBillingCodeTemplatePost } from "../../../../hooks/reactquery/mutations/billingCodesTemplatesMutations";
import {
  AdminType,
  BillingCodeTemplateFormType,
  BillingCodeTemplateType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../utils/strings/firstLetterUpper";
import { removeLastLetter } from "../../../../utils/strings/removeLastLetter";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import Input from "../../../UI/Inputs/Input";
type BillingCodesTemplateFormProps = {
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  setNewTemplateVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const BillingCodesTemplateForm = ({
  errMsgPost,
  setErrMsgPost,
  setNewTemplateVisible,
}: BillingCodesTemplateFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType | AdminType };
  const userType = user.access_level;
  const [formDatas, setFormDatas] = useState<BillingCodeTemplateFormType>({
    name: "",
    author_id: user.id as number,
    billing_codes: [],
  });
  const billingCodeTemplatePost = useBillingCodeTemplatePost();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    let value: string | string[] = e.target.value;
    const name = e.target.name;
    if (name === "billing_codes") {
      value = value.split(",").map((billing_code) => billing_code.trim());
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSave = async () => {
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
    const billingCodeTemplateToPost: BillingCodeTemplateType = {
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
  const handleCancel = () => {
    setErrMsgPost("");
    setNewTemplateVisible(false);
  };

  return (
    <li
      className="billing-codes__templates-list-item billing-codes__templates-list-item--edit"
      style={{ border: errMsgPost && "solid 1px red" }}
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

export default BillingCodesTemplateForm;
