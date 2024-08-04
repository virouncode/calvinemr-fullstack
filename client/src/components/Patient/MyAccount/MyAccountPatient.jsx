import { useNavigate } from "react-router-dom";
import avatarLogo from "../../../assets/img/avatar.png";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  officialLanguageCT,
  personStatusCT,
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../omdDatas/codesTables";
import {
  getAgeTZ,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import { emergencyContactCaption } from "../../../utils/names/emergencyContactCaption";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import Button from "../../UI/Buttons/Button";

const MyAccountPatient = () => {
  //HOOKS
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const navigate = useNavigate();

  const emergencyContact = user.demographics?.Contact?.length
    ? user.demographics?.Contact?.find(
        (contact) => contact.ContactPurpose?.PurposeAsEnum === "EC"
      ) || {}
    : {};

  const handleChangeCredentials = (e) => {
    navigate("/patient/credentials");
  };

  return (
    <div className="patient-account__container">
      {user.demographics && (
        <form className="patient-account__form">
          <div className="patient-account__form-content">
            <div className="patient-account__form-content-column">
              <div className="patient-account__form-content-column-image">
                {user.demographics.avatar ? (
                  <img
                    src={`${import.meta.env.VITE_XANO_BASE_URL}${
                      user.demographics.avatar.path
                    }`}
                    alt="user-avatar"
                  />
                ) : (
                  <img src={avatarLogo} alt="user-avatar-placeholder" />
                )}
              </div>
            </div>
            <div className="patient-account__form-content-column">
              <div className="patient-account__form-content-row">
                <label>Name Prefix: </label>
                {user.demographics.Names?.NamePrefix || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>First Name*: </label>
                {user.demographics.Names?.LegalName?.FirstName?.Part || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Middle Name: </label>
                {user.demographics.Names?.LegalName?.OtherName?.[0]?.Part || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Last Name*: </label>
                {user.demographics.Names?.LegalName?.LastName?.Part || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Name Suffix: </label>
                {user.demographics.Names?.LastNameSuffix || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Nick Name: </label>
                {user.demographics.Names?.OtherNames?.[0]?.OtherName?.[0]
                  ?.Part || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Chart#*: </label>
                {user.demographics.ChartNumber || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Date of birth*: </label>
                {timestampToDateISOTZ(user.demographics.DateOfBirth)}
              </div>
              <div className="patient-account__form-content-row">
                <label>Age: </label>
                {getAgeTZ(user.demographics.DateOfBirth)}
              </div>
              <div className="patient-account__form-content-row">
                <label>Health Card#: </label>
                {user.demographics.HealthCard?.Number || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Health Card Version: </label>
                {user.demographics.HealthCard?.Version || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Health Card Expiry: </label>
                {timestampToDateISOTZ(
                  user.demographics.HealthCard?.ExpiryDate,
                  "America/Toronto"
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Health Card Province: </label>
                {toCodeTableName(
                  provinceStateTerritoryCT,
                  user.demographics.HealthCard?.ProvinceCode
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Gender*: </label>
                {user.demographics.Gender || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>SIN: </label>
                {user.demographics.SIN || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Email*: </label>
                {user.demographics.Email || ""}
              </div>
            </div>
            <div className="patient-account__form-content-column">
              <div className="patient-account__form-content-row">
                <label>Address*: </label>
                {user.demographics.Address?.find(
                  ({ _addressType }) => _addressType === "R"
                )?.Structured?.Line1 || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>City*: </label>
                {user.demographics.Address?.find(
                  ({ _addressType }) => _addressType === "R"
                )?.Structured?.City || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Province/State*: </label>
                {toCodeTableName(
                  provinceStateTerritoryCT,
                  user.demographics.Address?.find(
                    ({ _addressType }) => _addressType === "R"
                  )?.Structured?.CountrySubDivisionCode
                )}
              </div>
              <div className="patient-account__form-content-row patient-account__form-content-row--postal">
                <label>Postal/Zip Code*: </label>
                {user.demographics.Address?.find(
                  ({ _addressType }) => _addressType === "R"
                )?.Structured?.PostalZipCode?.PostalCode ||
                  user.demographics.Address?.find(
                    ({ _addressType }) => _addressType === "R"
                  )?.Structured?.PostalZipCode?.ZipCode ||
                  ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Cell Phone: </label>
                {
                  user.demographics.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "C"
                  )?.phoneNumber
                }
                {user.demographics.PhoneNumber?.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "C"
                )?.extension && (
                  <label
                    style={{
                      marginLeft: "30px",
                      marginRight: "10px",
                      minWidth: "auto",
                    }}
                  >
                    Ext
                  </label>
                )}
                {
                  user.demographics.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "C"
                  )?.extension
                }
              </div>
              <div className="patient-account__form-content-row">
                <label>Home Phone: </label>
                {
                  user.demographics.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "R"
                  )?.phoneNumber
                }
                {user.demographics.PhoneNumber?.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "R"
                )?.extension && (
                  <label
                    style={{
                      marginLeft: "30px",
                      marginRight: "10px",
                      minWidth: "auto",
                    }}
                  >
                    Ext
                  </label>
                )}
                {
                  user.demographics.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "R"
                  )?.extension
                }
              </div>
              <div className="patient-account__form-content-row">
                <label>Work Phone: </label>
                {
                  user.demographics.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "W"
                  )?.phoneNumber
                }
                {user.demographics.PhoneNumber?.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "W"
                )?.extension && (
                  <label
                    style={{
                      marginLeft: "30px",
                      marginRight: "10px",
                      minWidth: "auto",
                    }}
                  >
                    Ext
                  </label>
                )}
                {
                  user.demographics.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "W"
                  )?.extension
                }
              </div>
              <div className="patient-account__form-content-row">
                <label>Preferred Official Language: </label>
                {toCodeTableName(
                  officialLanguageCT,
                  user.demographics.PreferredOfficialLanguage
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Status: </label>
                {toCodeTableName(
                  personStatusCT,
                  user.demographics.PersonStatusCode?.PersonStatusAsEnum
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Assigned Clinic Practitioner*: </label>
                {staffIdToTitleAndName(
                  staffInfos,
                  user.demographics.assigned_staff_id
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Emergency Contact: </label>
                {emergencyContactCaption(emergencyContact)}
              </div>
              <div className="patient-account__form-content-sign">
                <em>
                  If you wish to update your personal information, please ask a
                  staff member for assistance.
                </em>
              </div>
            </div>
          </div>
        </form>
      )}
      <div className="patient-account__btns">
        <Button
          onClick={handleChangeCredentials}
          label="Change login credentials"
        />
      </div>
    </div>
  );
};

export default MyAccountPatient;
