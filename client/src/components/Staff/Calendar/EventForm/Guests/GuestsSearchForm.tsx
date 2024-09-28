import React from "react";
import Input from "../../../../UI/Inputs/Input";
import InputEmail from "../../../../UI/Inputs/InputEmail";
import InputTel from "../../../../UI/Inputs/InputTel";

type GuestsSearchFormProps = {
  search: {
    name: string;
    email: string;
    phone: string;
    birth: string;
    chart: string;
    health: string;
  };
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const GuestsSearchForm = ({ search, handleSearch }: GuestsSearchFormProps) => {
  return (
    <div className="guests-search">
      <p className="guests-search__title">Search by</p>
      <div className="guests-search__grid">
        <div className="guests-search__item">
          <Input
            value={search.name}
            onChange={handleSearch}
            name="name"
            id="name-search"
            label="Name"
          />
        </div>
        <div className="guests-search__item">
          <InputEmail
            value={search.email}
            onChange={handleSearch}
            name="email"
            id="email-search"
            label="Email"
          />
        </div>

        <div className="guests-search__item">
          <InputTel
            value={search.phone}
            onChange={handleSearch}
            name="phone"
            id="phone-search"
            label="Phone"
            placeholder="xxx-xxx-xxxx"
          />
        </div>
        <div className="guests-search__item">
          <Input
            value={search.birth}
            onChange={handleSearch}
            name="birth"
            id="dob-search"
            label="Date of birth"
            placeholder="yyyy-mm-dd"
          />
        </div>
        <div className="guests-search__item">
          <Input
            value={search.chart}
            onChange={handleSearch}
            name="chart"
            id="chart-search"
            label="Chart#"
          />
        </div>
        <div className="guests-search__item">
          <Input
            value={search.health}
            onChange={handleSearch}
            name="health"
            id="health-search"
            label="Health Card#"
          />
        </div>
      </div>
    </div>
  );
};

export default GuestsSearchForm;
