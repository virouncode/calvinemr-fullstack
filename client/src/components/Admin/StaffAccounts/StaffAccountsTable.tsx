import React from "react";
import { SearchStaffType, StaffType } from "../../../types/api";
import CircularProgressMedium from "../../UI/Progress/CircularProgressMedium";
import EmptyRow from "../../UI/Tables/EmptyRow";
import StaffAccountItem from "./StaffAccountItem";

type StaffAccountsTableProps = {
  search: SearchStaffType;
  staffInfos: StaffType[];
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedStaffId: React.Dispatch<React.SetStateAction<number>>;
};

const StaffAccountsTable = ({
  search,
  staffInfos,
  setEditVisible,
  setSelectedStaffId,
}: StaffAccountsTableProps) => {
  const filteredStaffInfos =
    staffInfos.length > 0
      ? staffInfos.filter(
          (staff) =>
            staff.full_name
              ?.toLowerCase()
              .includes(search.name.toLowerCase()) &&
            staff.email?.toLowerCase().includes(search.email.toLowerCase()) &&
            (staff.cell_phone
              ?.toLowerCase()
              .includes(search.phone.toLowerCase()) ||
              staff.backup_phone
                ?.toLowerCase()
                .includes(search.phone.toLowerCase())) &&
            staff.speciality
              ?.toLowerCase()
              .includes(search.speciality.toLowerCase()) &&
            staff.subspeciality
              ?.toLowerCase()
              .includes(search.subspeciality.toLowerCase()) &&
            staff.licence_nbr?.includes(search.licence_nbr) &&
            staff.ohip_billing_nbr.includes(search.ohip_billing_nbr) &&
            (search.site_id === -1 || staff.site_id === search.site_id) &&
            (search.title === "All" || staff.title === search.title)
        )
      : [];

  return staffInfos ? (
    <div className="staff-result">
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Site</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Cell phone</th>
            <th>Backup phone</th>
            <th>Occupation</th>
            <th>Speciality</th>
            <th>Subspeciality</th>
            <th>Licence#</th>
            <th>OHIP#</th>
            <th>Account status</th>
            <th>Updated by</th>
            <th>Updated on</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaffInfos.length > 0 ? (
            filteredStaffInfos.map((staff) => (
              <StaffAccountItem
                staff={staff}
                key={staff.id}
                setEditVisible={setEditVisible}
                setSelectedStaffId={setSelectedStaffId}
                id={staff.id}
              />
            ))
          ) : (
            <EmptyRow colSpan={17} text={"No results"} />
          )}
        </tbody>
      </table>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgressMedium />
    </div>
  );
};

export default StaffAccountsTable;
