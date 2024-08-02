import { useState } from "react";
import { usePatients } from "../../../../hooks/reactquery/queries/patientsQueries";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import GuestsSearchForm from "./GuestsSearchForm";
import GuestsSearchResults from "./GuestsSearchResults";

const GuestsSearch = ({
  hostId,
  handleAddStaffGuest,
  handleAddPatientGuest,
  staff_guests_ids,
  patientsIdsToExclude,
}) => {
  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });

  const {
    data: patients,
    isPending,
    isError,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePatients(search);

  const handleSearch = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setSearch({ ...search, [name]: value });
  };

  if (isPending) return <LoadingParagraph />;
  if (isError) return <ErrorParagraph errorMsg={error.message} />;

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
