import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";
import { DemographicsType, DoctorType } from "../../../../../types/api";

type FamilyDoctorsDropDownProps = {
  data: DoctorType[];
  patientId: number;
  demographicsInfos: DemographicsType;
};

const FamilyDoctorsDropDown = ({
  data,
  patientId,
  demographicsInfos,
}: FamilyDoctorsDropDownProps) => {
  const { staffInfos } = useStaffInfosContext();
  const patientClinicDoctors = staffInfos.filter(
    (staff) => staff.title === "Doctor" && staff.patients.includes(patientId)
  );
  return (
    <div className="topic-content">
      <p style={{ fontWeight: "bold" }}>External</p>
      {data && data.length > 0 ? (
        <ul>
          {data.slice(0, 4).map((item) => (
            <li key={item.id} className="topic-content__item">
              - Dr. {item.FirstName} {item.LastName}, {item.speciality},{" "}
              {item.Address?.Structured?.City},{" "}
              {toCodeTableName(
                provinceStateTerritoryCT,
                item.Address?.Structured?.CountrySubDivisionCode
              )}
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No external family doctors/specialists"
      )}
      <p style={{ fontWeight: "bold" }}>Clinic</p>
      {patientClinicDoctors &&
        (patientClinicDoctors.length > 0 ? (
          <ul>
            {patientClinicDoctors.slice(0, 4).map((item) => (
              <li key={item.id} className="topic-content__item">
                - Dr. {item.first_name} {item.last_name}, {item.speciality}
                {demographicsInfos.assigned_staff_id === item.id
                  ? " (assigned)"
                  : ""}
              </li>
            ))}
            <li>...</li>
          </ul>
        ) : (
          "No clinic family doctors/specialist"
        ))}
    </div>
  );
};

export default FamilyDoctorsDropDown;
