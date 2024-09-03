import React from "react";
import Input from "../../UI/Inputs/Input";
import InputTel from "../../UI/Inputs/InputTel";

type PharmaciesSearchProps = {
  search: {
    name: string;
    address: string;
    city: string;
    postal_code: string;
    phone: string;
  };
  setSearch: React.Dispatch<
    React.SetStateAction<{
      name: string;
      address: string;
      city: string;
      postal_code: string;
      phone: string;
    }>
  >;
};

const PharmaciesSearch = ({ search, setSearch }: PharmaciesSearchProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setSearch({ ...search, [name]: value });
  };
  return (
    <div className="patient-pharmacies__directory-search">
      <form className="patient-pharmacies__directory-search-form">
        <div className="patient-pharmacies__directory-search-item">
          <Input
            label="Name"
            name="name"
            value={search.name}
            onChange={handleSearch}
            autoFocus={true}
            id="name"
          />
        </div>
        <div className="patient-pharmacies__directory-search-item">
          <Input
            label="Address"
            name="address"
            value={search.address}
            onChange={handleSearch}
            id="address"
          />
        </div>
        <div className="patient-pharmacies__directory-search-item">
          <InputTel
            label="City"
            name="city"
            value={search.city}
            onChange={handleSearch}
            id="city"
          />
        </div>
        <div className="patient-pharmacies__directory-search-item">
          <Input
            label="Postal/Zip Code"
            name="postal_code"
            value={search.postal_code}
            onChange={handleSearch}
            id="postal_code"
            placeholder="A1A 1A1 or 12345"
          />
        </div>
        <div className="patient-pharmacies__directory-search-item">
          <Input
            label="Phone"
            name="phone"
            value={search.phone}
            onChange={handleSearch}
            id="phone"
            placeholder="xxx-xxx-xxxx"
          />
        </div>
      </form>
    </div>
  );
};

export default PharmaciesSearch;
