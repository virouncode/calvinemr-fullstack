import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useIntersection from "../../../../../hooks/useIntersection";
import {
  DemographicsType,
  StaffType,
  XanoPaginatedType,
} from "../../../../../types/api";
import LoadingLi from "../../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import GuestPatientResultItem from "./GuestPatientResultItem";
import GuestStaffResultItem from "./GuestStaffResultItem";

type GuestsSearchResultsProps = {
  patients:
    | InfiniteData<XanoPaginatedType<DemographicsType>, unknown>
    | undefined;
  hostId: number;
  staff_guests_ids: { staff_infos: StaffType }[];
  handleAddStaffGuest: (staff: StaffType) => void;
  handleAddPatientGuest: (patient: DemographicsType) => void;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<DemographicsType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
  search: {
    name: string;
    email: string;
    phone: string;
    birth: string;
    chart: string;
    health: string;
  };
  patientsIdsToExclude: number[];
  isPending: boolean;
  error: Error | null;
};

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
  isPending,
  error,
}: GuestsSearchResultsProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  //Intersection observer
  const { divRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const patientsToDisplay =
    patients?.pages
      .flatMap((page) => page.items)
      .filter(({ patient_id }) => !patientsIdsToExclude.includes(patient_id)) ??
    [];
  if (isPending)
    return (
      <div className="guests-results" ref={divRef}>
        <LoadingParagraph />
      </div>
    );
  if (error)
    return (
      <div className="guests-results" ref={divRef}>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  return (
    <div className="guests-results" ref={divRef}>
      <div className="guests-results__patients">
        <div className="guests-results__title">Patients</div>
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
      <div className="guests-results__staff">
        <div className="guests-results__title">Staff</div>
        <ul>
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
        </ul>
      </div>
    </div>
  );
};

export default GuestsSearchResults;
