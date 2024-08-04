import { Tooltip } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../../../api/xanoCRUD/xanoPost";
import avatarPlaceholder from "../../../../../assets/img/avatar.png";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { usePatientPut } from "../../../../../hooks/reactquery/mutations/patientsMutations";
import useRetrieveDemographicsFormDatas from "../../../../../hooks/useRetrieveDemographicsFormDatas";
import {
  enrollmentStatusCT,
  genderCT,
  namePrefixCT,
  nameSuffixCT,
  officialLanguageCT,
  personStatusCT,
  provinceStateTerritoryCT,
  terminationReasonCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  getAgeTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToDateTimeSecondsStrTZ,
} from "../../../../../utils/dates/formatDates";
import { getLastUpdate, isUpdated } from "../../../../../utils/dates/updates";
import { emergencyContactCaption } from "../../../../../utils/names/emergencyContactCaption";
import { enrolmentCaption } from "../../../../../utils/names/enrolmentCaption";
import { primaryPhysicianCaption } from "../../../../../utils/names/primaryPhysicianCaption";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { demographicsSchema } from "../../../../../validation/record/demographicsValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import GenericList from "../../../../UI/Lists/GenericList";
import StaffList from "../../../../UI/Lists/StaffList";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import WebcamCapture from "../../../Signup/WebcamCapture";
import EnrolmentHistory from "./EnrolmentHistory";
import NewEnrolmentForm from "./NewEnrolmentForm";

