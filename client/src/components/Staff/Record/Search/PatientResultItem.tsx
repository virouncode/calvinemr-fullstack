import { Tooltip } from "@mui/material";
import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import useClinicContext from "../../../../hooks/context/useClinicContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../omdDatas/codesTables";
import { DemographicsType } from "../../../../types/api";
import { UserAdminType, UserStaffType } from "../../../../types/app";
import {
  getAgeTZ,
  timestampToDateISOTZ,
} from "../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../utils/names/toPatientName";
import Button from "../../../UI/Buttons/Button";
import { confirmAlert } from "../../../UI/Confirm/ConfirmGlobal";

type PatientResultItemProps = {
  patient: DemographicsType;
  lastPatientRef?: (node: Element | null) => void;
};

const PatientResultItem = ({
  patient,
  lastPatientRef,
}: PatientResultItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType | UserAdminType };
  const { clinic } = useClinicContext();
  const handleResetPwd = async () => {
    if (
      await confirmAlert({
        content: `You are about to reset ${toPatientName(
          patient
        )}'s password and PIN. An email with ${
          patient.Gender === "M" ? "his" : "her"
        } new credentials will be sent to ${
          patient.Email
        }. This action cannot be undone. Do you really want to proceed?`,
      })
    ) {
      try {
        await axios.put(`/api/xano/reset_patient_password`, {
          patient_id: patient.patient_id,
          email: patient.Email,
          clinic_name: clinic?.name,
          full_name: toPatientName(patient),
        });
        toast.success(
          `Password and PIN reset, email sent to ${patient.Email}`,
          {
            containerId: "A",
          }
        );
      } catch (err) {
        if (err instanceof Error) {
          toast.error(`Unable to reset patient password: ${err.message}`, {
            containerId: "A",
          });
        }
      }
    }
  };
  return (
    <tr ref={lastPatientRef}>
      {user.access_level === "admin" && (
        <td>
          <Button label="Reset pwd & PIN" onClick={handleResetPwd} />
        </td>
      )}
      {user.access_level === "admin" ? (
        <td>{patient.Names.LegalName.LastName.Part || ""}</td>
      ) : (
        <td>
          <Tooltip title="Go to EMR" placement="top-start" arrow>
            <NavLink
              to={`/staff/patient-record/${patient.patient_id}`}
              className="record-link"
              // target="_blank"
            >
              {patient.Names.LegalName.LastName.Part || ""}
            </NavLink>
          </Tooltip>
        </td>
      )}
      <td>{patient.Names.LegalName.FirstName.Part || ""}</td>
      <td>{patient.Names.LegalName.OtherName?.[0]?.Part || ""}</td>
      <td>{timestampToDateISOTZ(patient.DateOfBirth)}</td>
      <td>{getAgeTZ(patient.DateOfBirth)}</td>
      <td>{patient.ChartNumber}</td>
      <td>{patient.Email}</td>
      <td>
        {
          patient.PhoneNumber.find(
            ({ _phoneNumberType }) => _phoneNumberType === "C"
          )?.phoneNumber
        }
      </td>
      <td>
        {
          patient.PhoneNumber.find(
            ({ _phoneNumberType }) => _phoneNumberType === "R"
          )?.phoneNumber
        }
      </td>
      <td>
        {
          patient.PhoneNumber.find(
            ({ _phoneNumberType }) => _phoneNumberType === "W"
          )?.phoneNumber
        }
      </td>
      <td>{patient.HealthCard?.Number || ""}</td>
      <td>
        {
          patient.Address.find(({ _addressType }) => _addressType === "R")
            ?.Structured.Line1
        }
      </td>
      <td>
        {patient.Address.find(({ _addressType }) => _addressType === "R")
          ?.Structured.PostalZipCode.PostalCode ||
          patient.Address.find(({ _addressType }) => _addressType === "R")
            ?.Structured.PostalZipCode.ZipCode}
      </td>
      <td>
        {toCodeTableName(
          provinceStateTerritoryCT,
          patient.Address.find(({ _addressType }) => _addressType === "R")
            ?.Structured.CountrySubDivisionCode ?? ""
        )}
      </td>
      <td>
        {
          patient.Address.find(({ _addressType }) => _addressType === "R")
            ?.Structured.City
        }
      </td>
    </tr>
  );
};

export default PatientResultItem;
