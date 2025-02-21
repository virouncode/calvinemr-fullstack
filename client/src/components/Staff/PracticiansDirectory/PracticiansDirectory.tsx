import React, { useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { SearchStaffType } from "../../../types/api";
import PracticiansSearchForm from "./PracticiansSearchForm";
import PracticiansSearchResults from "./PracticiansSearchResults";

const PracticiansDirectory = () => {
  const [search, setSearch] = useState<SearchStaffType>({
    email: "",
    name: "",
    title: "",
    speciality: "",
    subspeciality: "",
    phone: "",
    licence_nbr: "",
    ohip_billing_nbr: "",
    site_id: -1,
  });

  const debouncedSearch: SearchStaffType = useDebounce(search, 300);

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setSearch({ ...search, [name]: value });
  };

  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const site_id = parseInt(e.target.value);
    setSearch({ ...search, site_id });
  };

  return (
    <div className="search-practician__content">
      <PracticiansSearchForm
        search={search}
        handleSearch={handleSearch}
        handleSiteChange={handleSiteChange}
      />
      <PracticiansSearchResults debouncedSearch={debouncedSearch} />
    </div>
  );
};

export default PracticiansDirectory;
