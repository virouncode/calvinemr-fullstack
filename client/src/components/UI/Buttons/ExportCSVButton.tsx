import React from "react";
import { CSVLink } from "react-csv";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { AdminType, BillingType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { timestampToDateISOTZ } from "../../../utils/dates/formatDates";
import { toExportCSVName } from "../../../utils/files/toExportCSVName";

type ExportCSVButtonProps = {
  billings: BillingType[];
  rangeStart: number;
  rangeEnd: number;
  all: boolean;
  headers: {
    label: string;
    key: string;
  }[];
};

const ExportCSVButton = ({
  billings,
  rangeStart,
  rangeEnd,
  all,
  headers,
}: ExportCSVButtonProps) => {
  const { user } = useUserContext() as { user: AdminType | UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  console.log("billings", billings);

  return (
    <button className="btn">
      <CSVLink
        data={billings?.map((billing) => {
          return {
            ...billing,
            date: [
              timestampToDateISOTZ(billing.date)?.split("-")[1],
              timestampToDateISOTZ(billing.date)?.split("-")[2],
              timestampToDateISOTZ(billing.date)?.split("-")[0],
            ].join("-"),
            site_infos: {
              ...billing.site_infos,
              province_state: billing.site_infos?.province_state.split("-")[1],
            },
            patient_infos: {
              ...billing.patient_infos,
              DateOfBirth: [
                timestampToDateISOTZ(billing.patient_infos?.DateOfBirth)?.split(
                  "-"
                )[1],
                timestampToDateISOTZ(billing.patient_infos?.DateOfBirth)?.split(
                  "-"
                )[2],
                timestampToDateISOTZ(billing.patient_infos?.DateOfBirth)?.split(
                  "-"
                )[0],
              ].join("-"),
              Gender: billing.patient_infos?.Gender === "M" ? "Male" : "Female",
            },
            referrer_ohip_billing_nbr: billing.referrer_ohip_billing_nbr || "",
            service_quantity: 1,
            billing_infos: {
              ...billing.billing_infos,
              billing_code:
                billing.billing_infos?.billing_code.length === 4
                  ? `${billing.billing_infos?.billing_code}A`
                  : billing.billing_infos?.billing_code,
            },
          };
        })}
        filename={toExportCSVName(
          user?.access_level,
          user?.title || "",
          rangeStart,
          rangeEnd,
          all,
          staffInfos,
          user?.id
        )}
        // target="_blank"
        headers={headers}
        style={{ color: "#3D375A" }}
      >
        Export to CSV
      </CSVLink>
    </button>
  );
};

export default ExportCSVButton;
