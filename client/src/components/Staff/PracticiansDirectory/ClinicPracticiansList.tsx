import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { SearchStaffType, SiteType, StaffType } from "../../../types/api";
import { staffIdToName } from "../../../utils/names/staffIdToName";
import EmptyRow from "../../UI/Tables/EmptyRow";
import ClinicPracticianItem from "./ClinicPracticianItem";

type ClinicPracticiansListProps = {
  sites: SiteType[];
  debouncedSearch: SearchStaffType;
};

const ClinicPracticiansList = ({
  sites,
  debouncedSearch,
}: ClinicPracticiansListProps) => {
  const { staffInfos } = useStaffInfosContext();
  const practicians: StaffType[] = staffInfos
    .filter(({ title }) => title !== "Secretary")
    .filter(
      (item) =>
        staffIdToName(staffInfos, item.id, false)
          .toLowerCase()
          .includes(debouncedSearch.name.toLowerCase().trim()) &&
        sites
          .find(({ id }) => id === item.site_id)
          ?.email.toLowerCase()
          .includes(debouncedSearch.email.toLowerCase().trim()) &&
        item.cell_phone
          .toLowerCase()
          .includes(debouncedSearch.phone.toLowerCase().trim()) &&
        item.licence_nbr
          .toLowerCase()
          .includes(debouncedSearch.licence_nbr.toLowerCase().trim()) &&
        item.ohip_billing_nbr
          .toLowerCase()
          .includes(debouncedSearch.ohip_billing_nbr.toLowerCase().trim())
    );

  return (
    <div className="doctors-list">
      <div className="doctors-list__title">Clinic Practicioners directory</div>
      <div className="doctors-list__table-container doctors-list__table-container--practician">
        <table className="doctors-list__table">
          <thead>
            <tr>
              <th>Last name</th>
              <th>First name</th>
              <th>Speciality</th>
              <th>Licence#</th>
              <th>OHIP#</th>
              <th>Address</th>
              <th>City</th>
              <th>Province/State</th>
              <th>Postal/Zip Code</th>
              <th>Phone</th>
              <th>Fax</th>
              <th>Email</th>
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {sites.length > 0 && practicians && practicians.length > 0 ? (
              practicians.map((item) => (
                <ClinicPracticianItem
                  item={item}
                  key={item.id}
                  site={sites.find(({ id }) => id === item.site_id) as SiteType}
                />
              ))
            ) : (
              <EmptyRow colSpan={15} text="No results" />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClinicPracticiansList;
