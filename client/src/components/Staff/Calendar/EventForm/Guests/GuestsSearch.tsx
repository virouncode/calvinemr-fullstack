import React, { useState } from "react";
import { usePatients } from "../../../../../hooks/reactquery/queries/patientsQueries";
import { DemographicsType, StaffType } from "../../../../../types/api";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import GuestsSearchForm from "./GuestsSearchForm";
import GuestsSearchResults from "./GuestsSearchResults";

type GuestsSearchProps = {
  hostId: number;
  handleAddStaffGuest: (staff: StaffType) => void;
  handleAddPatientGuest: (patient: DemographicsType) => void;
  staff_guests_ids: { staff_infos: StaffType }[];
  patientsIdsToExclude: number[];
};

const GuestsSearch = ({
  hostId,
  handleAddStaffGuest,
  handleAddPatientGuest,
  staff_guests_ids,
  patientsIdsToExclude,
}: GuestsSearchProps) => {
  //Hooks
  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });
  //Queries
  const {
    data: patients,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePatients(search);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setSearch({ ...search, [name]: value });
  };

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;

  return (
    <>
      <GuestsSearchForm search={search} handleSearch={handleSearch} />
      <GuestsSearchResults
        patients={patients}
        hostId={hostId}
        staff_guests_ids={staff_guests_ids}
        handleAddStaffGuest={handleAddStaffGuest}
        handleAddPatientGuest={handleAddPatientGuest}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        search={search}
        patientsIdsToExclude={patientsIdsToExclude}
      />
    </>
  );
};

export default GuestsSearch;
