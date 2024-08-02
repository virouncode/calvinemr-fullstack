
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useIntersection from "../../../../hooks/useIntersection";
import LoadingLi from "../../../UI/Lists/LoadingLi";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import GuestPatientResultItem from "./GuestPatientResultItem";
import GuestStaffResultItem from "./GuestStaffResultItem";

const GuestsSearchResults = ({
  patients,
  hostId,
  staff_guests_ids,
  handleAddStaffGuest,
  handleAddPatientGuest,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
  search,
  patientsIdsToExclude,
}) => {
  const { staffInfos } = useStaffInfosContext();
  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  if (patients.isPending) return <LoadingParagraph />;

  const patientsToDisplay = patients.pages
    .flatMap((page) => page.items)
    .filter(({ patient_id }) => !patientsIdsToExclude.includes(patient_id));

  return (
    <div className="results" ref={rootRef}>
      <div className="results__patients">
        <div className="results__title">Patients</div>
        <ul>
          {patientsToDisplay.map((guest, index) =>
            index === patientsToDisplay.length - 1 ? (
              <GuestPatientResultItem
                key={guest.id}
                guest={guest}
                handleAddPatientGuest={handleAddPatientGuest}
                lastItemRef={lastItemRef}
              />
            ) : (
              <GuestPatientResultItem
                key={guest.id}
                guest={guest}
                handleAddPatientGuest={handleAddPatientGuest}
              />
            )
          )}
          {isFetchingNextPage && <LoadingLi />}
        </ul>
      </div>
      <div className="results__staff">
        <div className="results__title">Staff</div>
        {search.chart === "" &&
          search.health === "" &&
          search.birth === "" &&
          staffInfos
            .filter(({ account_status }) => account_status !== "Closed")
            .filter(
              (staff) =>
                staff.full_name
                  .toLowerCase()
                  .includes(search.name.toLowerCase()) &&
                staff.email
                  .toLowerCase()
                  .includes(search.email.toLowerCase()) &&
                (staff.cell_phone.includes(search.phone) ||
                  staff.backup_phone.includes(search.phone)) &&
                staff.id !== hostId &&
                !staff_guests_ids
                  .map(({ staff_infos }) => staff_infos.id)
                  .includes(staff.id)
            )
            .map((staff) => (
              <GuestStaffResultItem
                key={staff.id}
                staff={staff}
                handleAddStaffGuest={handleAddStaffGuest}
              />
            ))}
      </div>
    </div>
  );
};

export default GuestsSearchResults;
