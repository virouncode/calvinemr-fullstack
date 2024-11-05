import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { xanoDeleteBatch } from "../../../api/xanoCRUD/xanoDelete";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { usePatientPost } from "../../../hooks/reactquery/mutations/patientsMutations";
import {
  genderCT,
  namePrefixCT,
  nameSuffixCT,
  officialLanguageCT,
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../omdDatas/codesTables";
import {
  AttachmentType,
  DemographicsFormType,
  DemographicsType,
  PatientType,
  StaffType,
} from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import { createChartNbr } from "../../../utils/numbers/createChartNbr";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { patientSchema } from "../../../validation/signup/patientValidation";
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
import PatientAvatarInput from "./PatientAvatarInput";
import WebcamCapture from "./WebcamCapture";
axios.defaults.withCredentials = true;

const SignupPatientForm = () => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const { clinic } = useClinicContext();
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [webcamVisible, setWebcamVisible] = useState(false);
  const [formDatas, setFormDatas] = useState<Partial<DemographicsFormType>>({
    email: "",
    prefix: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    nickName: "",
    gender: "",
    dob: "",
    healthNbr: "",
    healthVersion: "",
    healthProvince: "",
    healthExpiry: "",
    sin: "",
    assignedMd: 0,
    cellphone: "",
    cellphoneExt: "",
    homephone: "",
    homephoneExt: "",
    workphone: "",
    workphoneExt: "",
    line1: "",
    province: "",
    postalCode: "",
    zipCode: "",
    city: "",
    preferredOff: "",
    avatar: null,
  });
  const [progress, setProgress] = useState(false);
  const patientPost = usePatientPost();

  //EVENT HANDLERS
  const handleChangePostalOrZip = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setErrMsg("");
    setPostalOrZip(e.target.value);
    setFormDatas({
      ...formDatas,
      postalCode: "",
      zipCode: "",
    });
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
    if (name === "postalZipCode") {
      if (postalOrZip === "postal") {
        setFormDatas({ ...formDatas, postalCode: value, zipCode: "" });
        return;
      } else {
        setFormDatas({ ...formDatas, zipCode: value, postalCode: "" });
        return;
      }
    }
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 128000000) {
      toast.error("The file is over 128Mb, please choose another file", {
        containerId: "A",
      });
      return;
    }
    setIsLoadingFile(true);
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
        ...formDatas,
        avatar: fileToUpload,
      });
      setIsLoadingFile(false);
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error unable to load file: ${err.message}`, {
          containerId: "A",
        });
      setIsLoadingFile(false);
    }
  };
  const handleSubmit = async () => {
    setErrMsg("");
    try {
      await patientSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    //Is the mail already taken ?
    setProgress(true);
    const successfulRequests: { endpoint: string; id: number }[] = [];
    try {
      const existingPatient = await xanoGet(`/patient_with_email`, "staff", {
        email: formDatas.email?.toLowerCase(),
      });
      if (existingPatient) {
        setErrMsg("There is already an account with this email");
        setProgress(false);
        return;
      }
    } catch (err) {
      if (err instanceof Error)
        setErrMsg(`Unable to post new patient: ${err.message}`);
      setProgress(false);
      return;
    }

    //Formatting
    const patientToPost: Partial<PatientType> & {
      clinic_name: string;
      first_name: string;
      middle_name: string;
      last_name: string;
    } = {
      email: formDatas.email?.toLowerCase(),
      access_level: "patient",
      account_status: "Active",
      created_by_id: user.id,
      date_created: nowTZTimestamp(),
      //for the email sent to the new patient
      clinic_name: clinic?.name ?? "",
      first_name: formDatas.firstName ?? "",
      middle_name: formDatas.middleName ?? "",
      last_name: formDatas.lastName ?? "",
    };
    let patientId: number;
    try {
      const patientResponse: PatientType = (
        await axios.post(`/api/xano/new_patient`, patientToPost)
      ).data;
      successfulRequests.push({
        endpoint: "/patients",
        id: patientResponse.id,
      });
      socket?.emit("message", {
        route: "PATIENTS",
        action: "create",
        content: { data: patientResponse },
      });
      patientId = patientResponse.id;
      const demographicsToPost: Partial<DemographicsType> = {
        ChartNumber: createChartNbr(
          dateISOToTimestampTZ(formDatas.dob),
          toCodeTableName(genderCT, formDatas.gender),
          patientId
        ),
        PersonStatusCode: {
          PersonStatusAsEnum: "A",
          PersonStatusAsPlainText: "",
        },
        patient_id: patientId,
        Email: formDatas.email?.toLowerCase(),
        Names: {
          NamePrefix: formDatas.prefix ?? "",
          LegalName: {
            _namePurpose: "L",
            FirstName: {
              Part: firstLetterUpper(formDatas.firstName ?? ""),
              PartType: "GIV",
              PartQualifier: "",
            },
            LastName: {
              Part: firstLetterUpper(formDatas.lastName ?? ""),
              PartType: "FAMC",
              PartQualifier: "",
            },
            OtherName: [
              {
                Part: firstLetterUpper(formDatas.middleName ?? ""),
                PartType: "GIV",
                PartQualifier: "",
              },
            ],
          },
          OtherNames: [
            {
              _namePurpose: "AL",
              OtherName: [
                {
                  Part: firstLetterUpper(formDatas.nickName ?? ""),
                  PartType: "GIV",
                  PartQualifier: "",
                },
              ],
            },
          ],
          LastNameSuffix: formDatas.suffix ?? "",
        },
        Gender: formDatas.gender,
        DateOfBirth: dateISOToTimestampTZ(formDatas.dob),
        DateOfBirthISO: formDatas.dob,
        HealthCard: {
          Number: formDatas.healthNbr ?? "",
          Version: formDatas.healthVersion ?? "",
          ExpiryDate: dateISOToTimestampTZ(formDatas.healthExpiry),
          ProvinceCode: formDatas.healthProvince ?? "",
        },
        SIN: formDatas.sin,
        assigned_staff_id: formDatas.assignedMd ?? 0,
        PhoneNumber: [
          {
            phoneNumber: formDatas.cellphone ?? "",
            extension: formDatas.cellphoneExt ?? "",
            _phoneNumberType: "C",
          },
          {
            phoneNumber: formDatas.homephone ?? "",
            extension: formDatas.homephoneExt ?? "",
            _phoneNumberType: "R",
          },
          {
            phoneNumber: formDatas.workphone ?? "",
            extension: formDatas.workphoneExt ?? "",
            _phoneNumberType: "W",
          },
        ],
        Address: [
          {
            _addressType: "R",
            Structured: {
              Line1: firstLetterUpper(formDatas.line1 ?? ""),
              Line2: "",
              Line3: "",
              City: firstLetterUpper(formDatas.city ?? ""),
              CountrySubDivisionCode: formDatas.province ?? "",
              PostalZipCode: {
                PostalCode: formDatas.postalCode ?? "",
                ZipCode: formDatas.zipCode ?? "",
              },
            },
          },
        ],
        PreferredOfficialLanguage: formDatas.preferredOff,
        avatar: formDatas.avatar,
        ai_consent: false,
        ai_consent_read: false,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
      };
      patientPost.mutate(demographicsToPost, {
        onSuccess: (data) => {
          successfulRequests.push({
            endpoint: "/demographics",
            id: data.id,
          });
        },
      });
      //Put patient in patients [] of assignedMd
      const response3: StaffType = await xanoGet(
        `/staff/${formDatas.assignedMd}`,
        "staff"
      );
      await xanoPut(`/staff/${formDatas.assignedMd}`, "staff", {
        ...response3,
        patients: [...response3.patients, patientId],
      });
      socket?.emit("message", {
        route: "STAFF INFOS",
        action: "update",
        content: { id: response3.id, data: response3 },
      });
      setFormDatas({
        email: "",
        prefix: "",
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        nickName: "",
        gender: "",
        dob: "",
        healthNbr: "",
        healthVersion: "",
        healthProvince: "",
        healthExpiry: "",
        sin: "",
        assignedMd: 0,
        cellphone: "",
        cellphoneExt: "",
        homephone: "",
        homephoneExt: "",
        workphone: "",
        workphoneExt: "",
        line1: "",
        province: "",
        postalCode: "",
        zipCode: "",
        city: "",
        preferredOff: "",
        avatar: null,
      });
      setSuccessMsg("Patient added successfully");
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (err) {
      if (err instanceof Error)
        setErrMsg(`Unable to post new patient:${err.message}`);
      await xanoDeleteBatch(successfulRequests, "staff");
      return;
    } finally {
      setProgress(false);
    }
  };

  return (
    <div
      className="signup-patient__container"
      style={{ border: errMsg && "solid 1.5px red" }}
    >
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}

      <form className="signup-patient__form">
        {successMsg && <p className="signup-patient__success">{successMsg}</p>}
        <div className="signup-patient__column">
          <div className="signup-patient__row">
            <GenericList
              label="Name Prefix:"
              name="prefix"
              list={namePrefixCT}
              value={formDatas.prefix ?? ""}
              handleChange={handleChange}
              placeHolder="Choose a name prefix..."
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="First Name*:"
              value={formDatas.firstName ?? ""}
              onChange={handleChange}
              name="firstName"
              id="first-name"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Middle Name:"
              value={formDatas.middleName ?? ""}
              onChange={handleChange}
              name="middleName"
              id="middle-name"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Last Name*:"
              value={formDatas.lastName ?? ""}
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
              value={formDatas.suffix ?? ""}
              handleChange={handleChange}
              placeHolder="Choose a last name suffix..."
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Nick name:"
              value={formDatas.nickName ?? ""}
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
              value={formDatas.gender ?? ""}
              handleChange={handleChange}
              placeHolder="Choose a gender..."
            />
          </div>
          <div className="signup-patient__row">
            <InputDate
              label="Date of birth*:"
              value={formDatas.dob ?? ""}
              onChange={handleChange}
              name="dob"
              max={timestampToDateISOTZ(nowTZTimestamp())}
              id="dob"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Health Card#:"
              value={formDatas.healthNbr ?? ""}
              onChange={handleChange}
              name="healthNbr"
              id="hcn"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Health Card Version:"
              value={formDatas.healthVersion ?? ""}
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
              value={formDatas.healthProvince ?? ""}
              handleChange={handleChange}
              placeHolder="Choose a province..."
            />
          </div>
          <div className="signup-patient__row">
            <InputDate
              label="Health Card Expiry:"
              value={formDatas.healthExpiry ?? ""}
              onChange={handleChange}
              name="healthExpiry"
              id="hc_expiry"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="SIN:"
              value={formDatas.sin ?? ""}
              onChange={handleChange}
              name="sin"
              id="sin"
              placeholder="xxx xxx xxx"
            />
          </div>
          <div className="signup-patient__row">
            <label>Assigned practitioner*: </label>
            <StaffList
              value={formDatas.assignedMd ?? 0}
              name="assignedMd"
              handleChange={handleChange}
            />
          </div>
        </div>
        <div className="signup-patient__column">
          <div className="signup-patient__row">
            <Input
              label="Address*:"
              value={formDatas.line1 ?? ""}
              onChange={handleChange}
              name="line1"
              id="line1"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="City*:"
              value={formDatas.city ?? ""}
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
              value={formDatas.province ?? ""}
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
                  ? formDatas.postalCode ?? ""
                  : formDatas.zipCode ?? ""
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
                value={formDatas.cellphone ?? ""}
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
                value={formDatas.cellphoneExt}
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
                value={formDatas.homephone ?? ""}
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
                value={formDatas.homephoneExt}
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
                value={formDatas.workphone ?? ""}
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
                value={formDatas.workphoneExt}
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
              value={formDatas.email ?? ""}
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
              value={formDatas.preferredOff ?? ""}
              handleChange={handleChange}
              placeHolder="Choose a preferred official language"
              noneOption={false}
            />
          </div>
          <div className="signup-patient__row signup-patient__row--avatar">
            <PatientAvatarInput
              formDatas={formDatas}
              setWebcamVisible={setWebcamVisible}
              isLoadingFile={isLoadingFile}
              handleAvatarChange={handleAvatarChange}
            />
          </div>
        </div>
      </form>
      <div className="signup-patient__btn">
        <SaveButton
          disabled={isLoadingFile || progress}
          onClick={handleSubmit}
          label="Sign up"
        />
      </div>
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
    </div>
  );
};

export default SignupPatientForm;
