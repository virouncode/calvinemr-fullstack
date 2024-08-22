import { SearchStaffType, StaffType } from "../types/api";

export const filterStaffInfos = (
  staffInfos: StaffType[],
  search: SearchStaffType
) => {
  return staffInfos.length > 0
    ? staffInfos.filter(
        (staff) =>
          staff.full_name?.toLowerCase().includes(search.name.toLowerCase()) &&
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
};