const DemographicsPU = ({
  demographicsInfos,
  patientId,
  setPopUpVisible,
  loadingPatient,
  errPatient,
}) => {
  //============================= STATES ==============================//
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [editVisible, setEditVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [progress, setProgress] = useState(false);
  const [webcamVisible, setWebcamVisible] = useState(false);
  const {
    formDatas,
    setFormDatas,
    residencialAddress,
    emergencyContact,
    lastEnrolment,
  } = useRetrieveDemographicsFormDatas(demographicsInfos);

  const [loadingFile, setLoadingFile] = useState(false);
  const [postalOrZip, setPostalOrZip] = useState(
    residencialAddress?.PostalZipCode?.PostalCode ? "postal" : "zip"
  );
  const [newEnrolmentVisible, setNewEnrolmentVisible] = useState(false);
  const [enrolmentHistoryVisible, setEnrolmentHistoryVisible] = useState(false);

  const patientPut = usePatientPut(patientId);

  const handleChangePostalOrZip = (e) => {
    setErrMsgPost("");
    setPostalOrZip(e.target.value);
    setFormDatas({
      ...formDatas,
      postalCode: "",
      zipCode: "",
    });
  };
  const handleClickNewEnrolment = () => {
    setNewEnrolmentVisible(true);
  };
  const handleClickHistory = () => {
    setEnrolmentHistoryVisible(true);
  };
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "postalCode") {
      postalOrZip === "postal"
        ? setFormDatas({ ...formDatas, postalCode: value })
        : setFormDatas({ ...formDatas, zipCode: value });
      return;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20000000) {
      toast.error("File size exceeds 20Mbs, please choose another file", {
        containerId: "A",
      });
      return;
    }
    setLoadingFile(true);
    // setting up the reader
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      try {
        let fileToUpload = await xanoPost(
          "/upload/attachment",
          "staff",

          { content }
        );
        setFormDatas({ ...formDatas, avatar: fileToUpload });
        setLoadingFile(false);
      } catch (err) {
        toast.error(`Error: unable to load file: ${err.message}`, {
          containerId: "A",
        });
        setLoadingFile(false);
      }
    };
  };
  const handleClose = async () => {
    if (!editVisible) {
      setPopUpVisible(false);
    } else if (
      editVisible &&
      (await confirmAlert({
        content:
          "Do you really want to close the window ? Your changes will be lost",
      }))
    ) {
      setPopUpVisible(false);
    }
  };
  const handleCancel = () => {
    setErrMsgPost("");
    setFormDatas({
      prefix: demographicsInfos.Names?.NamePrefix || "",
      firstName: demographicsInfos.Names?.LegalName?.FirstName?.Part || "",
      middleName:
        demographicsInfos.Names?.LegalName?.OtherName?.[0]?.Part || "",
      lastName: demographicsInfos.Names?.LegalName?.LastName?.Part || "",
      suffix: demographicsInfos.Names?.LastNameSuffix || "",
      nickName:
        demographicsInfos.Names?.OtherNames?.[0]?.OtherName?.[0]?.Part || "",
      chart: demographicsInfos.ChartNumber || "",
      dob: timestampToDateISOTZ(demographicsInfos.DateOfBirth),
      age: getAgeTZ(demographicsInfos.DateOfBirth),
      healthNbr: demographicsInfos.HealthCard?.Number || "",
      healthVersion: demographicsInfos.HealthCard?.Version || "",
      healthExpiry: timestampToDateISOTZ(
        demographicsInfos.HealthCard?.ExpiryDate,
        "America/Toronto"
      ),
      healthProvince: demographicsInfos.HealthCard?.ProvinceCode || "",
      gender: demographicsInfos.Gender || "",
      sin: demographicsInfos.SIN || "",
      email: demographicsInfos.Email || "",
      cellphone:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "C"
        )?.phoneNumber || "",
      cellphoneExt:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "C"
        )?.extension || "",
      homephone:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "R"
        )?.phoneNumber || "",
      homephoneExt:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "R"
        )?.extension || "",
      workphone:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "W"
        )?.phoneNumber || "",
      workphoneExt:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "W"
        )?.extension || "",
      line1: residencialAddress?.Line1 || "",
      province: residencialAddress?.CountrySubDivisionCode || "",
      postalCode: residencialAddress?.PostalZipCode.PostalCode || "",
      zipCode: residencialAddress?.PostalZipCode.ZipCode || "",
      city: residencialAddress?.City || "",
      preferredOff: demographicsInfos.PreferredOfficialLanguage || "",
      status:
        demographicsInfos.PersonStatusCode?.PersonStatusAsEnum ||
        demographicsInfos.PersonStatusCode?.PersonStatusAsPlainText ||
        "",
      assignedMd: demographicsInfos.assigned_staff_id,
      enrolled: "", // A GERER
      pPhysicianFirstName:
        demographicsInfos.PrimaryPhysician?.Name?.FirstName || "",
      pPhysicianLastName:
        demographicsInfos.PrimaryPhysician?.Name?.LastName || "",
      pPhysicianOHIP: demographicsInfos.PrimaryPhysician?.OHIPPhysicianId || "",
      pPhysicianCPSO:
        demographicsInfos.PrimaryPhysician?.PrimaryPhysicianCPSO || "",
      rPhysicianFirstName: demographicsInfos.ReferredPhysician?.FirstName || "",
      rPhysicianLastName: demographicsInfos.ReferredPhysician?.LastName || "",
      fPhysicianFirstName: demographicsInfos.FamilyPhysician?.FirstName || "",
      fPhysicianLastName: demographicsInfos.FamilyPhysician?.LastName || "",
      emergencyFirstName: emergencyContact?.Name?.FirstName || "",
      emergencyMiddleName: emergencyContact?.Name?.MiddleName || "",
      emergencyLastName: emergencyContact?.Name?.LastName || "",
      emergencyEmail: emergencyContact?.EmailAddress || "",
      emergencyPhone:
        emergencyContact?.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "C"
        )?.phoneNumber || "",
      avatar: demographicsInfos.avatar || null,
    });
    setEditVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    try {
      await demographicsSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Formatting
    setFormDatas({
      ...formDatas,
      firstName: firstLetterUpper(formDatas.firstName),
      lastName: firstLetterUpper(formDatas.lastName),
      middleName: firstLetterUpper(formDatas.middleName),
      nickName: firstLetterUpper(formDatas.nickName),
      line1: firstLetterUpper(formDatas.line1),
      city: firstLetterUpper(formDatas.city),
      emergencyFirstName: firstLetterUpper(formDatas.emergencyFirstName),
      emergencyMiddleName: firstLetterUpper(formDatas.emergencyMiddleName),
      emergencyLastName: firstLetterUpper(formDatas.emergencyLastName),
      emergencyEmail: formDatas.emergencyEmail.toLowerCase(),
      pPhysicianFirstName: firstLetterUpper(formDatas.pPhysicianFirstName),
      pPhysicianLastName: firstLetterUpper(formDatas.pPhysicianLastName),
      rPhysicianFirstName: firstLetterUpper(formDatas.rPhysicianFirstName),
      rPhysicianLastName: firstLetterUpper(formDatas.rPhysicianLastName),
      fPhysicianFirstName: firstLetterUpper(formDatas.fPhysicianFirstName),
      fPhysicianLastName: firstLetterUpper(formDatas.fPhysicianLastName),
    });
    const patientToPut = {
      ...demographicsInfos,
      avatar: formDatas.avatar,
      assigned_staff_id: parseInt(formDatas.assignedMd),
      Names: {
        NamePrefix: formDatas.prefix,
        LegalName: {
          ...demographicsInfos.Names?.LegalName,
          FirstName: {
            ...demographicsInfos.Names?.LegalName?.FirstName,
            Part: firstLetterUpper(formDatas.firstName),
          },
          LastName: {
            ...demographicsInfos.Names?.LegalName?.LastName,
            Part: firstLetterUpper(formDatas.lastName),
          },
          OtherName: [
            {
              ...demographicsInfos.Names?.LegalName?.OtherName?.[0],
              Part: firstLetterUpper(formDatas.middleName),
            },
          ],
        },
        OtherNames: [
          {
            ...demographicsInfos.Names?.OtherNames?.[0],
            OtherName: [
              {
                ...demographicsInfos.Names?.OtherNames?.[0]?.OtherName?.[0],
                Part: firstLetterUpper(formDatas.nickName),
              },
            ],
          },
        ],
        LastNameSuffix: formDatas.suffix,
      },
      DateOfBirth: dateISOToTimestampTZ(formDatas.dob),
      DateOfBirthISO: formDatas.dob,
      HealthCard: {
        Number: formDatas.healthNbr,
        Version: formDatas.healthVersion,
        ExpiryDate: dateISOToTimestampTZ(formDatas.healthExpiry),
        ProvinceCode: formDatas.healthProvince,
      },
      ChartNumber: formDatas.chart,
      Gender: formDatas.gender,
      Address: demographicsInfos.Address?.map((address) => {
        return address._addressType !== "R"
          ? address
          : {
              ...residencialAddress,
              Structured: {
                ...residencialAddress?.Structured,
                Line1: firstLetterUpper(formDatas.line1),
                City: firstLetterUpper(formDatas.city),
                CountrySubDivisionCode: formDatas.province,
                PostalZipCode: {
                  PostalCode: formDatas.postalCode,
                  ZipCode: formDatas.zipCode,
                },
              },
              _addressType: "R",
            };
      }),
      PhoneNumber: [
        {
          extension: formDatas.cellphoneExt,
          phoneNumber: formDatas.cellphone,
          _phoneNumberType: "C",
        },
        {
          extension: formDatas.homephoneExt,
          phoneNumber: formDatas.homephone,
          _phoneNumberType: "R",
        },
        {
          extension: formDatas.workphoneExt,
          phoneNumber: formDatas.workphone,
          _phoneNumberType: "W",
        },
      ],
      PreferredOfficialLanguage: formDatas.preferredOff,
      Contact: demographicsInfos.Contact?.map((contact) => {
        return contact.ContactPurpose?.PurposeAsEnum !== "EC"
          ? contact
          : {
              ContactPurpose: {
                ...contact?.ContactPurpose,
                PurposeAsEnum: "EC",
              },
              Name: {
                FirstName: firstLetterUpper(formDatas.emergencyFirstName),
                MiddleName: firstLetterUpper(formDatas.emergencyMiddleName),
                LastName: firstLetterUpper(formDatas.emergencyLastName),
              },
              EmailAddress: formDatas.emergencyEmail.toLowerCase(),
              PhoneNumber: [
                {
                  ...contact?.PhoneNumber?.[0],
                  phoneNumber: formDatas.emergencyPhone,
                },
              ],
            };
      }),
      PrimaryPhysician: {
        Name: {
          FirstName: firstLetterUpper(formDatas.pPhysicianFirstName),
          LastName: firstLetterUpper(formDatas.pPhysicianLastName),
        },
        OHIPPhysicianId: formDatas.pPhysicianOHIP,
        PrimaryPhysicianCPSO: formDatas.pPhysicianCPSO,
      },
      Email: formDatas.email,
      PersonStatusCode: {
        ...demographicsInfos.PersonStatusCode,
        PersonStatusAsEnum: formDatas.status,
      },
      SIN: formDatas.sin,
      ReferredPhysician: {
        FirstName: firstLetterUpper(formDatas.rPhysicianFirstName),
        LastName: firstLetterUpper(formDatas.rPhysicianLastName),
      },
      FamilyPhysician: {
        FirstName: firstLetterUpper(formDatas.fPhysicianFirstName),
        LastName: firstLetterUpper(formDatas.fPhysicianLastName),
      },
      PreferredPharmacy: demographicsInfos.PreferredPharmacy,
      updates: [
        ...demographicsInfos.updates,
        { date_updated: nowTZTimestamp(), updated_by_id: user.id },
      ],
    };
    //Submission
    setProgress(true);
    patientPut.mutate(patientToPut, {
      onSuccess: () => {
        setProgress(false);
        setEditVisible(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  return (
    <>
      <div
        className="demographics-card"
        style={{ border: errMsgPost && "solid 1px red" }}
      >
        <div className="demographics-card__header">
          <h1>
            Patient demographics <i className="fa-regular fa-id-card"></i>
          </h1>
          <div className="demographics-card__btns">
            {!editVisible ? (
              <>
                <EditButton
                  onClick={() => setEditVisible((v) => !v)}
                  disabled={progress}
                />
                <CloseButton onClick={handleClose} disabled={progress} />
              </>
            ) : (
              <>
                <SaveButton
                  onClick={handleSubmit}
                  disabled={loadingFile || progress}
                />
                <CancelButton
                  onClick={handleCancel}
                  disabled={loadingFile || progress}
                />
              </>
            )}
          </div>
        </div>
        {errPatient && <p className="demographics-card__err">{errPatient}</p>}
        {loadingPatient && <LoadingParagraph />}
        {!loadingPatient && !errPatient && (
          <form className="demographics-card__form">
            <div className="demographics-card__content">
              {errMsgPost && editVisible && (
                <p className="demographics-card__err">{errMsgPost}</p>
              )}
              <p>
                <label>Name Prefix: </label>
                {editVisible ? (
                  <GenericList
                    name="prefix"
                    list={namePrefixCT}
                    value={formDatas.prefix}
                    handleChange={handleChange}
                    placeHolder="Choose a name prefix..."
                  />
                ) : (
                  formDatas.prefix
                )}
              </p>
              <p>
                <label htmlFor="first-name">First Name*: </label>
                {editVisible ? (
                  <input
                    type="text"
                    required
                    value={formDatas.firstName}
                    onChange={handleChange}
                    name="firstName"
                    autoComplete="off"
                    id="first-name"
                  />
                ) : (
                  formDatas.firstName
                )}
              </p>
              <p>
                <label htmlFor="middle-name">Middle Name: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.middleName}
                    onChange={handleChange}
                    name="middleName"
                    autoComplete="off"
                    id="middle-name"
                  />
                ) : (
                  formDatas.middleName
                )}
              </p>
              <p>
                <label htmlFor="last-name">Last Name*: </label>
                {editVisible ? (
                  <input
                    type="text"
                    required
                    value={formDatas.lastName}
                    onChange={handleChange}
                    name="lastName"
                    autoComplete="off"
                    id="last-name"
                  />
                ) : (
                  formDatas.lastName
                )}
              </p>
              <p>
                <label>Name Suffix: </label>
                {editVisible ? (
                  <GenericList
                    name="suffix"
                    list={nameSuffixCT}
                    value={formDatas.suffix}
                    handleChange={handleChange}
                    placeHolder="Choose a name suffix..."
                  />
                ) : (
                  formDatas.suffix
                )}
              </p>
              <p>
                <label htmlFor="nick-name">Nick Name: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.nickName}
                    onChange={handleChange}
                    name="nickName"
                    autoComplete="off"
                    id="nick-name"
                  />
                ) : (
                  formDatas.nickName
                )}
              </p>
              <p>
                <label>Chart#*: </label>
                {formDatas.chart}
              </p>
              <p>
                <label htmlFor="dob">Date of birth*: </label>
                {editVisible ? (
                  <input
                    type="date"
                    required
                    value={formDatas.dob}
                    onChange={handleChange}
                    name="dob"
                    max={timestampToDateISOTZ(nowTZTimestamp())}
                    id="dob"
                  />
                ) : (
                  formDatas.dob
                )}
              </p>
              <p>
                <label>Age: </label>
                {getAgeTZ(dateISOToTimestampTZ(formDatas.dob))}
              </p>
              <p>
                <label htmlFor="hcn">Health Card#</label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.healthNbr}
                    onChange={handleChange}
                    name="healthNbr"
                    autoComplete="off"
                    id="hcn"
                  />
                ) : (
                  formDatas.healthNbr
                )}
              </p>
              <p>
                <label htmlFor="hcv">Health Card Version</label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.healthVersion}
                    onChange={handleChange}
                    name="healthVersion"
                    autoComplete="off"
                    id="hcv"
                  />
                ) : (
                  formDatas.healthVersion
                )}
              </p>
              <p>
                <label htmlFor="hce">Health Card Expiry: </label>
                {editVisible ? (
                  <input
                    type="date"
                    value={formDatas.healthExpiry}
                    onChange={handleChange}
                    name="healthExpiry"
                    id="hce"
                  />
                ) : (
                  formDatas.healthExpiry
                )}
              </p>
              <p>
                <label>Health Card Province</label>
                {editVisible ? (
                  <GenericList
                    list={provinceStateTerritoryCT}
                    value={formDatas.healthProvince}
                    name="healthProvince"
                    handleChange={handleChange}
                    noneOption={false}
                  />
                ) : (
                  toCodeTableName(
                    provinceStateTerritoryCT,
                    formDatas.healthProvince
                  )
                )}
              </p>
              <p>
                <label>Gender: </label>
                {editVisible ? (
                  <GenericList
                    list={genderCT}
                    value={formDatas.gender}
                    name="gender"
                    handleChange={handleChange}
                    noneOption={false}
                  />
                ) : (
                  toCodeTableName(genderCT, formDatas.gender)
                )}
              </p>
              <p>
                <label htmlFor="sin">SIN: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.sin}
                    onChange={handleChange}
                    name="sin"
                    autoComplete="off"
                    id="sin"
                    placeholder="xxx xxx xxx"
                  />
                ) : (
                  formDatas.sin
                )}
              </p>
              <p>
                <label>Email: </label>
                {formDatas.email}
              </p>
              <p>
                <label htmlFor="line1">Address*: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.line1}
                    onChange={handleChange}
                    name="line1"
                    autoComplete="off"
                    id="line1"
                  />
                ) : (
                  formDatas.line1
                )}
              </p>
              <p>
                <label htmlFor="city">City: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.city}
                    onChange={handleChange}
                    name="city"
                    autoComplete="off"
                    id="city"
                  />
                ) : (
                  formDatas.city
                )}
              </p>
              <p>
                <label>Province/State*: </label>
                {editVisible ? (
                  <GenericList
                    list={provinceStateTerritoryCT}
                    value={formDatas.province}
                    name="province"
                    handleChange={handleChange}
                  />
                ) : (
                  toCodeTableName(provinceStateTerritoryCT, formDatas.province)
                )}
              </p>
              <p>
                <label htmlFor="postalZipCode">Postal/Zip Code*: </label>
                {editVisible ? (
                  <>
                    <select
                      style={{ width: "60px", marginRight: "10px" }}
                      name="postalOrZip"
                      id="postalOrZip"
                      value={postalOrZip}
                      onChange={handleChangePostalOrZip}
                    >
                      <option value="postal">Postal</option>
                      <option value="zip">Zip</option>
                    </select>
                    <input
                      style={{ width: "90px", marginRight: "10px" }}
                      type="text"
                      value={
                        postalOrZip === "postal"
                          ? formDatas.postalCode
                          : formDatas.zipCode
                      }
                      onChange={handleChange}
                      name="postalCode"
                      autoComplete="off"
                      id="postalZipCode"
                      placeholder={
                        postalOrZip === "postal"
                          ? "A1A 1A1"
                          : "12345 or 12345-6789"
                      }
                    />
                  </>
                ) : postalOrZip === "postal" ? (
                  formDatas.postalCode
                ) : (
                  formDatas.zipCode
                )}
              </p>
              <p>
                <label htmlFor="cellphone">Cell Phone: </label>
                {editVisible ? (
                  <input
                    type="tel"
                    value={formDatas.cellphone}
                    onChange={handleChange}
                    name="cellphone"
                    autoComplete="off"
                    id="cellphone"
                    placeholder="xxx-xxx-xxxx"
                  />
                ) : (
                  formDatas.cellphone
                )}
                {editVisible ? (
                  <>
                    <label
                      htmlFor="cellphoneExt"
                      style={{
                        marginLeft: "30px",
                        marginRight: "10px",
                        minWidth: "auto",
                      }}
                    >
                      Ext
                    </label>
                    <input
                      style={{ width: "15%" }}
                      type="text"
                      value={formDatas.cellphoneExt}
                      onChange={handleChange}
                      name="cellphoneExt"
                      autoComplete="off"
                      id="cellphoneExt"
                    />
                  </>
                ) : (
                  <>
                    {formDatas.cellphoneExt && (
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
                    {formDatas.cellphoneExt}
                  </>
                )}
              </p>
              <p>
                <label htmlFor="homephone">Home Phone: </label>
                {editVisible ? (
                  <input
                    type="tel"
                    value={formDatas.homephone}
                    onChange={handleChange}
                    name="homephone"
                    autoComplete="off"
                    id="homephone"
                    placeholder="xxx-xxx-xxxx"
                  />
                ) : (
                  formDatas.homephone
                )}
                {editVisible ? (
                  <>
                    <label
                      htmlFor="homephoneExt"
                      style={{
                        marginLeft: "30px",
                        marginRight: "10px",
                        minWidth: "auto",
                      }}
                    >
                      Ext
                    </label>
                    <input
                      style={{ width: "15%" }}
                      type="text"
                      value={formDatas.homephoneExt}
                      onChange={handleChange}
                      name="homephoneExt"
                      autoComplete="off"
                      id="homephoneExt"
                    />
                  </>
                ) : (
                  <>
                    {formDatas.homephoneExt && (
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
                    {formDatas.homephoneExt}
                  </>
                )}
              </p>
              <p>
                <label htmlFor="workphone">Work Phone: </label>
                {editVisible ? (
                  <input
                    type="tel"
                    value={formDatas.workphone}
                    onChange={handleChange}
                    name="workphone"
                    autoComplete="off"
                    id="workphone"
                    placeholder="xxx-xxx-xxxx"
                  />
                ) : (
                  formDatas.workphone
                )}
                {editVisible ? (
                  <>
                    <label
                      htmlFor="workphoneExt"
                      style={{
                        marginLeft: "30px",
                        marginRight: "10px",
                        minWidth: "auto",
                      }}
                    >
                      Ext
                    </label>
                    <input
                      style={{ width: "15%" }}
                      type="text"
                      value={formDatas.workphoneExt}
                      onChange={handleChange}
                      name="workphoneExt"
                      autoComplete="off"
                      id="workphoneExt"
                    />
                  </>
                ) : (
                  <>
                    {formDatas.workphoneExt && (
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
                    {formDatas.workphoneExt}
                  </>
                )}
              </p>
              <p>
                <label>Preferred Official Language: </label>
                {editVisible ? (
                  <GenericList
                    list={officialLanguageCT}
                    value={formDatas.preferredOff}
                    name="preferredOff"
                    handleChange={handleChange}
                    noneOption={false}
                  />
                ) : (
                  toCodeTableName(officialLanguageCT, formDatas.preferredOff)
                )}
              </p>
              <p>
                <label>Status: </label>
                {editVisible ? (
                  <GenericList
                    name="status"
                    list={personStatusCT}
                    value={formDatas.status}
                    handleChange={handleChange}
                    placeHolder="Choose a status..."
                    noneOption={false}
                  />
                ) : (
                  toCodeTableName(personStatusCT, formDatas.status)
                )}
              </p>
              <p>
                <label>Assigned Clinic Physician: </label>
                {editVisible ? (
                  <StaffList
                    value={formDatas.assignedMd}
                    name="assignedMd"
                    handleChange={handleChange}
                  />
                ) : (
                  staffIdToTitleAndName(staffInfos, formDatas.assignedMd)
                )}
              </p>
              <p>
                <label>Enrolled to physician: </label>
                {enrolmentCaption(lastEnrolment)}
                {"  "}
                <Tooltip title="Add new enrolment" placement="top-start" arrow>
                  <i
                    className="fa-regular fa-square-plus"
                    onClick={handleClickNewEnrolment}
                    style={{ marginLeft: "5px", cursor: "pointer" }}
                  ></i>
                </Tooltip>
                <Tooltip
                  title="See enrolment history"
                  placement="top-start"
                  arrow
                >
                  <i
                    className="fa-solid fa-clock-rotate-left"
                    onClick={handleClickHistory}
                    style={{ marginLeft: "5px", cursor: "pointer" }}
                  ></i>
                </Tooltip>
              </p>
              <p>
                <label>Enrollment status: </label>
                {toCodeTableName(
                  enrollmentStatusCT,
                  lastEnrolment?.EnrollmentStatus
                )}
              </p>
              <p>
                <label>Enrollment date: </label>
                {timestampToDateISOTZ(lastEnrolment?.EnrollmentDate)}
              </p>
              <p>
                <label>Enrollment termination date: </label>
                {timestampToDateISOTZ(lastEnrolment?.EnrollmentTerminationDate)}
              </p>
              <p>
                <label>Termination reason: </label>
                {toCodeTableName(
                  terminationReasonCT,
                  lastEnrolment?.TerminationReason
                )}
              </p>
              {editVisible ? (
                <fieldset>
                  <legend>Primary Physician</legend>
                  <p className="demographics-card__row-special">
                    <label htmlFor="primary-first-name">First Name: </label>
                    <input
                      type="text"
                      value={formDatas.pPhysicianFirstName}
                      onChange={handleChange}
                      name="pPhysicianFirstName"
                      autoComplete="off"
                      id="primary-first-name"
                    />
                    <label htmlFor="primary-last-name">Last Name: </label>
                    <input
                      type="text"
                      value={formDatas.pPhysicianLastName}
                      onChange={handleChange}
                      name="pPhysicianLastName"
                      autoComplete="off"
                      id="primary-last-name"
                    />
                  </p>
                  <p className="demographics-card__row-special">
                    <label htmlFor="primary-ohip">OHIP#: </label>
                    <input
                      type="text"
                      value={formDatas.pPhysicianOHIP}
                      onChange={handleChange}
                      name="pPhysicianOHIP"
                      autoComplete="off"
                      id="primary-ohip"
                    />
                    <label htmlFor="primary-cpso">CPSO: </label>
                    <input
                      type="text"
                      value={formDatas.pPhysicianCPSO}
                      onChange={handleChange}
                      name="pPhysicianCPSO"
                      autoComplete="off"
                      id="primary-cpso"
                    />
                  </p>
                </fieldset>
              ) : (
                <p>
                  <label>Primary Physician: </label>
                  {primaryPhysicianCaption(demographicsInfos.PrimaryPhysician)}
                </p>
              )}
              {editVisible ? (
                <fieldset>
                  <legend>Referred Physician</legend>
                  <p className="demographics-card__row-special">
                    <label htmlFor="referred-first-name">First Name: </label>
                    <input
                      type="text"
                      value={formDatas.rPhysicianFirstName}
                      onChange={handleChange}
                      name="rPhysicianFirstName"
                      autoComplete="off"
                      id="referred-first-name"
                    />
                    <label htmlFor="referred-last-name">Last Name: </label>
                    <input
                      type="text"
                      value={formDatas.rPhysicianLastName}
                      onChange={handleChange}
                      name="rPhysicianLastName"
                      autoComplete="off"
                      id="referred-last-name"
                    />
                  </p>
                </fieldset>
              ) : (
                <p>
                  <label>Referred Physician: </label>
                  {demographicsInfos.ReferredPhysician?.FirstName}{" "}
                  {demographicsInfos.ReferredPhysician?.LastName}
                </p>
              )}
              {editVisible ? (
                <fieldset>
                  <legend>Family Physician</legend>
                  <p className="demographics-card__row-special">
                    <label>First Name: </label>
                    <input
                      type="text"
                      value={formDatas.fPhysicianFirstName}
                      onChange={handleChange}
                      name="fPhysicianFirstName"
                      autoComplete="off"
                    />
                    <label>Last Name: </label>
                    <input
                      type="text"
                      value={formDatas.fPhysicianLastName}
                      onChange={handleChange}
                      name="fPhysicianLastName"
                      autoComplete="off"
                    />
                  </p>
                </fieldset>
              ) : (
                <p>
                  <label>Family Physician: </label>
                  {demographicsInfos.FamilyPhysician?.FirstName}{" "}
                  {demographicsInfos.FamilyPhysician?.LastName}
                </p>
              )}
              {editVisible ? (
                <fieldset>
                  <legend>Emergency Contact</legend>
                  <p className="demographics-card__row-special">
                    <label htmlFor="emergency-first-name">First Name: </label>
                    <input
                      type="text"
                      value={formDatas.emergencyFirstName}
                      onChange={handleChange}
                      name="emergencyFirstName"
                      autoComplete="off"
                      id="emergency-first-name"
                    />
                    <label htmlFor="emergency-middle-name">Middle Name: </label>
                    <input
                      type="text"
                      value={formDatas.emergencyMiddleName}
                      onChange={handleChange}
                      name="emergencyMiddleName"
                      autoComplete="off"
                      id="emergency-middle-name"
                    />
                    <label htmlFor="emergency-last-name">Last Name: </label>
                    <input
                      type="text"
                      value={formDatas.emergencyLastName}
                      onChange={handleChange}
                      name="emergencyLastName"
                      autoComplete="off"
                      id="emergency-last-name"
                    />
                  </p>
                  <p className="demographics-card__row-special">
                    <label htmlFor="emergency-email">Email: </label>
                    <input
                      type="email"
                      value={formDatas.emergencyEmail}
                      onChange={handleChange}
                      name="emergencyEmail"
                      autoComplete="off"
                      id="emergency-email"
                    />
                    <label htmlFor="emergency-phone">Phone: </label>
                    <input
                      type="text"
                      value={formDatas.emergencyPhone}
                      onChange={handleChange}
                      name="emergencyPhone"
                      autoComplete="off"
                      id="emergency-phone"
                      placeholder="xxx-xxx-xxxx"
                    />
                  </p>
                </fieldset>
              ) : (
                <p>
                  <label>Emergency Contact: </label>
                  {emergencyContactCaption(emergencyContact)}
                </p>
              )}
            </div>

            <div className="demographics-card__image">
              <div className="demographics-card__image-preview">
                <div className="demographics-card__image-preview-square">
                  {formDatas.avatar ? (
                    <img
                      src={`${import.meta.env.VITE_XANO_BASE_URL}${
                        formDatas.avatar.path
                      }`}
                      alt="user-avatar"
                    />
                  ) : (
                    <img
                      src={avatarPlaceholder}
                      alt="user-avatar-placeholder"
                    />
                  )}
                </div>
                {editVisible && (
                  <i
                    className="fa-solid fa-camera"
                    onClick={() => setWebcamVisible((v) => !v)}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
              {editVisible && (
                <div className="signup-patient__image-options">
                  <p>Choose a picture</p>
                  <input
                    name="avatar"
                    type="file"
                    accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg"
                    onChange={handleAvatarChange}
                  />
                </div>
              )}
            </div>
          </form>
        )}
        <p className="demographics-card__sign">
          {isUpdated(demographicsInfos) ? (
            <em>
              Updated by{" "}
              {staffIdToTitleAndName(
                staffInfos,
                getLastUpdate(demographicsInfos).updated_by_id
              )}{" "}
              on{" "}
              {timestampToDateTimeSecondsStrTZ(
                getLastUpdate(demographicsInfos).date_updated
              )}
            </em>
          ) : (
            <em>
              Created by{" "}
              {staffIdToTitleAndName(
                staffInfos,
                demographicsInfos.created_by_id
              )}{" "}
              on{" "}
              {timestampToDateTimeSecondsStrTZ(demographicsInfos.date_created)}
            </em>
          )}
        </p>
      </div>
      {newEnrolmentVisible && (
        <FakeWindow
          title={`NEW ENROLMENT`}
          width={500}
          height={400}
          x={(window.innerWidth - 500) / 2}
          y={(window.innerHeight - 400) / 2}
          color="#495867"
          setPopUpVisible={setNewEnrolmentVisible}
        >
          <NewEnrolmentForm
            setNewEnrolmentVisible={setNewEnrolmentVisible}
            demographicsInfos={demographicsInfos}
          />
        </FakeWindow>
      )}
      {enrolmentHistoryVisible && (
        <FakeWindow
          title={`ENROLMENT HISTORY of ${toPatientName(demographicsInfos)}`}
          width={1100}
          height={400}
          x={(window.innerWidth - 1100) / 2}
          y={(window.innerHeight - 400) / 2}
          color="#495867"
          setPopUpVisible={setEnrolmentHistoryVisible}
        >
          <EnrolmentHistory
            enrolmentHistory={demographicsInfos.Enrolment.EnrolmentHistory.sort(
              (a, b) => b.EnrollmentDate - a.EnrollmentDate
            )}
            demographicsInfos={demographicsInfos}
          />
        </FakeWindow>
      )}
      {webcamVisible && (
        <FakeWindow
          title="TAKE A PICTURE WITH YOUR WEBCAM"
          width={480}
          height={500}
          x={(window.innerWidth - 480) / 2}
          y={(window.innerHeight - 500) / 2}
          color="#94bae8"
          setPopUpVisible={setWebcamVisible}
        >
          <WebcamCapture
            setFormDatas={setFormDatas}
            setWebcamVisible={setWebcamVisible}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default DemographicsPU;
