import React from "react";
import { SearchPatientType } from "../../../../types/app";
import Input from "../../../UI/Inputs/Input";
import InputTel from "../../../UI/Inputs/InputTel";

type PatientSearchFormProps = {
  search: SearchPatientType;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PatientSearchForm = ({
  search,
  handleSearch,
}: PatientSearchFormProps) => {
  return (
    <form className="search-patient__form">
      <div className="search-patient__item">
        <Input
          label="Name"
          name="name"
          value={search.name}
          onChange={handleSearch}
          autoFocus={true}
          id="name"
        />
      </div>
      <div className="search-patient__item">
        <Input
          label="Email"
          name="email"
          value={search.email}
          onChange={handleSearch}
          id="email"
        />
      </div>
      <div className="search-patient__item">
        <InputTel
          label="Phone"
          name="phone"
          value={search.phone}
          onChange={handleSearch}
          id="phone"
          placeholder="xxx-xxx-xxxx"
        />
      </div>
      <div className="search-patient__item">
        <Input
          label="Date of birth"
          name="birth"
          value={search.birth}
          onChange={handleSearch}
          id="birth"
          placeholder="yyyy-mm-dd"
        />
      </div>
      <div className="search-patient__item">
        <Input
          label="Chart#"
          name="chart"
          value={search.chart}
          onChange={handleSearch}
          id="chart"
        />
      </div>
      <div className="search-patient__item">
        <Input
          label="Health Card#"
          name="health"
          value={search.health}
          onChange={handleSearch}
          id="health"
        />
      </div>
    </form>
  );
};

export default PatientSearchForm;
