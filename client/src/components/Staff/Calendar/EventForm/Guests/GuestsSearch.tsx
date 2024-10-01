import React, { useState } from "react";
import { usePatients } from "../../../../../hooks/reactquery/queries/patientsQueries";
import {
  DemographicsType,
  InvitationSentType,
  StaffType,
} from "../../../../../types/api";
import GuestsSearchForm from "./GuestsSearchForm";
import GuestsSearchResults from "./GuestsSearchResults";

type GuestsSearchProps = {
  hostId: number;
  handleAddStaffGuest: (staff: StaffType) => void;
  handleAddPatientGuest: (patient: DemographicsType) => void;
  staff_guests_ids: { staff_infos: StaffType }[];
  patientsIdsToExclude: number[];
  invitationsSent: InvitationSentType[];
};

const GuestsSearch = ({
  hostId,
  handleAddStaffGuest,
  handleAddPatientGuest,
  staff_guests_ids,
  patientsIdsToExclude,
  invitationsSent,
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

  return (
    <>
      <GuestsSearchForm
        search={search}
        handleSearch={handleSearch}
        invitationsSent={invitationsSent}
      />
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
        isPending={isPending}
        error={error}
      />
    </>
  );
};

export default GuestsSearch;
