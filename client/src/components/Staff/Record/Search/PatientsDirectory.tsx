import React, { useState } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import { SearchPatientType } from "../../../../types/app";
import PatientSearchForm from "./PatientSearchForm";
import PatientSearchResult from "./PatientSearchResult";

const PatientsDirectory = () => {
  const [search, setSearch] = useState<SearchPatientType>({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });

  const debouncedSearch = useDebounce(search, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setSearch({ ...search, [name]: value });
  };

  return (
    <>
      <PatientSearchForm search={search} handleSearch={handleSearch} />
      <PatientSearchResult debouncedSearch={debouncedSearch} />
    </>
  );
};

export default PatientsDirectory;
