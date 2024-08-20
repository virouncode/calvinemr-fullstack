import React from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { usePatientDoctors } from "../../../../hooks/reactquery/queries/patientDoctorsQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../omdDatas/codesTables";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";

type ExportFamilyDoctorsProps = {
  patientId: number;
};

const ExportFamilyDoctors = ({ patientId }: ExportFamilyDoctorsProps) => {
  const { staffInfos } = useStaffInfosContext();
  const CARD_STYLE = {
    width: "95%",
    margin: "20px auto",
    border: "solid 1px #cecdcd",
    borderRadius: "6px",
    overflow: "hidden",
    fontFamily: "Lato, Arial,sans-serif",
  };
  const TITLE_STYLE = {
    fontWeight: "bold",
    padding: "10px",
    color: "#FEFEFE",
    backgroundColor: "#21201E",
  };
  const CONTENT_STYLE = {
    padding: "10px",
  };
  //PATIENT DOCTORS
  const {
    data: patientDoctors,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
  } = usePatientDoctors(patientId);

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending)
    return (
      <div className="topic-content">
        <LoadingParagraph />
      </div>
    );
  if (error)
    return (
      <div className="topic-content">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  const patientClinicDoctors = staffInfos.filter(
    (staff) => staff.title === "Doctor" && staff.patients.includes(patientId)
  );
  const patientDoctorsDatas = patientDoctors.pages.flatMap(
    (page) => page.items
  );

  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>FAMILY DOCTORS & SPECIALISTS</p>
      <div style={CONTENT_STYLE}>
        {patientDoctorsDatas.length > 0 || patientClinicDoctors.length > 0 ? (
          <ul className="export__list">
            {patientDoctorsDatas.length > 0 &&
              patientDoctorsDatas.map((item) => (
                <li className="export__list-item" key={item.id}>
                  - Dr. {item.FirstName} {item.LastName}, {item.speciality},{" "}
                  {item.Address?.Structured?.City},{" "}
                  {toCodeTableName(
                    provinceStateTerritoryCT,
                    item.Address?.Structured?.CountrySubDivisionCode
                  )}
                </li>
              ))}
            {patientClinicDoctors.length > 0 &&
              patientClinicDoctors.map((item) => (
                <li className="export__list-item" key={item.id}>
                  - Dr. {item.first_name} {item.last_name}, {item.speciality},{" "}
                  {item.site_infos?.city},{" "}
                  {toCodeTableName(
                    provinceStateTerritoryCT,
                    item.site_infos?.province_state ?? ""
                  )}
                </li>
              ))}
          </ul>
        ) : (
          "No family doctors/specialists"
        )}
      </div>
    </div>
  );
};

export default ExportFamilyDoctors;
