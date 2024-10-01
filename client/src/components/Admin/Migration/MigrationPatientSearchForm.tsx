import React from "react";
import { SearchPatientType } from "../../../types/app";
import Input from "../../UI/Inputs/Input";
import InputEmail from "../../UI/Inputs/InputEmail";
import InputTel from "../../UI/Inputs/InputTel";

type MigrationPatientSearchFormProps = {
  search: SearchPatientType;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const MigrationPatientSearchForm = ({
  search,
  handleSearch,
}: MigrationPatientSearchFormProps) => {
  return (
    <div className="migration__export-patients-search">
      <form className="migration__export-patients-search-form">
        <div className="migration__export-patients-search-item">
          <Input
            value={search.name}
            onChange={handleSearch}
            name="name"
            id="name"
            label="Name"
            autoFocus={true}
          />
        </div>
        <div className="migration__export-patients-search-item">
          <InputEmail
            value={search.email}
            onChange={handleSearch}
            name="email"
            id="email"
            label="Email"
          />
        </div>
        <div className="migration__export-patients-search-item">
          <InputTel
            value={search.phone}
            onChange={handleSearch}
            name="phone"
            id="phone"
            label="Phone"
            placeholder="xxx-xxx-xxxx"
          />
        </div>
        <div className="migration__export-patients-search-item">
          <Input
            value={search.birth}
            onChange={handleSearch}
            name="birth"
            id="birth"
            label="Date of birth"
            placeholder="yyyy-mm-dd"
          />
        </div>
        <div className="migration__export-patients-search-item">
          <Input
            value={search.chart}
            onChange={handleSearch}
            name="chart"
            id="chart"
            label="Chart#"
          />
        </div>
        <div className="migration__export-patients-search-item">
          <Input
            value={search.health}
            onChange={handleSearch}
            name="health"
            id="health"
            label="Health Card#"
          />
        </div>
      </form>
    </div>
  );
};

export default MigrationPatientSearchForm;
