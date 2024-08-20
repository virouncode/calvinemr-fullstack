import React from "react";
import avatar from "../../../../assets/img/avatar.png";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import {
  genderCT,
  personStatusCT,
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../omdDatas/codesTables";
import { DemographicsType } from "../../../../types/api";
import {
  getAgeTZ,
  timestampToDateISOTZ,
} from "../../../../utils/dates/formatDates";
import { isObjectEmpty } from "../../../../utils/js/isObjectEmpty";
import { emergencyContactCaption } from "../../../../utils/names/emergencyContactCaption";
import { enrolmentCaption } from "../../../../utils/names/enrolmentCaption";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";

type ExportDemographicsProps = {
  demographicsInfos: DemographicsType;
};

const ExportDemographics = ({ demographicsInfos }: ExportDemographicsProps) => {
  const { staffInfos } = useStaffInfosContext();
  const emergencyContact = demographicsInfos.Contact?.find(
    (contact) => contact.ContactPurpose.PurposeAsEnum === "EC"
  );
  const residencialAddress = demographicsInfos.Address?.find(
    ({ _addressType }) => _addressType === "R"
  )?.Structured;
  const firstName = demographicsInfos.Names?.LegalName?.FirstName?.Part;
  const middleName = demographicsInfos.Names?.LegalName?.OtherName?.[0]?.Part;
  const lastName = demographicsInfos.Names?.LegalName?.LastName?.Part;
  const nickName =
    demographicsInfos.Names?.OtherNames?.[0]?.OtherName?.[0]?.Part;

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
    backgroundColor: "#495867",
  };
  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>DEMOGRAPHICS</p>
      <div className="topic-content topic-content--demographics">
        {!isObjectEmpty(demographicsInfos) && (
          <>
            <div className="topic-content__infos topic-content__infos--export">
              <p>
                <label>Name Prefix: </label>
                {demographicsInfos.Names?.NamePrefix || ""}
              </p>
              <p>
                <label>First Name: </label>
                {firstName || ""}
              </p>
              <p>
                <label>Middle Name: </label>
                {middleName || ""}
              </p>
              <p>
                <label>Last Name: </label>
                {lastName || ""}
              </p>
              <p>
                <label>Name Suffix: </label>
                {demographicsInfos.Names?.LastNameSuffix || ""}
              </p>
              <p>
                <label>Nick Name: </label>
                {nickName || ""}
              </p>
              <p>
                <label>Chart#: </label>
                {demographicsInfos.ChartNumber || ""}
              </p>
              <p>
                <label>Gender: </label>
                {toCodeTableName(genderCT, demographicsInfos.Gender)}
              </p>
              <p>
                <label>Date of birth: </label>
                {timestampToDateISOTZ(demographicsInfos.DateOfBirth)}
              </p>
              <p>
                <label>Age: </label>
                {getAgeTZ(demographicsInfos.DateOfBirth)}
              </p>
              <p>
                <label>Health Card#: </label>
                {demographicsInfos.HealthCard?.Number || ""}
              </p>
              <p>
                <label>Health Card Version: </label>
                {demographicsInfos.HealthCard?.Version || ""}
              </p>
              <p>
                <label>Health Card Province: </label>
                {toCodeTableName(
                  provinceStateTerritoryCT,
                  demographicsInfos.HealthCard?.ProvinceCode
                )}
              </p>
              <p>
                <label>Health Card Expiry: </label>
                {timestampToDateISOTZ(demographicsInfos.HealthCard?.ExpiryDate)}
              </p>
              <p>
                <label>SIN: </label>
                {demographicsInfos.SIN || ""}
              </p>
              <p>
                <label>Email: </label>
                {demographicsInfos.Email || ""}
              </p>
              <p>
                <label>Address: </label>
                {residencialAddress?.Line1 || ""}
              </p>
              <p>
                <label>City: </label>
                {residencialAddress?.City || ""}
              </p>
              <p>
                <label>Province/State: </label>
                {toCodeTableName(
                  provinceStateTerritoryCT,
                  residencialAddress?.CountrySubDivisionCode ?? ""
                )}
              </p>
              <p>
                <label>Postal/Zip Code: </label>
                {residencialAddress?.PostalZipCode?.PostalCode ||
                  residencialAddress?.PostalZipCode?.ZipCode ||
                  ""}
              </p>

              <p>
                <label>Cell Phone: </label>
                {`${
                  demographicsInfos.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "C"
                  )?.phoneNumber || ""
                } ${
                  demographicsInfos.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "C"
                  )?.extension || ""
                }`}
              </p>
              <p>
                <label>Home Phone: </label>
                {`${
                  demographicsInfos.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "R"
                  )?.phoneNumber || ""
                } ${
                  demographicsInfos.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "R"
                  )?.extension || ""
                }`}
              </p>
              <p>
                <label>Work Phone: </label>
                {`${
                  demographicsInfos.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "W"
                  )?.phoneNumber || ""
                } ${
                  demographicsInfos.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "W"
                  )?.extension || ""
                }`}
              </p>
              <p>
                <label>Preferred Official Language: </label>
                {demographicsInfos.PreferredOfficialLanguage}
              </p>
              <p>
                <label>Assigned clinic physician: </label>
                {staffIdToTitleAndName(
                  staffInfos,
                  demographicsInfos.assigned_staff_id
                )}
              </p>
              <p>
                <label>Enrolment: </label>
                {enrolmentCaption(
                  demographicsInfos.Enrolment?.EnrolmentHistory?.sort(
                    (a, b) => a.EnrollmentDate - b.EnrollmentDate
                  ).slice(-1)[0]
                )}
              </p>
              <p>
                <label>Primary Physician: </label>
                {demographicsInfos.PrimaryPhysician?.Name?.FirstName ||
                  "" +
                    " " +
                    demographicsInfos.PrimaryPhysician?.Name?.LastName ||
                  ""}
              </p>
              <p>
                <label>Referred Physician: </label>
                {(demographicsInfos.ReferredPhysician?.FirstName || "") +
                  " " +
                  (demographicsInfos.ReferredPhysician?.LastName || "")}
              </p>
              <p>
                <label>Family Physician: </label>
                {(demographicsInfos.FamilyPhysician?.FirstName || "") +
                  " " +
                  (demographicsInfos.FamilyPhysician?.LastName || "")}
              </p>
              <p>
                <label>Emergency Contact: </label>
                {emergencyContactCaption(emergencyContact)}
              </p>
              <p>
                <label>Status: </label>
                {demographicsInfos.PersonStatusCode?.PersonStatusAsPlainText ||
                  toCodeTableName(
                    personStatusCT,
                    demographicsInfos.PersonStatusCode?.PersonStatusAsEnum
                  )}
              </p>
            </div>
            <div className="topic-content__avatar topic-content__avatar--export">
              {demographicsInfos.avatar ? (
                <img
                  src={`${import.meta.env.VITE_XANO_BASE_URL}${
                    demographicsInfos.avatar.path
                  }`}
                  alt="user-avatar"
                  style={{ width: "200px", height: "200px" }}
                />
              ) : (
                <img src={avatar} alt="user-avatar-placeholder" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExportDemographics;
