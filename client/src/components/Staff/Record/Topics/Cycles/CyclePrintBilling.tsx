import React from "react";
import { CycleType } from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";

type CyclePrintBillingProps = {
  cycle: CycleType;
};

const CyclePrintBilling = ({ cycle }: CyclePrintBillingProps) => {
  return (
    <div className="cycle-print__billing">
      <div className="cycle-print__billing-title">Billing</div>
      <div className="cycle-print__billing-content">
        <div className="cycle-print__billing-item">
          <label>Funded IUI/IVF/FET - Billing sent at :</label>
          <span>{timestampToDateISOTZ(cycle.funded_billing_sent_at)}</span>
        </div>
        <div className="cycle-print__billing-item">
          <label>Funded IUI/IVF/FET - Payed at :</label>
          <span>{timestampToDateISOTZ(cycle.funded_payment_received_at)}</span>
        </div>
        <div className="cycle-print__billing-item">
          <label>Non-Funded IUI/IVF/FET - Billing sent at :</label>
          <span>{timestampToDateISOTZ(cycle.non_funded_billing_sent_at)}</span>
        </div>
        <div className="cycle-print__billing-item">
          <label>Non-Funded IUI/IVF/FET - Payed at :</label>
          <span>
            {timestampToDateISOTZ(cycle.non_funded_payment_received_at)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CyclePrintBilling;
