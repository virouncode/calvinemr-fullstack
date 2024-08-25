import React, { useState } from "react";
import { SearchPatientType } from "../../../../types/app";
import PatientSearchForm from "./PatientSearchForm";
import PatientSearchResult from "./PatientSearchResult";

const PatientSearch = () => {
  const [search, setSearch] = useState<SearchPatientType>({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setSearch({ ...search, [name]: value });
  };
  return (
    <>
      <PatientSearchForm search={search} handleSearch={handleSearch} />
      <PatientSearchResult search={search} />
    </>
  );
};

export default PatientSearch;
