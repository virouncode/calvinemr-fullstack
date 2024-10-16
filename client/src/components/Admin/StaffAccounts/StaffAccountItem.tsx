import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import useClinicContext from "../../../hooks/context/useClinicContext";
import { StaffType } from "../../../types/api";
import Button from "../../UI/Buttons/Button";
import EditButton from "../../UI/Buttons/EditButton";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import SignCellMultipleTypes from "../../UI/Tables/SignCellMultipleTypes";

type StaffAccountItemProps = {
  staff: StaffType;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  setSelectedStaffId: React.Dispatch<React.SetStateAction<number>>;
};

const StaffAccountItem = ({
  staff,
  setEditVisible,
  id,
  setSelectedStaffId,
}: StaffAccountItemProps) => {
  const { clinic } = useClinicContext();

  const handleEdit = () => {
    setSelectedStaffId(id);
    setEditVisible((v) => !v);
  };

  const handleResetPwd = async () => {
    if (
      await confirmAlert({
        content: `You are about to reset ${
          staff.full_name
        }'s password and PIN. An email  with ${
          staff.gender === "Male" ? "his" : "her"
        } new credentials will be sent to ${
          staff.email
        }. This action cannot be undone. Do you really want to proceed?`,
      })
    ) {
      try {
        await axios.put(`/api/xano/reset_staff_password`, {
          staff_id: staff.id,
          email: staff.email,
          clinic_name: clinic?.name,
          full_name: staff.full_name,
        });
        toast.success(`Password and PIN reset, email sent to ${staff.email}`, {
          containerId: "A",
        });
      } catch (err) {
        if (err instanceof Error) {
          toast.error(`Unable to reset staff password: ${err.message}`, {
            containerId: "A",
          });
        }
      }
    }
  };

  return (
    <tr
      style={{
        color:
          staff.account_status === "Suspended"
            ? "orange"
            : staff.account_status === "Closed"
            ? "red"
            : "",
      }}
    >
      <td>
        <div className="staff-accounts__item-btn-container">
          <EditButton onClick={handleEdit} />
          <Button onClick={handleResetPwd} label="Reset pwd & PIN" />
        </div>
      </td>
      <td>{staff.last_name}</td>
      <td>{staff.first_name}</td>
      <td>{staff.middle_name}</td>
      <td>{staff.site_infos?.name}</td>
      <td>{staff.gender}</td>
      <td>{staff.email}</td>
      <td>{staff.cell_phone}</td>
      <td>{staff.backup_phone}</td>
      <td>{staff.title}</td>
      <td>{staff.speciality}</td>
      <td>{staff.subspeciality}</td>
      <td>{staff.licence_nbr}</td>
      <td>{staff.ohip_billing_nbr}</td>
      <td>{staff.account_status}</td>
      <SignCellMultipleTypes item={staff} />
    </tr>
  );
};

export default StaffAccountItem;
