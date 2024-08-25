import React from "react";
import { BillingType } from "../../../types/api";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import ExportCSVButton from "../../UI/Buttons/ExportCSVButton";
import Checkbox from "../../UI/Checkbox/Checkbox";
import InputDate from "../../UI/Inputs/InputDate";

type BillingFilterProps = {
  billings: BillingType[];
  rangeStart: number;
  rangeEnd: number;
  setRangeStart: React.Dispatch<React.SetStateAction<number>>;
  setRangeEnd: React.Dispatch<React.SetStateAction<number>>;
  all: boolean;
  setAll: React.Dispatch<React.SetStateAction<boolean>>;
  initialRangeStart: React.MutableRefObject<number>;
  initialRangeEnd: React.MutableRefObject<number>;
};

const BillingFilter = ({
  billings,
  rangeStart,
  rangeEnd,
  setRangeStart,
  setRangeEnd,
  all,
  setAll,
  initialRangeStart,
  initialRangeEnd,
}: BillingFilterProps) => {
  const csvHeaders = [
    {
      label: "ProviderNumber",
      key: "provider_ohip_billing_nbr.ohip_billing_nbr",
    },
    {
      label: "GroupNumber",
      key: "",
    },
    {
      label: "ProvinceCode",
      key: "site_infos.province_state",
    },
    {
      label: "HealthNumber",
      key: "patient_infos.HealthCard.Number",
    },
    {
      label: "VersionCode",
      key: "patient_infos.HealthCard.Version",
    },
    {
      label: "FirstName",
      key: "patient_infos.Names.LegalName.FirstName.Part",
    },
    {
      label: "LastName",
      key: "patient_infos.Names.LegalName.LastName.Part",
    },
    {
      label: "DOB",
      key: "patient_infos.DateOfBirth",
    },
    {
      label: "Gender",
      key: "patient_infos.Gender",
    },
    {
      label: "ReferringProviderNumber",
      key: "referrer_ohip_billing_nbr",
    },
    {
      label: "DiagnosticCode",
      key: "diagnosis_code.code",
    },
    {
      label: "ServiceLocationType",
      key: "",
    },
    {
      label: "MasterNumber",
      key: "",
    },
    {
      label: "AdmissionDate",
      key: "",
    },
    { label: "ServiceDate", key: "date" },
    { label: "ServiceCode", key: "billing_infos.billing_code" },
    { label: "ServiceQuantity", key: "service_quantity" },
  ];

  const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setAll(true);
      setRangeStart(-5364662400000); // 1900-01-01
      setRangeEnd(32503680000000); // 3000-01-01
    } else {
      setAll(false);
      setRangeStart(initialRangeStart.current);
      setRangeEnd(initialRangeEnd.current);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    const name = e.target.name;
    if (name === "date_start") {
      initialRangeStart.current = dateISOToTimestampTZ(value) as number;
      setRangeStart(dateISOToTimestampTZ(value) as number);
    }
    if (name === "date_end") {
      initialRangeEnd.current = dateISOToTimestampTZ(value) as number;
      setRangeEnd(dateISOToTimestampTZ(value) as number);
    }
  };

  return (
    <div className="billing-filter">
      <div className="billing-filter__row">
        <div className="billing-filter__title">Filter</div>
        <div className="billing-filter__item">
          <InputDate
            value={timestampToDateISOTZ(rangeStart)}
            onChange={handleDateChange}
            name="date_start"
            id="from"
            label="From"
            disabled={all}
          />
        </div>
        <div className="billing-filter__item">
          <InputDate
            value={timestampToDateISOTZ(rangeEnd)}
            onChange={handleDateChange}
            name="date_end"
            id="to"
            label="To"
            disabled={all}
          />
        </div>
        <div className="billing-filter__item">
          <Checkbox
            id="all"
            name="all"
            onChange={handleCheckAll}
            checked={all}
            label="All"
          />
        </div>
        <div className="billing-filter__btn-container">
          <a href="https://cab.md/Signin.aspx" target="_blank">
            Cab MD
          </a>
          <ExportCSVButton
            billings={billings}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            all={all}
            headers={csvHeaders}
          />
        </div>
      </div>
    </div>
  );
};

export default BillingFilter;
