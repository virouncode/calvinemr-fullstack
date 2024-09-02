import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../../../api/xanoCRUD/xanoPost";
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
  AttachmentType,
  DemographicsFormType,
  DemographicsType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
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
import CancelButton from "../../../../UI/Buttons/CancelButton";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ClockIcon from "../../../../UI/Icons/ClockIcon";
import SquarePlusIcon from "../../../../UI/Icons/SquarePlusIcon";
import Input from "../../../../UI/Inputs/Input";
import InputDateToggle from "../../../../UI/Inputs/InputDateToggle";
import InputEmail from "../../../../UI/Inputs/InputEmail";
import InputTel from "../../../../UI/Inputs/InputTel";
import InputTelExtToggle from "../../../../UI/Inputs/InputTelExtToggle";
import InputTelToggle from "../../../../UI/Inputs/InputTelToggle";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import GenericListToggle from "../../../../UI/Lists/GenericListToggle";
import PostalZipSelect from "../../../../UI/Lists/PostalZipSelect";
import StaffList from "../../../../UI/Lists/StaffList";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import WebcamCapture from "../../../Signup/WebcamCapture";
import DemographicsAvatar from "./DemographicsAvatar";
import EnrolmentHistory from "./EnrolmentHistory";
import NewEnrolmentForm from "./NewEnrolmentForm";

