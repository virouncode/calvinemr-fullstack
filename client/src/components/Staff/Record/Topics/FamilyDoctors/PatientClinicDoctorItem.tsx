import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";
import {
  DemographicsType,
  SiteType,
  StaffType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import Button from "../../../../UI/Buttons/Button";

type PatientClinicDoctorItemProps = {
  item: StaffType;
  patientId: number;
  site: SiteType;
  demographicsInfos: DemographicsType;
};

const PatientClinicDoctorItem = ({
  item,
  patientId,
  site,
  demographicsInfos,
}: PatientClinicDoctorItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const [progress, setProgress] = useState(false);

  const handleRemoveFromPatient = async () => {
    try {
      setProgress(true);
      const staffToPut = {
        ...item,
        patients: item.patients.filter((id) => id !== patientId),
        updates: [
          ...item.updates,
          {
            date_updated: nowTZTimestamp(),
            updated_by_id: user.id,
            updated_by_user_type: "staff",
          },
        ],
      };
      const response = await xanoPut(`/staff/${item.id}`, "staff", staffToPut);
      socket?.emit("message", {
        route: "STAFF INFOS",
        action: "update",
        content: {
          id: item.id,
          data: response,
        },
      });
      // socket.emit("message", {
      //   route: "PATIENT DOCTORS",
      //   action: "delete",
      //   content: {
      //     id: item.id,
      //   },
      //   patientId,
      // });
      toast.success("Removed successfully", { containerId: "A" });
      setProgress(false);
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to remove doctor:${err.message}`, {
          containerId: "A",
        });
      setProgress(false);
    }
  };

  return (
    site && (
      <tr className="doctors__item">
        <td>
          {demographicsInfos.assigned_staff_id === item.id ? (
            "Assigned practician"
          ) : (
            <Button
              onClick={handleRemoveFromPatient}
              disabled={progress}
              label="Remove from patient"
            />
          )}
        </td>
        <td>{item.last_name}</td>
        <td>{item.first_name}</td>
        <td>{item.speciality}</td>
        <td>{item.licence_nbr}</td>
        <td>{item.ohip_billing_nbr}</td>
        <td>{site.address}</td>
        <td>{site.city}</td>
        <td>
          {toCodeTableName(provinceStateTerritoryCT, site.province_state)}
        </td>
        <td className="td--postal">{site.postal_code || site.zip_code}</td>
        <td>{site.phone}</td>
        <td>{site.fax}</td>
        <td>{site.email}</td>
      </tr>
    )
  );
};

export default PatientClinicDoctorItem;
