import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { usePatientPut } from "../../../hooks/reactquery/mutations/patientsMutations";
import useRetrieveDemographicsFormDatas from "../../../hooks/useRetrieveDemographicsFormDatas";
import {
  genderCT,
  namePrefixCT,
  nameSuffixCT,
  officialLanguageCT,
  provinceStateTerritoryCT,
} from "../../../omdDatas/codesTables";
import {
  AttachmentType,
  DemographicsFormType,
  DemographicsType,
  StaffType,
} from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { demographicsSchema } from "../../../validation/record/demographicsValidation";
import PatientAvatarInput from "../../Staff/Signup/PatientAvatarInput";
import WebcamCapture from "../../Staff/Signup/WebcamCapture";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Input from "../../UI/Inputs/Input";
import InputDate from "../../UI/Inputs/InputDate";
import InputEmail from "../../UI/Inputs/InputEmail";
import InputTel from "../../UI/Inputs/InputTel";
import GenericList from "../../UI/Lists/GenericList";
import PostalZipSelectInput from "../../UI/Lists/PostalZipSelectInput";
import StaffList from "../../UI/Lists/StaffList";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../UI/Windows/FakeWindow";

axios.defaults.withCredentials = true;

type PatientEditProps = {
  patient: DemographicsType;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const PatientEdit = ({ patient, setEditVisible }: PatientEditProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [errMsgPost, setErrMsgPost] = useState("");
  const [progress, setProgress] = useState(false);
  const [webcamVisible, setWebcamVisible] = useState(false);
  const {
    formDatas,
    setFormDatas,
    residencialAddress,
    emergencyContact,
    lastEnrolment,
  } = useRetrieveDemographicsFormDatas(patient);
  const [loadingFile, setLoadingFile] = useState(false);
  const [postalOrZip, setPostalOrZip] = useState(
    residencialAddress?.PostalZipCode?.PostalCode ? "postal" : "zip"
  );
  //Queries
  const patientPut = usePatientPut(patient.patient_id);

  //EVENT HANDLERS
  const handleChangePostalOrZip = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setErrMsgPost("");
    setPostalOrZip(e.target.value);
    setFormDatas({
      ...(formDatas as DemographicsFormType),
      postalCode: "",
      zipCode: "",
    });
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    let value: string | number = e.target.value;
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
    if (name === "assignedMd") {
      value = parseInt(value);
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
    const formData = new FormData();
    formData.append("content", file);

    try {
      const response = await axios.post(
        import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const fileToUpload: AttachmentType = response.data;
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

  const handleSubmit = async () => {
    // Validation
    try {
      await demographicsSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    if (formDatas?.email) {
      //Check if email already used
      const response = await xanoGet("/patient_with_email", "admin", {
        email: formDatas.email.toLowerCase(),
      });
      if (response && response.id !== patient.patient_id) {
        setErrMsgPost("Email already used by another patient");
        toast.error(
          `Error: email ${formDatas.email.toLowerCase()} already used by another patient`,
          {
            containerId: "A",
          }
        );
        return;
      }
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
      email: formDatas?.email?.toLowerCase() ?? "",
    });
    const patientToPut: DemographicsType = {
      ...patient,
      avatar: formDatas?.avatar ?? null,
      assigned_staff_id: formDatas?.assignedMd ?? 0,
      Names: {
        NamePrefix: formDatas?.prefix ?? "",
        LegalName: {
          ...patient.Names?.LegalName,
          FirstName: {
            ...patient.Names?.LegalName?.FirstName,
            Part: firstLetterUpper(formDatas?.firstName ?? ""),
          },
          LastName: {
            ...patient.Names?.LegalName?.LastName,
            Part: firstLetterUpper(formDatas?.lastName ?? ""),
          },
          OtherName: [
            {
              ...patient.Names?.LegalName?.OtherName?.[0],
              Part: firstLetterUpper(formDatas?.middleName ?? ""),
            },
          ],
        },
        OtherNames: [
          {
            ...patient.Names?.OtherNames?.[0],
            OtherName: [
              {
                ...patient.Names?.OtherNames?.[0]?.OtherName?.[0],
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
      Address: patient.Address?.map((address) => {
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
      Contact: patient.Contact?.map((contact) => {
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
      Email: formDatas?.email?.toLowerCase() ?? "",
      PersonStatusCode: {
        ...patient.PersonStatusCode,
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
      PreferredPharmacy: patient.PreferredPharmacy,
      updates: [
        ...patient.updates,
        { date_updated: nowTZTimestamp(), updated_by_id: user.id },
      ],
    };
    //Submission
    setProgress(true);

    if (
      !staffInfos
        .find(({ id }) => id === formDatas?.assignedMd)
        ?.patients.includes(patient.patient_id)
    ) {
      const staffToPut: StaffType = {
        ...(staffInfos.find(
          ({ id }) => id === formDatas?.assignedMd
        ) as StaffType),
        patients: [
          ...(staffInfos.find(({ id }) => id === formDatas?.assignedMd)
            ?.patients ?? []),
          patient.patient_id,
        ],
      };
      //Submission
      const response: StaffType = await xanoPut(
        `/staff/${formDatas?.assignedMd}`,
        "admin",
        staffToPut
      );
      socket?.emit("message", {
        route: "STAFF INFOS",
        action: "update",
        content: {
          id: response.id,
          data: response,
        },
      });
    }

    try {
      await xanoPut("/patient_email", "admin", {
        id: patient.patient_id,
        email: formDatas?.email?.toLowerCase() ?? "",
      });
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error updating patient email: ${err.message}`, {
          containerId: "A",
        });
      setProgress(false);
      return;
    }
    patientPut.mutate(patientToPut, {
      onSuccess: () => {
        setEditVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  const handleCancel = () => {
    setEditVisible(false);
  };

  return (
    <div
      style={{
        border: errMsgPost ? "solid 1.5px red" : "solid 1.5px #efeff1",
        width: "90%",
        margin: "1rem auto",
        padding: "1rem",
        borderRadius: "6px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <SaveButton onClick={handleSubmit} disabled={loadingFile || progress} />
        <CancelButton
          onClick={handleCancel}
          disabled={loadingFile || progress}
        />
      </div>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}

      <form className="signup-patient__form">
        <div className="signup-patient__column">
          <div className="signup-patient__row">
            <GenericList
              label="Name Prefix:"
              name="prefix"
              list={namePrefixCT}
              value={formDatas?.prefix ?? ""}
              handleChange={handleChange}
              placeHolder="Choose a name prefix..."
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="First Name*:"
              value={formDatas?.firstName ?? ""}
              onChange={handleChange}
              name="firstName"
              id="first-name"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Middle Name:"
              value={formDatas?.middleName ?? ""}
              onChange={handleChange}
              name="middleName"
              id="middle-name"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Last Name*:"
              value={formDatas?.lastName ?? ""}
              onChange={handleChange}
              name="lastName"
              id="last-name"
            />
          </div>
          <div className="signup-patient__row">
            <GenericList
              label="Last Name Suffix:"
              name="suffix"
              list={nameSuffixCT}
              value={formDatas?.suffix ?? ""}
              handleChange={handleChange}
              placeHolder="Choose a last name suffix..."
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Nick name:"
              value={formDatas?.nickName ?? ""}
              onChange={handleChange}
              name="nickName"
              id="nick-name"
            />
          </div>
          <div className="signup-patient__row">
            <GenericList
              label="Gender*:"
              name="gender"
              list={genderCT}
              value={formDatas?.gender ?? ""}
              handleChange={handleChange}
              placeHolder="Choose a gender..."
            />
          </div>
          <div className="signup-patient__row">
            <InputDate
              label="Date of birth*:"
              value={formDatas?.dob ?? ""}
              onChange={handleChange}
              name="dob"
              max={timestampToDateISOTZ(nowTZTimestamp())}
              id="dob"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Health Card#:"
              value={formDatas?.healthNbr ?? ""}
              onChange={handleChange}
              name="healthNbr"
              id="hcn"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Health Card Version:"
              value={formDatas?.healthVersion ?? ""}
              onChange={handleChange}
              name="healthVersion"
              id="hcv"
            />
          </div>
          <div className="signup-patient__row">
            <GenericList
              label="Health Card Province:"
              name="healthProvince"
              list={provinceStateTerritoryCT}
              value={formDatas?.healthProvince ?? ""}
              handleChange={handleChange}
              placeHolder="Choose a province..."
            />
          </div>
          <div className="signup-patient__row">
            <InputDate
              label="Health Card Expiry:"
              value={formDatas?.healthExpiry ?? ""}
              onChange={handleChange}
              name="healthExpiry"
              id="hc_expiry"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="SIN:"
              value={formDatas?.sin ?? ""}
              onChange={handleChange}
              name="sin"
              id="sin"
              placeholder="xxx xxx xxx"
            />
          </div>
          <div className="signup-patient__row">
            <label>Assigned practitioner*: </label>
            <StaffList
              value={formDatas?.assignedMd ?? 0}
              name="assignedMd"
              handleChange={handleChange}
            />
          </div>
        </div>
        <div className="signup-patient__column">
          <div className="signup-patient__row">
            <Input
              label="Address*:"
              value={formDatas?.line1 ?? ""}
              onChange={handleChange}
              name="line1"
              id="line1"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="City*:"
              value={formDatas?.city ?? ""}
              onChange={handleChange}
              name="city"
              id="city"
            />
          </div>
          <div className="signup-patient__row">
            <GenericList
              label="Province/State:"
              name="province"
              list={provinceStateTerritoryCT}
              value={formDatas?.province ?? ""}
              handleChange={handleChange}
              placeHolder="Choose a province/state..."
            />
          </div>
          <div className="signup-patient__row signup-patient__row--postal">
            <PostalZipSelectInput
              onChangeSelect={handleChangePostalOrZip}
              onChangeInput={handleChange}
              postalOrZip={postalOrZip}
              label={true}
              value={
                postalOrZip === "postal"
                  ? formDatas?.postalCode ?? ""
                  : formDatas?.zipCode ?? ""
              }
              id="postalZipCode"
              placeholder={
                postalOrZip === "postal" ? "A1A 1A1" : "12345 or 12345-6789"
              }
              name="postalZipCode"
            />
          </div>
          <div className="signup-patient__row signup-patient__row--tel">
            <div className="signup-patient__row-item-number">
              <InputTel
                label="Cell Phone*:"
                value={formDatas?.cellphone ?? ""}
                onChange={handleChange}
                name="cellphone"
                id="cellphone"
                placeholder="xxx-xxx-xxxx"
              />
            </div>
            <div className="signup-patient__row-item-extension">
              <label htmlFor="cellphoneExt">Ext</label>
              <input
                type="text"
                value={formDatas?.cellphoneExt ?? ""}
                onChange={handleChange}
                name="cellphoneExt"
                autoComplete="off"
                id="cellphoneExt"
              />
            </div>
          </div>
          <div className="signup-patient__row signup-patient__row--tel">
            <div className="signup-patient__row-item-number">
              <InputTel
                label="Home Phone:"
                value={formDatas?.homephone ?? ""}
                onChange={handleChange}
                name="homephone"
                id="homephone"
                placeholder="xxx-xxx-xxxx"
              />
            </div>
            <div className="signup-patient__row-item-extension">
              <label htmlFor="homephoneExt">Ext</label>
              <input
                type="text"
                value={formDatas?.homephoneExt ?? ""}
                onChange={handleChange}
                name="homephoneExt"
                autoComplete="off"
                id="homephoneExt"
              />
            </div>
          </div>
          <div className="signup-patient__row signup-patient__row--tel">
            <div className="signup-patient__row-item-number">
              <InputTel
                label="Work Phone:"
                value={formDatas?.workphone ?? ""}
                onChange={handleChange}
                name="workphone"
                id="workphone"
                placeholder="xxx-xxx-xxxx"
              />
            </div>
            <div className="signup-patient__row-item-extension">
              <label htmlFor="workphoneExt">Ext</label>
              <input
                type="text"
                value={formDatas?.workphoneExt ?? ""}
                onChange={handleChange}
                name="workphoneExt"
                autoComplete="off"
                id="workphoneExt"
              />
            </div>
          </div>
          <div className="signup-patient__row">
            <InputEmail
              label="Email*:"
              value={formDatas?.email ?? ""}
              name="email"
              onChange={handleChange}
              id="email"
            />
          </div>
          <div className="signup-patient__row">
            <GenericList
              label="Preferred Official Language:"
              name="preferredOff"
              list={officialLanguageCT}
              value={formDatas?.preferredOff ?? ""}
              handleChange={handleChange}
              placeHolder="Choose a preferred official language"
              noneOption={false}
            />
          </div>
          {formDatas && (
            <div className="signup-patient__row signup-patient__row--avatar">
              <PatientAvatarInput
                formDatas={formDatas}
                setWebcamVisible={setWebcamVisible}
                isLoadingFile={loadingFile}
                handleAvatarChange={handleAvatarChange}
              />
            </div>
          )}
        </div>
      </form>
      {webcamVisible && (
        <FakeWindow
          title="TAKE A PICTURE WITH YOUR WEBCAM"
          width={480}
          height={530}
          x={(window.innerWidth - 480) / 2}
          y={(window.innerHeight - 530) / 2}
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
    </div>
  );
};

export default PatientEdit;
