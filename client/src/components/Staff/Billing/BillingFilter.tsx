import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React from "react";
import { BillingType, XanoPaginatedType } from "../../../types/api";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import ExportCSVButton from "../../UI/Buttons/ExportCSVButton";
import Checkbox from "../../UI/Checkbox/Checkbox";
import Input from "../../UI/Inputs/Input";
import InputDate from "../../UI/Inputs/InputDate";
import Radio from "../../UI/Radio/Radio";

type BillingFilterProps = {
  billings?: BillingType[];
  rangeStart: number;
  rangeEnd: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setRangeStart: React.Dispatch<React.SetStateAction<number>>;
  setRangeEnd: React.Dispatch<React.SetStateAction<number>>;
  all: boolean;
  setAll: React.Dispatch<React.SetStateAction<boolean>>;
  initialRangeStart: React.MutableRefObject<number>;
  initialRangeEnd: React.MutableRefObject<number>;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<BillingType>, unknown>,
      Error
    >
  >;
  hasNextPage: boolean;
  serviceOrEntry: "service" | "entry";
  setServiceOrEntry: React.Dispatch<React.SetStateAction<"service" | "entry">>;
};

const BillingFilter = ({
  billings,
  rangeStart,
  rangeEnd,
  search,
  setSearch,
  setRangeStart,
  setRangeEnd,
  all,
  setAll,
  initialRangeStart,
  initialRangeEnd,
  fetchNextPage,
  hasNextPage,
  serviceOrEntry = "service",
  setServiceOrEntry,
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
    const name = e.target.name;
    if (!value) return;
    if (name === "date_start") {
      initialRangeStart.current = dateISOToTimestampTZ(value) as number;
      setRangeStart(dateISOToTimestampTZ(value) as number);
    }
    if (name === "date_end") {
      initialRangeEnd.current =
        (dateISOToTimestampTZ(value) as number) + 86399999;
      setRangeEnd((dateISOToTimestampTZ(value) as number) + 86399999);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleChangeDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name;
    if (value === "service") setServiceOrEntry("service");
    if (value === "entry") setServiceOrEntry("entry");
  };

  return (
    <div className="billing__filter">
      <div className="billing__filter-row-dates">
        <div className="billing__filter-row-dates-radio">
          <label>Filter by </label>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className="billing__filter-row-radio-item">
              <Radio
                id="service"
                name="service"
                onChange={handleChangeDateFilter}
                value="service"
                checked={serviceOrEntry === "service"}
                label="Date of service"
              />
            </div>
            <div className="billing__filter-row-radio-item">
              <Radio
                id="entry"
                name="entry"
                onChange={handleChangeDateFilter}
                value="entry"
                checked={serviceOrEntry === "entry"}
                label="Date of entry"
              />
            </div>
          </div>
        </div>
        <div className="billing__filter-item">
          <InputDate
            value={timestampToDateISOTZ(rangeStart)}
            onChange={handleDateChange}
            name="date_start"
            id="from"
            label="From"
            disabled={all}
          />
        </div>
        <div className="billing__filter-item">
          <InputDate
            value={timestampToDateISOTZ(rangeEnd)}
            onChange={handleDateChange}
            name="date_end"
            id="to"
            label="To"
            disabled={all}
          />
        </div>
        <div className="billing__filter-item">
          <Checkbox
            id="all"
            name="all"
            onChange={handleCheckAll}
            checked={all}
            label="All"
          />
        </div>
      </div>
      <div className="billing__filter-row-search">
        <div className="billing__filter-item">
          <Input
            value={search}
            onChange={handleSearch}
            name="search"
            id="search"
            label="Search"
            placeholder="Billing code, Name, ..."
          />
        </div>
        <div className="billing__filter-btns">
          <a href="https://billing.clinicaid.ca/login/" target="_blank">
            Clinic Aid
          </a>
          {billings && (
            <ExportCSVButton
              billings={billings}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              all={all}
              headers={csvHeaders}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingFilter;