type DemographicsPopUpProps = {
  demographicsInfos: DemographicsType;
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const DemographicsPopUp = ({
  demographicsInfos,
  patientId,
  setPopUpVisible,
}: DemographicsPopUpProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
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
  //Queries
  const patientPut = usePatientPut(patientId);

  const handleChangePostalOrZip = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setErrMsgPost("");
    setPostalOrZip(e.target.value);
    setFormDatas({
      ...(formDatas as DemographicsFormType),
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    const value = e.target.value;
    const name = e.target.name;
    if (name === "postalCode") {
      postalOrZip === "postal"
        ? setFormDatas({
            ...(formDatas as DemographicsFormType),
            postalCode: value,
          })
        : setFormDatas({
            ...(formDatas as DemographicsFormType),
            zipCode: value,
          });
      return;
    }
    setFormDatas({ ...(formDatas as DemographicsFormType), [name]: value });
  };
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20000000) {
      toast.error("File size exceeds 20Mbs, please choose another file", {
        containerId: "A",
      });
      return;
    }
    setLoadingFile(true);
    // setting up the reader
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      const content = e.target?.result; // this is the content!
      try {
        const fileToUpload: AttachmentType = await xanoPost(
          "/upload/attachment",
          "staff",

          { content }
        );
        setFormDatas({
          ...(formDatas as DemographicsFormType),
          avatar: fileToUpload,
        });
        setLoadingFile(false);
      } catch (err) {
        if (err instanceof Error)
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

  const handleSubmit = async () => {
    // Validation
    try {
      await demographicsSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    //Formatting
    setFormDatas({
      ...(formDatas as DemographicsFormType),
      firstName: firstLetterUpper(formDatas?.firstName ?? ""),
      lastName: firstLetterUpper(formDatas?.lastName ?? ""),
      middleName: firstLetterUpper(formDatas?.middleName ?? ""),
      nickName: firstLetterUpper(formDatas?.nickName ?? ""),
      line1: firstLetterUpper(formDatas?.line1 ?? ""),
      city: firstLetterUpper(formDatas?.city ?? ""),
      emergencyFirstName: firstLetterUpper(formDatas?.emergencyFirstName ?? ""),
      emergencyMiddleName: firstLetterUpper(
        formDatas?.emergencyMiddleName ?? ""
      ),
      emergencyLastName: firstLetterUpper(formDatas?.emergencyLastName ?? ""),
      emergencyEmail: formDatas?.emergencyEmail.toLowerCase() ?? "",
      pPhysicianFirstName: firstLetterUpper(
        formDatas?.pPhysicianFirstName ?? ""
      ),
      pPhysicianLastName: firstLetterUpper(formDatas?.pPhysicianLastName ?? ""),
      rPhysicianFirstName: firstLetterUpper(
        formDatas?.rPhysicianFirstName ?? ""
      ),
      rPhysicianLastName: firstLetterUpper(formDatas?.rPhysicianLastName ?? ""),
      fPhysicianFirstName: firstLetterUpper(
        formDatas?.fPhysicianFirstName ?? ""
      ),
      fPhysicianLastName: firstLetterUpper(formDatas?.fPhysicianLastName ?? ""),
    });
    const patientToPut: DemographicsType = {
      ...demographicsInfos,
      avatar: formDatas?.avatar ?? null,
      assigned_staff_id: formDatas?.assignedMd ?? 0,
      Names: {
        NamePrefix: formDatas?.prefix ?? "",
        LegalName: {
          ...demographicsInfos.Names?.LegalName,
          FirstName: {
            ...demographicsInfos.Names?.LegalName?.FirstName,
            Part: firstLetterUpper(formDatas?.firstName ?? ""),
          },
          LastName: {
            ...demographicsInfos.Names?.LegalName?.LastName,
            Part: firstLetterUpper(formDatas?.lastName ?? ""),
          },
          OtherName: [
            {
              ...demographicsInfos.Names?.LegalName?.OtherName?.[0],
              Part: firstLetterUpper(formDatas?.middleName ?? ""),
            },
          ],
        },
        OtherNames: [
          {
            ...demographicsInfos.Names?.OtherNames?.[0],
            OtherName: [
              {
                ...demographicsInfos.Names?.OtherNames?.[0]?.OtherName?.[0],
                Part: firstLetterUpper(formDatas?.nickName ?? ""),
              },
            ],
          },
        ],
        LastNameSuffix: formDatas?.suffix ?? "",
      },
      DateOfBirth: dateISOToTimestampTZ(formDatas?.dob) ?? null,
      DateOfBirthISO: formDatas?.dob ?? "",
      HealthCard: {
        Number: formDatas?.healthNbr ?? "",
        Version: formDatas?.healthVersion ?? "",
        ExpiryDate: dateISOToTimestampTZ(formDatas?.healthExpiry) ?? null,
        ProvinceCode: formDatas?.healthProvince ?? "",
      },
      ChartNumber: formDatas?.chart ?? "",
      Gender: formDatas?.gender ?? "M",
      Address: demographicsInfos.Address?.map((address) => {
        return address._addressType !== "R"
          ? address
          : {
              Structured: {
                ...(residencialAddress as {
                  Line1: string;
                  Line2: string;
                  Line3: string;
                  City: string;
                  CountrySubDivisionCode: string;
                  PostalZipCode: {
                    PostalCode: string;
                    ZipCode: string;
                  };
                }),
                Line1: firstLetterUpper(formDatas?.line1 ?? ""),
                City: firstLetterUpper(formDatas?.city ?? ""),
                CountrySubDivisionCode: formDatas?.province ?? "",
                PostalZipCode: {
                  PostalCode: formDatas?.postalCode ?? "",
                  ZipCode: formDatas?.zipCode ?? "",
                },
              },
              _addressType: "R",
            };
      }),
      PhoneNumber: [
        {
          extension: formDatas?.cellphoneExt ?? "",
          phoneNumber: formDatas?.cellphone ?? "",
          _phoneNumberType: "C",
        },
        {
          extension: formDatas?.homephoneExt ?? "",
          phoneNumber: formDatas?.homephone ?? "",
          _phoneNumberType: "R",
        },
        {
          extension: formDatas?.workphoneExt ?? "",
          phoneNumber: formDatas?.workphone ?? "",
          _phoneNumberType: "W",
        },
      ],
      PreferredOfficialLanguage: formDatas?.preferredOff ?? "",
      Contact: demographicsInfos.Contact?.map((contact) => {
        return contact.ContactPurpose?.PurposeAsEnum !== "EC"
          ? contact
          : {
              ContactPurpose: {
                ...contact?.ContactPurpose,
                PurposeAsEnum: "EC",
              },
              Name: {
                FirstName: firstLetterUpper(
                  formDatas?.emergencyFirstName ?? ""
                ),
                MiddleName: firstLetterUpper(
                  formDatas?.emergencyMiddleName ?? ""
                ),
                LastName: firstLetterUpper(formDatas?.emergencyLastName ?? ""),
              },
              EmailAddress: formDatas?.emergencyEmail.toLowerCase() ?? "",
              PhoneNumber: [
                {
                  ...contact?.PhoneNumber?.[0],
                  phoneNumber: formDatas?.emergencyPhone ?? "",
                },
              ],
              Note: "",
            };
      }),
      PrimaryPhysician: {
        Name: {
          FirstName: firstLetterUpper(formDatas?.pPhysicianFirstName ?? ""),
          LastName: firstLetterUpper(formDatas?.pPhysicianLastName ?? ""),
        },
        OHIPPhysicianId: formDatas?.pPhysicianOHIP ?? "",
        PrimaryPhysicianCPSO: formDatas?.pPhysicianCPSO ?? "",
      },
      Email: formDatas?.email ?? "",
      PersonStatusCode: {
        ...demographicsInfos.PersonStatusCode,
        PersonStatusAsEnum: formDatas?.status ?? "",
      },
      SIN: formDatas?.sin ?? "",
      ReferredPhysician: {
        FirstName: firstLetterUpper(formDatas?.rPhysicianFirstName ?? ""),
        LastName: firstLetterUpper(formDatas?.rPhysicianLastName ?? ""),
      },
      FamilyPhysician: {
        FirstName: firstLetterUpper(formDatas?.fPhysicianFirstName ?? ""),
        LastName: firstLetterUpper(formDatas?.fPhysicianLastName ?? ""),
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
        setEditVisible(false);
      },
      onSettled: () => {
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
          <h1>Patient demographics</h1>
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

        {errMsgPost && editVisible && <ErrorParagraph errorMsg={errMsgPost} />}

        <form className="demographics-card__form">
          <div className="demographics-card__content">
            <div className="demographics-card__content-row">
              <GenericListToggle
                label="Name Prefix:"
                name="prefix"
                list={namePrefixCT}
                value={formDatas?.prefix ?? ""}
                handleChange={handleChange}
                placeHolder="Choose a name prefix..."
                editVisible={editVisible}
                noneOption={false}
              />
            </div>
            <div className="demographics-card__content-row">
              <InputTextToggle
                value={formDatas?.firstName ?? ""}
                onChange={handleChange}
                name="firstName"
                id="first-name"
                label="First Name*:"
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <InputTextToggle
                value={formDatas?.middleName ?? ""}
                onChange={handleChange}
                name="middleName"
                id="middle-name"
                label="Middle Name:"
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <InputTextToggle
                value={formDatas?.lastName ?? ""}
                onChange={handleChange}
                name="lastName"
                id="last-name"
                label="Last Name*:"
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <GenericListToggle
                label="Name Suffix:"
                name="suffix"
                list={nameSuffixCT}
                value={formDatas?.suffix ?? ""}
                handleChange={handleChange}
                placeHolder="Choose a name suffix..."
                editVisible={editVisible}
                noneOption={false}
              />
            </div>
            <div className="demographics-card__content-row">
              <InputTextToggle
                label="Nick Name:"
                value={formDatas?.nickName ?? ""}
                onChange={handleChange}
                name="nickName"
                id="nick-name"
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <label>Chart#*: </label>
              <p>{formDatas?.chart}</p>
            </div>
            <div className="demographics-card__content-row">
              <InputDateToggle
                label="Date of birth*:"
                value={formDatas?.dob ?? ""}
                onChange={handleChange}
                name="dob"
                max={timestampToDateISOTZ(nowTZTimestamp())}
                id="dob"
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <label>Age: </label>
              <p>{getAgeTZ(dateISOToTimestampTZ(formDatas?.dob))}</p>
            </div>
            <div className="demographics-card__content-row">
              <InputTextToggle
                label="Health Card#:"
                value={formDatas?.healthNbr ?? ""}
                onChange={handleChange}
                name="healthNbr"
                id="hcn"
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <InputTextToggle
                label="Health Card Version:"
                value={formDatas?.healthVersion ?? ""}
                onChange={handleChange}
                name="healthVersion"
                id="hcv"
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <InputDateToggle
                label="Health Card Expiry:"
                value={formDatas?.healthExpiry ?? ""}
                onChange={handleChange}
                name="healthExpiry"
                id="hce"
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <GenericListToggle
                label="Health Card Province:"
                list={provinceStateTerritoryCT}
                value={formDatas?.healthProvince ?? ""}
                name="healthProvince"
                handleChange={handleChange}
                noneOption={false}
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <GenericListToggle
                label="Gender:"
                list={genderCT}
                value={formDatas?.gender ?? "M"}
                name="gender"
                handleChange={handleChange}
                noneOption={false}
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <InputTextToggle
                label="SIN:"
                value={formDatas?.sin ?? ""}
                onChange={handleChange}
                name="sin"
                id="sin"
                editVisible={editVisible}
                placeholder="xxx xxx xxx"
              />
            </div>
            <div className="demographics-card__content-row">
              <label>Email: </label>
              <p>{formDatas?.email}</p>
            </div>
            <div className="demographics-card__content-row">
              <InputTextToggle
                label="Address*:"
                value={formDatas?.line1 ?? ""}
                onChange={handleChange}
                name="line1"
                id="line1"
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <InputTextToggle
                label="City*:"
                value={formDatas?.city ?? ""}
                onChange={handleChange}
                name="city"
                id="city"
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <GenericListToggle
                label="Province/State*"
                list={provinceStateTerritoryCT}
                value={formDatas?.province ?? ""}
                name="province"
                handleChange={handleChange}
                noneOption={false}
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              {editVisible ? (
                <>
                  <PostalZipSelect
                    onChange={handleChangePostalOrZip}
                    postalOrZip={postalOrZip}
                  />
                  <Input
                    value={
                      postalOrZip === "postal"
                        ? formDatas?.postalCode ?? ""
                        : formDatas?.zipCode ?? ""
                    }
                    onChange={handleChange}
                    name="postalCode"
                    id="postalZipCode"
                    width={68}
                    placeholder={
                      postalOrZip === "postal"
                        ? "A1A 1A1"
                        : "12345 or 12345-6789"
                    }
                  />
                </>
              ) : (
                <p>
                  {postalOrZip === "postal"
                    ? formDatas?.postalCode
                    : formDatas?.zipCode}
                </p>
              )}
            </div>
            <div className="demographics-card__content-row">
              <InputTelToggle
                label="Cell Phone*:"
                value={formDatas?.cellphone ?? ""}
                onChange={handleChange}
                name="cellphone"
                id="cellphone"
                placeholder="xxx-xxx-xxxx"
                editVisible={editVisible}
              />
              <InputTelExtToggle
                id="cellphoneExt"
                name="cellphoneExt"
                value={formDatas?.cellphoneExt ?? ""}
                onChange={handleChange}
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <InputTelToggle
                label="Home Phone:"
                value={formDatas?.homephone ?? ""}
                onChange={handleChange}
                name="homephone"
                id="homephone"
                placeholder="xxx-xxx-xxxx"
                editVisible={editVisible}
              />
              <InputTelExtToggle
                id="homephoneExt"
                name="homephoneExt"
                value={formDatas?.homephoneExt ?? ""}
                onChange={handleChange}
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <InputTelToggle
                label="Work Phone:"
                value={formDatas?.workphone ?? ""}
                onChange={handleChange}
                name="workphone"
                id="workphone"
                placeholder="xxx-xxx-xxxx"
                editVisible={editVisible}
              />
              <InputTelExtToggle
                id="workphoneExt"
                name="workphoneExt"
                value={formDatas?.workphoneExt ?? ""}
                onChange={handleChange}
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <GenericListToggle
                label="Preferred Official Language:"
                list={officialLanguageCT}
                value={formDatas?.preferredOff ?? ""}
                name="preferredOff"
                handleChange={handleChange}
                noneOption={false}
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <GenericListToggle
                label="Status:"
                name="status"
                list={personStatusCT}
                value={formDatas?.status ?? ""}
                handleChange={handleChange}
                placeHolder="Choose a status..."
                noneOption={false}
                editVisible={editVisible}
              />
            </div>
            <div className="demographics-card__content-row">
              <label>Assigned Clinic Physician: </label>
              {editVisible ? (
                <StaffList
                  value={formDatas?.assignedMd ?? 0}
                  name="assignedMd"
                  handleChange={handleChange}
                />
              ) : (
                <p>
                  {staffIdToTitleAndName(staffInfos, formDatas?.assignedMd)}
                </p>
              )}
            </div>
            <div className="demographics-card__content-row">
              <label>Enrolled to physician: </label>
              {enrolmentCaption(lastEnrolment)}
              <Tooltip title="Add new enrolment" placement="top-start" arrow>
                <span>
                  <SquarePlusIcon onClick={handleClickNewEnrolment} ml={5} />
                </span>
              </Tooltip>
              <Tooltip
                title="See enrolment history"
                placement="top-start"
                arrow
              >
                <span>
                  <ClockIcon onClick={handleClickHistory} ml={5} />
                </span>
              </Tooltip>
            </div>
            <div className="demographics-card__content-row">
              <label>Enrollment status: </label>
              {toCodeTableName(
                enrollmentStatusCT,
                lastEnrolment?.EnrollmentStatus
              )}
            </div>
            <div className="demographics-card__content-row">
              <label>Enrollment date: </label>
              {timestampToDateISOTZ(lastEnrolment?.EnrollmentDate)}
            </div>
            <div className="demographics-card__content-row">
              <label>Enrollment termination date: </label>
              {timestampToDateISOTZ(lastEnrolment?.EnrollmentTerminationDate)}
            </div>
            <div className="demographics-card__content-row">
              <label>Termination reason: </label>
              {toCodeTableName(
                terminationReasonCT,
                lastEnrolment?.TerminationReason
              )}
            </div>
            {editVisible ? (
              <fieldset>
                <legend>Primary Physician</legend>
                <div className="demographics-card__row-special">
                  <Input
                    value={formDatas?.pPhysicianFirstName ?? ""}
                    onChange={handleChange}
                    name="pPhysicianFirstName"
                    id="primary-first-name"
                    label="First Name:"
                  />
                  <Input
                    value={formDatas?.pPhysicianLastName ?? ""}
                    onChange={handleChange}
                    name="pPhysicianLastName"
                    id="primary-last-name"
                    label="Last Name:"
                  />
                </div>
                <div className="demographics-card__row-special">
                  <Input
                    value={formDatas?.pPhysicianOHIP ?? ""}
                    onChange={handleChange}
                    name="pPhysicianOHIP"
                    id="primary-ohip"
                    label="OHIP#:"
                  />
                  <Input
                    value={formDatas?.pPhysicianCPSO ?? ""}
                    onChange={handleChange}
                    name="pPhysicianCPSO"
                    id="primary-cpso"
                    label="CPSO:"
                  />
                </div>
              </fieldset>
            ) : (
              <div className="demographics-card__content-row">
                <label>Primary Physician: </label>
                {primaryPhysicianCaption(demographicsInfos.PrimaryPhysician)}
              </div>
            )}
            {editVisible ? (
              <fieldset>
                <legend>Referred Physician</legend>
                <div className="demographics-card__row-special">
                  <Input
                    value={formDatas?.rPhysicianFirstName ?? ""}
                    onChange={handleChange}
                    name="rPhysicianFirstName"
                    id="referred-first-name"
                    label="First Name:"
                  />
                  <Input
                    value={formDatas?.rPhysicianLastName ?? ""}
                    onChange={handleChange}
                    name="rPhysicianLastName"
                    id="referred-last-name"
                    label="Last Name:"
                  />
                </div>
              </fieldset>
            ) : (
              <div className="demographics-card__content-row">
                <label>Referred Physician: </label>
                {demographicsInfos.ReferredPhysician?.FirstName}{" "}
                {demographicsInfos.ReferredPhysician?.LastName}
              </div>
            )}
            {editVisible ? (
              <fieldset>
                <legend>Family Physician</legend>
                <div className="demographics-card__row-special">
                  <Input
                    value={formDatas?.fPhysicianFirstName ?? ""}
                    onChange={handleChange}
                    name="fPhysicianFirstName"
                    id="family-first-name"
                    label="First Name:"
                  />
                  <Input
                    value={formDatas?.fPhysicianLastName ?? ""}
                    onChange={handleChange}
                    name="fPhysicianLastName"
                    id="family-last-name"
                    label="Last Name:"
                  />
                </div>
              </fieldset>
            ) : (
              <div className="demographics-card__content-row">
                <label>Family Physician: </label>
                {demographicsInfos.FamilyPhysician?.FirstName}{" "}
                {demographicsInfos.FamilyPhysician?.LastName}
              </div>
            )}
            {editVisible ? (
              <fieldset>
                <legend>Emergency Contact</legend>
                <div className="demographics-card__row-special">
                  <Input
                    value={formDatas?.emergencyFirstName ?? ""}
                    onChange={handleChange}
                    name="emergencyFirstName"
                    id="emergency-first-name"
                    label="First Name:"
                  />
                  <Input
                    value={formDatas?.emergencyMiddleName ?? ""}
                    onChange={handleChange}
                    name="emergencyMiddleName"
                    id="emergency-middle-name"
                    label="Middle Name:"
                  />
                  <Input
                    value={formDatas?.emergencyLastName ?? ""}
                    onChange={handleChange}
                    name="emergencyLastName"
                    id="emergency-last-name"
                    label="Last Name:"
                  />
                </div>
                <div className="demographics-card__row-special">
                  <InputEmail
                    value={formDatas?.emergencyEmail ?? ""}
                    onChange={handleChange}
                    name="emergencyEmail"
                    id="emergency-email"
                    label="Email:"
                  />
                  <InputTel
                    value={formDatas?.emergencyPhone ?? ""}
                    onChange={handleChange}
                    name="emergencyPhone"
                    id="emergency-phone"
                    label="Phone:"
                    placeholder="xxx-xxx-xxxx"
                  />
                </div>
              </fieldset>
            ) : (
              <div className="demographics-card__content-row">
                <label>Emergency Contact: </label>
                {emergencyContactCaption(emergencyContact)}
              </div>
            )}
          </div>
          <DemographicsAvatar
            avatar={formDatas?.avatar ?? null}
            editVisible={editVisible}
            setWebcamVisible={setWebcamVisible}
            handleAvatarChange={handleAvatarChange}
          />
        </form>
        <p className="demographics-card__sign">
          {isUpdated(demographicsInfos) ? (
            <em>
              Updated by{" "}
              {staffIdToTitleAndName(
                staffInfos,
                getLastUpdate(demographicsInfos)?.updated_by_id
              )}{" "}
              on{" "}
              {timestampToDateTimeSecondsStrTZ(
                getLastUpdate(demographicsInfos)?.date_updated
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
              (a, b) =>
                (b.EnrollmentDate as number) - (a.EnrollmentDate as number)
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
            setFormDatas={
              setFormDatas as React.Dispatch<
                React.SetStateAction<Partial<DemographicsFormType>>
              >
            }
            setWebcamVisible={setWebcamVisible}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default DemographicsPopUp;
