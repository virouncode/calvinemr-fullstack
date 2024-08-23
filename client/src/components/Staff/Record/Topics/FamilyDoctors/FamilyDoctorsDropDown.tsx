import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";
import { DoctorType, XanoPaginatedType } from "../../../../../types/api";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type FamilyDoctorsDropDownProps = {
  patientDoctors:
    | InfiniteData<XanoPaginatedType<DoctorType>, unknown>
    | undefined;
  isPending: boolean;
  error: Error | null;
  patientId: number;
};

const FamilyDoctorsDropDown = ({
  patientDoctors,
  isPending,
  error,
  patientId,
}: FamilyDoctorsDropDownProps) => {
  const { staffInfos } = useStaffInfosContext();
  const patientClinicDoctors = staffInfos.filter(
    (staff) => staff.title === "Doctor" && staff.patients.includes(patientId)
  );

  if (isPending)
    return (
      <div className="topic-content">
        <CircularProgressMedium />
      </div>
    );
  if (error)
    return (
      <div className="topic-content">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  const patientDoctorsDatas = patientDoctors?.pages.flatMap(
    (page) => page.items
  );
  return (
    <div className="topic-content">
      <p style={{ fontWeight: "bold" }}>External</p>
      {patientDoctorsDatas && patientDoctorsDatas.length > 0 ? (
        <ul>
          {patientDoctorsDatas.slice(0, 4).map((item) => (
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
