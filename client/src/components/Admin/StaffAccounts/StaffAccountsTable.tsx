import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { SearchStaffType } from "../../../types/api";
import { filterStaffInfos } from "../../../utils/filterStaffInfos";
import EmptyRow from "../../UI/Tables/EmptyRow";
import StaffAccountItem from "./StaffAccountItem";

type StaffAccountsTableProps = {
  search: SearchStaffType;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedStaffId: React.Dispatch<React.SetStateAction<number>>;
};

const StaffAccountsTable = ({
  search,
  setEditVisible,
  setSelectedStaffId,
}: StaffAccountsTableProps) => {
  const { staffInfos } = useStaffInfosContext();
  const filteredStaffInfos = filterStaffInfos(staffInfos, search);

  return (
    <div className="staff-accounts__table-container">
      <table className="staff-accounts__table">
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
  );
};

export default StaffAccountsTable;
