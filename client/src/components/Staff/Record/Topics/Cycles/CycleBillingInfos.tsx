import React from "react";
import { CycleType } from "../../../../../types/api";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import InputDate from "../../../../UI/Inputs/InputDate";

type CycleSpermInfosProps = {
  formDatas: Partial<CycleType>;
  setFormDatas: React.Dispatch<React.SetStateAction<Partial<CycleType>>>;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
  errMsg: string;
};

const CycleBillingInfos = ({
  formDatas,
  setFormDatas,
  setErrMsg,
  errMsg,
}: CycleSpermInfosProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    const name = e.target.name;
    const value = dateISOToTimestampTZ(e.target.value);
    setFormDatas({ ...formDatas, [name]: value });
  };
  return (
    <fieldset
      className="cycles-form__billing-infos"
      style={{ border: errMsg && "solid 1px red" }}
    >
      <legend>BILLING</legend>
      <div className="cycles-form__billing-infos-content">
        <div className="cycles-form__billing-infos-row">
          <div className="cycles-form__billing-infos-item">
            <InputDate
              label="Funded IUI/IVF/FET - Billing sent at"
              id="funded_billing_sent_at"
              name="funded_billing_sent_at"
              value={
                timestampToDateISOTZ(formDatas.funded_billing_sent_at) ?? ""
              }
              onChange={handleChange}
              width={210}
            />
          </div>
          <div className="cycles-form__billing-infos-item">
            <InputDate
              label="Funded IUI/IVF/FET - Payment received at"
              id="funded_payment_received_at"
              name="funded_payment_received_at"
              value={
                timestampToDateISOTZ(formDatas.funded_payment_received_at) ?? ""
              }
              onChange={handleChange}
              width={210}
            />
          </div>
          <div className="cycles-form__billing-infos-item">
            <InputDate
              label="Non Funded IUI/IVF/FET - Billing sent at"
              id="non_funded_billing_sent_at"
              name="non_funded_billing_sent_at"
              value={
                timestampToDateISOTZ(formDatas.non_funded_billing_sent_at) ?? ""
              }
              onChange={handleChange}
              width={210}
            />
          </div>
          <div className="cycles-form__billing-infos-item">
            <InputDate
              label="Non Funded IUI/IVF/FET - Payment received at"
              id="non_funded_payment_received_at"
              name="non_funded_payment_received_at"
              value={
                timestampToDateISOTZ(
                  formDatas.non_funded_payment_received_at
                ) ?? ""
              }
              onChange={handleChange}
              width={210}
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default CycleBillingInfos;
