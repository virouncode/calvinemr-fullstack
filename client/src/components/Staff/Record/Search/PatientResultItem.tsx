import avatar from "@/assets/img/avatar.png";
import { Tooltip } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { createPortal } from "react-dom";
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
import PatientEdit from "../../../Admin/Patients/PatientEdit";
import Button from "../../../UI/Buttons/Button";
import { confirmAlert } from "../../../UI/Confirm/ConfirmGlobal";
import FakeWindow from "../../../UI/Windows/FakeWindow";

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
  const [editVisible, setEditVisible] = useState(false);
  const fakewindowRoot = document.getElementById("fake-window");

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
  const handleClickEdit = () => {
    setEditVisible((v) => !v);
  };

  return (
    <>
      <tr ref={lastPatientRef}>
        {user.access_level === "admin" && (
          <td>
            <div className="search-patient__item-btn-container">
              <Button label="Edit" onClick={handleClickEdit} />
              <Button label="Reset pwd & PIN" onClick={handleResetPwd} />
            </div>
          </td>
        )}
        {user.access_level === "admin" ? (
          <td>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  borderRadius: "9999px",
                  width: "50px",
                  height: "50px",
                  overflow: "hidden",
                }}
              >
                <img
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  src={patient.avatar ? patient.avatar.url : avatar}
                  alt={patient.Names.LegalName.LastName.Part}
                />
              </div>
              <div>{patient.Names.LegalName.LastName.Part || ""}</div>
            </div>
          </td>
        ) : (
          <td>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  borderRadius: "9999px",
                  width: "50px",
                  height: "50px",
                  overflow: "hidden",
                }}
              >
                <img
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  src={patient.avatar ? patient.avatar.url : avatar}
                  alt={patient.Names.LegalName.LastName.Part}
                />
              </div>
              <Tooltip title="Go to EMR" placement="top-start" arrow>
                <NavLink
                  to={`/staff/patient-record/${patient.patient_id}`}
                  className="record-link"
                  // target="_blank"
                >
                  {patient.Names.LegalName.LastName.Part || ""}
                </NavLink>
              </Tooltip>
            </div>
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
      {fakewindowRoot &&
        editVisible &&
        createPortal(
          <FakeWindow
            title={`EDIT ${toPatientName(patient)} info`}
            width={1000}
            height={700}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 700) / 2}
            color="#94bae8"
            setPopUpVisible={setEditVisible}
          >
            <PatientEdit patient={patient} setEditVisible={setEditVisible} />
          </FakeWindow>,
          fakewindowRoot
        )}
    </>
  );
};

export default PatientResultItem;
