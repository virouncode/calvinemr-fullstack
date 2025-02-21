import React from "react";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import InputDate from "../../UI/Inputs/InputDate";
import SiteSelect from "../../UI/Lists/SiteSelect";
import StaffList from "../../UI/Lists/StaffList";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";

type AllCyclesFormProps = {
  search: {
    range_start: number;
    range_end: number;
    site_id: number;
    assigned_md: number;
  };
  setSearch: React.Dispatch<
    React.SetStateAction<{
      range_start: number;
      range_end: number;
      site_id: number;
      assigned_md: number;
    }>
  >;
};

const AllCyclesForm = ({ search, setSearch }: AllCyclesFormProps) => {
  const { data: sites, error, isPending } = useSites();
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setSearch((prev) => ({
      ...prev,
      [name]: dateISOToTimestampTZ(value),
    }));
  };
  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSearch((prev) => ({
      ...prev,
      assigned_md: parseInt(value),
    }));
  };
  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSearch((prev) => ({
      ...prev,
      site_id: parseInt(value),
    }));
  };

  if (error) return <ErrorParagraph errorMsg="Error loading sites" />;
  if (isPending) return <LoadingParagraph />;

  return (
    <form className="allCycles__form">
      <div className="search-patient__item">
        <InputDate
          value={timestampToDateISOTZ(search.range_start)}
          onChange={handleDateChange}
          name="range_start"
          id="from"
          label="From"
        />
      </div>
      <div className="search-patient__item">
        <InputDate
          value={timestampToDateISOTZ(search.range_end)}
          onChange={handleDateChange}
          name="range_end"
          id="to"
          label="To"
        />
      </div>
      <div className="search-patient__item">
        <SiteSelect
          sites={sites}
          value={search.site_id}
          handleSiteChange={handleSiteChange}
          label="Site"
          all={true}
        />
      </div>
      <div className="search-patient__item">
        <label>Doctor</label>
        <StaffList
          value={search.assigned_md}
          name="assigned_md"
          handleChange={handleDoctorChange}
          all={true}
          onlyDoctors={true}
        />
      </div>
    </form>
  );
};

export default AllCyclesForm;
