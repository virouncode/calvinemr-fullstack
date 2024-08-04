import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import ExportCSVButton from "../../UI/Buttons/ExportCSVButton";

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
}) => {
  const headers = [
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

  const handleCheckAll = (e) => {
    if (e.target.checked) {
      setAll(true);
      setRangeStart(dateISOToTimestampTZ("1970-01-01"));
      setRangeEnd(dateISOToTimestampTZ("3000-01-01"));
    } else {
      setAll(false);
      setRangeStart(initialRangeStart.current);
      setRangeEnd(initialRangeEnd.current);
    }
  };

  const handleDateChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    if (name === "date_start") {
      if (value === "") {
        value = "1970-01-01";
      }
      initialRangeStart.current = dateISOToTimestampTZ(value);
      setRangeStart(dateISOToTimestampTZ(value));
    }
    if (name === "date_end") {
      if (value === "") {
        value = "3000-01-01";
      }
      initialRangeEnd.current = dateISOToTimestampTZ(value);
      setRangeEnd(dateISOToTimestampTZ(value));
    }
  };

  return (
    <div className="billing-filter">
      <div className="billing-filter__row">
        <div className="billing-filter__title">Filter</div>
        <div className="billing-filter__item">
          <label htmlFor="from">From</label>
          <input
            type="date"
            value={timestampToDateISOTZ(rangeStart, "America/Toronto")}
            name="date_start"
            onChange={handleDateChange}
            disabled={all}
            id="from"
          />
        </div>
        <div className="billing-filter__item">
          <label htmlFor="to">To</label>
          <input
            type="date"
            value={timestampToDateISOTZ(rangeEnd, "America/Toronto")}
            name="date_end"
            onChange={handleDateChange}
            disabled={all}
            id="to"
          />
        </div>
        <div className="billing-filter__item">
          <input
            type="checkbox"
            checked={all}
            name="all"
            onChange={handleCheckAll}
            id="all"
          />
          <label htmlFor="all">All</label>
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
            headers={headers}
          />
        </div>
      </div>
    </div>
  );
};

export default BillingFilter;
