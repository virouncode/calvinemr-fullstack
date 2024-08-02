import { CSVLink } from "react-csv";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import { toExportCSVName } from "../../../utils/files/toExportCSVName";

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
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
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
          <button>
            <CSVLink
              data={billings.map((billing) => {
                return {
                  ...billing,
                  date: [
                    timestampToDateISOTZ(billing.date).split("-")[1],
                    timestampToDateISOTZ(billing.date).split("-")[2],
                    timestampToDateISOTZ(billing.date).split("-")[0],
                  ].join("-"),
                  site_infos: {
                    ...billing.site_infos,
                    province_state:
                      billing.site_infos.province_state.split("-")[1],
                  },
                  patient_infos: {
                    ...billing.patient_infos,
                    DateOfBirth: [
                      timestampToDateISOTZ(
                        billing.patient_infos.DateOfBirth
                      ).split("-")[1],
                      timestampToDateISOTZ(
                        billing.patient_infos.DateOfBirth
                      ).split("-")[2],
                      timestampToDateISOTZ(
                        billing.patient_infos.DateOfBirth
                      ).split("-")[0],
                    ].join("-"),
                    Gender:
                      billing.patient_infos.Gender === "M" ? "Male" : "Female",
                  },
                  referrer_ohip_billing_nbr:
                    billing.referrer_ohip_billing_nbr || "",
                  service_quantity: 1,
                  billing_infos: {
                    ...billing.billing_infos,
                    billing_code:
                      billing.billing_infos.billing_code.length === 4
                        ? `${billing.billing_infos.billing_code}A`
                        : billing.billing_infos.billing_code,
                  },
                };
              })}
              filename={toExportCSVName(
                user.access_level,
                user.title || "",
                rangeStart,
                rangeEnd,
                all,
                staffInfos,
                user.id
              )}
              // target="_blank"
              headers={headers}
              style={{ color: "#3D375A" }}
            >
              Export to CSV
            </CSVLink>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingFilter;
