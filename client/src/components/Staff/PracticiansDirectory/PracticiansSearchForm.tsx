import React from "react";
import { SearchStaffType } from "../../../types/api";
import Input from "../../UI/Inputs/Input";
import InputTel from "../../UI/Inputs/InputTel";

type PracticiansSearchFormProps = {
  search: SearchStaffType;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSiteChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const PracticiansSearchForm = ({
  search,
  handleSearch,
}: PracticiansSearchFormProps) => {
  //Queries

  return (
    <form className="search-practician__form">
      <div className="search-practician__item">
        <Input
          label="Name"
          name="name"
          value={search.name}
          onChange={handleSearch}
          autoFocus={true}
          id="name"
        />
      </div>
      <div className="search-practician__item">
        <Input
          label="Email"
          name="email"
          value={search.email}
          onChange={handleSearch}
          id="email"
        />
      </div>
      <div className="search-practician__item">
        <InputTel
          label="Phone"
          name="phone"
          value={search.phone}
          onChange={handleSearch}
          id="phone"
          placeholder="xxx-xxx-xxxx"
        />
      </div>
      {/* <div className="search-practician__item">
        <Input
          label="Occupation"
          name="title"
          value={search.title}
          onChange={handleSearch}
          id="title"
        />
      </div> */}
      <div className="search-practician__item">
        <Input
          label="Licence#"
          name="licence_nbr"
          value={search.licence_nbr}
          onChange={handleSearch}
          id="licence_nbr"
        />
      </div>
      <div className="search-practician__item">
        <Input
          label="OHIP#"
          name="ohip_billing_nbr"
          value={search.ohip_billing_nbr}
          onChange={handleSearch}
          id="ohip_billing_nbr"
        />
      </div>
      {/* <div className="search-practician__item">
        <SiteSelect
          handleSiteChange={handleSiteChange}
          sites={sites}
          value={search.site_id}
          label="Site"
          all={true}
        />
      </div> */}
    </form>
  );
};

export default PracticiansSearchForm;
