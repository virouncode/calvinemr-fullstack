import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
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
import StaffList from "../../UI/Lists/StaffList";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../UI/Windows/FakeWindow";
import PatientAvatarInput from "./PatientAvatarInput";
import WebcamCapture from "./WebcamCapture";

axios.defaults.withCredentials = true;

const SignupPatientForm = () => {
  //HOOKS
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const { clinic } = useClinicContext();
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  // const [relationships, setRelationships] = useState([]);
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [webcamVisible, setWebcamVisible] = useState(false);
  const [formDatas, setFormDatas] = useState({
    email: "",
    prefix: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    nickName: "",
    gender: "",
    dob: "",
    dobISO: "",
    healthNbr: "",
    healthVersion: "",
    healthProvince: "",
    healthExpiry: "",
    sin: "",
    assignedMd: "",
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
    preferredOffLang: "",
    avatar: "",
  });
  const [progress, setProgress] = useState(false);
  const patientPost = usePatientPost();

  //EVENT HANDLERS
  const handleChangePostalOrZip = (e) => {
    setErrMsg("");
    setPostalOrZip(e.target.value);
    setFormDatas({
      ...formDatas,
      postalCode: "",
      zipCode: "",
    });
  };
  const handleChange = (e) => {
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
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 25000000) {
      toast.error("The file is over 25Mb, please choose another file", {
        containerId: "A",
      });
      return;
    }
    setIsLoadingFile(true);
    // setting up the reader
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      try {
        const fileToUpload = await xanoPost(
          "/upload/attachment",
          "staff",

          { content }
        );
        setFormDatas({
          ...formDatas,
          avatar: fileToUpload,
        });
        setIsLoadingFile(false);
      } catch (err) {
        toast.error(`Error unable to load file: ${err.message}`, {
          containerId: "A",
        });
        setIsLoadingFile(false);
      }
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    try {
      await patientSchema.validate(formDatas);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    //Is the mail already taken ?
    setProgress(true);
    try {
      const response = await xanoGet(`/patient_with_email`, "staff", {
        email: formDatas.email.toLowerCase(),
      });
      if (response) {
        setErrMsg("There is already an account with this email");
        setProgress(false);
        return;
      }
    } catch (err) {
      setErrMsg(`Unable to post new patient: ${err.message}`);
      setProgress(false);
      return;
    }

    //Formatting
    const patientToPost = {
      email: formDatas.email.toLowerCase(),
      access_level: "patient",
      account_status: "Active",
      created_by_id: user.id,
      date_created: nowTZTimestamp(),
      //for the email sent to the new patient
      clinic_name: clinic.name,
      first_name: formDatas.firstName,
      middle_name: formDatas.middleName,
      last_name: formDatas.lastName,
    };
    let patientId;
    try {
      const response = await axios.post(`/api/xano/new_patient`, patientToPost);
      socket.emit("message", {
        route: "PATIENTS",
        action: "create",
        content: { data: response.data },
      });
      patientId = response.data.id;
      const demographicsToPost = {
        ChartNumber: createChartNbr(
          dateISOToTimestampTZ(formDatas.dob),
          toCodeTableName(genderCT, formDatas.gender),
          patientId
        ),
        PersonStatusCode: {
          PersonStatusAsEnum: "A",
        },
        patient_id: patientId,
        Email: formDatas.email.toLowerCase(),
        Names: {
          NamePrefix: formDatas.prefix,
          LegalName: {
            _namePurpose: "L",
            FirstName: {
              Part: firstLetterUpper(formDatas.firstName),
              PartType: "GIV",
            },
            LastName: {
              Part: firstLetterUpper(formDatas.lastName),
              PartType: "FAMC",
            },
            OtherName: [
              {
                Part: firstLetterUpper(formDatas.middleName),
                PartType: "GIV",
              },
            ],
          },
          OtherNames: [
            {
              _namePurpose: "AL",
              OtherName: [
                {
                  Part: firstLetterUpper(formDatas.nickName),
                  PartType: "GIV",
                },
              ],
            },
          ],
          LastNameSuffix: formDatas.suffix,
        },
        Gender: formDatas.gender,
        DateOfBirth: dateISOToTimestampTZ(formDatas.dob),
        DateOfBirthISO: formDatas.dob,
        HealthCard: {
          Number: formDatas.healthNbr,
          Version: formDatas.healthVersion,
          ExpiryDate: dateISOToTimestampTZ(formDatas.healthExpiry),
          ProvinceCode: formDatas.healthProvince,
        },
        SIN: formDatas.sin,
        assigned_staff_id: parseInt(formDatas.assignedMd),
        PhoneNumber: [
          {
            phoneNumber: formDatas.cellphone,
            extension: formDatas.cellphoneExt,
            _phoneNumberType: "C",
          },
          {
            phoneNumber: formDatas.homephone,
            extension: formDatas.homephoneExt,
            _phoneNumberType: "R",
          },
          {
            phoneNumber: formDatas.workphone,
            extension: formDatas.workphoneExt,
            _phoneNumberType: "W",
          },
        ],
        Address: [
          {
            _addressType: "R",
            Structured: {
              Line1: firstLetterUpper(formDatas.line1),
              City: firstLetterUpper(formDatas.city),
              CountrySubDivisionCode: formDatas.province,
              PostalZipCode: {
                PostalCode: formDatas.postalCode,
                ZipCode: formDatas.zipCode,
              },
            },
          },
        ],
        PreferredOfficialLanguage: formDatas.preferredOffLang,
        avatar: formDatas.avatar,
        ai_consent: false,
        ai_consent_read: false,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
      };
      patientPost.mutate(demographicsToPost);
      //Put patient in patients [] of assignedMd
      const response3 = await xanoGet(
        `/staff/${formDatas.assignedMd}`,
        "staff"
      );
      await xanoPut(`/staff/${formDatas.assignedMd}`, "staff", {
        ...response3,
        patients: [...response3.patients, patientId],
      });
      socket.emit("message", {
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
        assignedMd: "",
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
        preferredOffLang: "",
        avatar: "",
      });
      setSuccessMsg("Patient added successfully");
      setProgress(false);
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (err) {
      setErrMsg(`Unable to post new patient:${err.message}`);
      setProgress(false);
      return;
    }
  };

  return (
    <div
      className="signup-patient__container"
      style={{ border: errMsg && "solid 1.5px red" }}
    >
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      {successMsg && <p className="signup-patient__success">{successMsg}</p>}
      <form className="signup-patient__form">
        <div className="signup-patient__column">
          <div className="signup-patient__row">
            <GenericList
              label="Name Prefix:"
              name="prefix"
              list={namePrefixCT}
              value={formDatas.prefix}
              handleChange={handleChange}
              placeHolder="Choose a name prefix..."
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="First Name*:"
              value={formDatas.firstName}
              onChange={handleChange}
              name="firstName"
              id="first-name"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Middle Name:"
              value={formDatas.middleName}
              onChange={handleChange}
              name="middleName"
              id="middle-name"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Last Name*:"
              value={formDatas.lastName}
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
              value={formDatas.suffix}
              handleChange={handleChange}
              placeHolder="Choose a last name suffix..."
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Nick name:"
              value={formDatas.nickName}
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
              value={formDatas.gender}
              handleChange={handleChange}
              placeHolder="Choose a gender..."
            />
          </div>
          <div className="signup-patient__row">
            <InputDate
              label="Date of birth*:"
              value={formDatas.dob}
              onChange={handleChange}
              name="dob"
              max={timestampToDateISOTZ(nowTZTimestamp())}
              id="dob"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Health Card#:"
              value={formDatas.healthNbr}
              onChange={handleChange}
              name="healthNbr"
              id="hcn"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="Health Card Version:"
              value={formDatas.healthVersion}
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
              value={formDatas.healthProvince}
              handleChange={handleChange}
              placeHolder="Choose a province..."
            />
          </div>
          <div className="signup-patient__row">
            <InputDate
              label="Health Card Expiry:"
              value={formDatas.healthExpiry}
              onChange={handleChange}
              name="healthExpiry"
              id="hc_expiry"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="SIN:"
              value={formDatas.sin}
              onChange={handleChange}
              name="sin"
              id="sin"
              placeholder="xxx xxx xxx"
            />
          </div>
          <div className="signup-patient__row">
            <label>Assigned practitioner*: </label>
            <StaffList
              value={formDatas.assignedMd}
              name="assignedMd"
              handleChange={handleChange}
              staffInfos={staffInfos}
            />
          </div>
        </div>
        <div className="signup-patient__column">
          <div className="signup-patient__row">
            <Input
              label="Address*:"
              value={formDatas.line1}
              onChange={handleChange}
              name="line1"
              id="line1"
            />
          </div>
          <div className="signup-patient__row">
            <Input
              label="City*:"
              value={formDatas.city}
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
              value={formDatas.province}
              handleChange={handleChange}
              placeHolder="Choose a province/state..."
            />
          </div>
          <div className="signup-patient__row">
            <label htmlFor="postalZipCode">Postal/Zip Code*: </label>
            <select
              style={{ width: "20%", marginRight: "10px" }}
              name="PostalOrZip"
              value={postalOrZip}
              onChange={handleChangePostalOrZip}
            >
              <option value="postal">Postal</option>
              <option value="zip">Zip</option>
            </select>
            <Input
              value={
                postalOrZip === "postal"
                  ? formDatas.postalCode
                  : formDatas.zipCode
              }
              onChange={handleChange}
              name="postalZipCode"
              id="postalZipCode"
              placeholder={
                postalOrZip === "postal" ? "A1A 1A1" : "12345 or 12345-6789"
              }
            />
          </div>
          <div className="signup-patient__row">
            <InputTel
              label="Cell Phone*:"
              value={formDatas.cellphone}
              onChange={handleChange}
              name="cellphone"
              id="cellphone"
              placeholder="xxx-xxx-xxxx"
            />
            <label
              style={{ marginLeft: "30px", width: "10%" }}
              htmlFor="cellphoneExt"
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
          </div>
          <div className="signup-patient__row">
            <InputTel
              label="Home Phone:"
              value={formDatas.homephone}
              onChange={handleChange}
              name="homephone"
              id="homephone"
              placeholder="xxx-xxx-xxxx"
            />
            <label
              style={{ marginLeft: "30px", width: "10%" }}
              htmlFor="homephoneExt"
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
          </div>
          <div className="signup-patient__row">
            <InputTel
              label="Work Phone:"
              value={formDatas.workphone}
              onChange={handleChange}
              name="workphone"
              id="workphone"
              placeholder="xxx-xxx-xxxx"
            />
            <label
              style={{ marginLeft: "30px", width: "10%" }}
              htmlFor="workphoneExt"
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
          </div>
          <div className="signup-patient__row">
            <InputEmail
              label="Email*:"
              type="email"
              value={formDatas.email}
              name="email"
              autoComplete="off"
              onChange={handleChange}
              id="email"
            />
          </div>
          <div className="signup-patient__row">
            <GenericList
              label="Preferred Official Language:"
              name="preferredOffLang"
              list={officialLanguageCT}
              value={formDatas.preferredOffLang}
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
      <div className="signup-patient__submit">
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
