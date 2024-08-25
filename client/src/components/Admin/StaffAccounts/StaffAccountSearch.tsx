import React from "react";
import { SearchStaffType, SiteType } from "../../../types/api";
import Input from "../../UI/Inputs/Input";
import InputEmail from "../../UI/Inputs/InputEmail";
import InputTel from "../../UI/Inputs/InputTel";
import OccupationsSelect from "../../UI/Lists/OccupationsSelect";
import SiteSelect from "../../UI/Lists/SiteSelect";

type StaffAccountSearchProps = {
  search: SearchStaffType;
  setSearch: React.Dispatch<React.SetStateAction<SearchStaffType>>;
  sites: SiteType[];
};

const StaffAccountSearch = ({
  search,
  setSearch,
  sites,
}: StaffAccountSearchProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setSearch({ ...search, [name]: value });
  };

  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearch({ ...search, site_id: parseInt(e.target.value) });
  };
  return (
    <div className="staff-search">
      <form className="staff-search__form">
        <div className="staff-search__row">
          <div className="staff-search__item">
            <Input
              value={search.name}
              onChange={handleChange}
              name="name"
              id="name"
              label="Name"
              autoFocus={true}
            />
          </div>
          <div className="staff-search__item">
            <SiteSelect
              handleSiteChange={handleSiteChange}
              sites={sites}
              value={search.site_id}
              label="Site"
              all={true}
            />
          </div>
          <div className="staff-search__item">
            <InputEmail
              value={search.email}
              onChange={handleChange}
              name="email"
              id="email"
              label="Email"
            />
          </div>
          <div className="staff-search__item">
            <InputTel
              value={search.phone}
              onChange={handleChange}
              name="phone"
              id="phone"
              label="Phone"
              placeholder="xxx-xxx-xxxx"
            />
          </div>
          <div className="staff-search__item">
            <OccupationsSelect
              id="title"
              name="title"
              value={search.title}
              onChange={handleChange}
              label="Occupation"
              all={true}
            />
          </div>
        </div>
        <div className="staff-search__row">
          <div className="staff-search__item">
            <Input
              value={search.licence_nbr}
              onChange={handleChange}
              name="licence_nbr"
              id="licence_nbr"
              label="Licence#"
            />
          </div>
          <div className="staff-search__item">
            <Input
              value={search.ohip_billing_nbr}
              onChange={handleChange}
              name="ohip_billing_nbr"
              id="ohip_billing_nbr"
              label="OHIP#"
            />
          </div>
          <div className="staff-search__item">
            <Input
              value={search.speciality}
              onChange={handleChange}
              name="speciality"
              id="speciality"
              label="Speciality"
            />
          </div>
          <div className="staff-search__item">
            <Input
              value={search.subspeciality}
              onChange={handleChange}
              name="subspeciality"
              id="subspeciality"
              label="Sub Speciality"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default StaffAccountSearch;
