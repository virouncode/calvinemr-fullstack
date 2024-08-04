import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import avatarLogo from "../../../assets/img/avatar.png";
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
import GenericList from "../../UI/Lists/GenericList";
import StaffList from "../../UI/Lists/StaffList";
import CircularProgressSmall from "../../UI/Progress/CircularProgressSmall";
import FakeWindow from "../../UI/Windows/FakeWindow";
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
      {errMsg && <p className="signup-patient__err">{errMsg}</p>}
      {successMsg && <p className="signup-patient__success">{successMsg}</p>}
      <form className="signup-patient__form">
        <div className="signup-patient__column">
          <div className="signup-patient__row">
            <label>Name Prefix: </label>
            <GenericList
              name="prefix"
              list={namePrefixCT}
              value={formDatas.prefix}
              handleChange={handleChange}
              placeHolder="Choose a name prefix..."
            />
          </div>
          <div className="signup-patient__row">
            <label htmlFor="first-name">First Name*: </label>
            <input
              type="text"
              value={formDatas.firstName}
              onChange={handleChange}
              name="firstName"
              autoComplete="off"
              id="first-name"
            />
          </div>
          <div className="signup-patient__row">
            <label htmlFor="middle-name">Middle Name: </label>
            <input
              type="text"
              value={formDatas.middleName}
              onChange={handleChange}
              name="middleName"
              autoComplete="off"
              id="middle-name"
            />
          </div>
          <div className="signup-patient__row">
            <label htmlFor="last-name">Last Name*: </label>
            <input
              type="text"
              value={formDatas.lastName}
              onChange={handleChange}
              name="lastName"
              autoComplete="off"
              id="last-name"
            />
          </div>
          <div className="signup-patient__row">
            <label>Last Name Suffix: </label>
            <GenericList
              name="suffix"
              list={nameSuffixCT}
              value={formDatas.suffix}
              handleChange={handleChange}
              placeHolder="Choose a last name suffix..."
            />
          </div>
          <div className="signup-patient__row">
            <label htmlFor="nick-name">Nick name: </label>
            <input
              type="text"
              value={formDatas.nickName}
              onChange={handleChange}
              name="nickName"
              autoComplete="off"
              id="nick-name"
            />
          </div>
          <div className="signup-patient__row">
            <label>Gender*: </label>
            <GenericList
              name="gender"
              list={genderCT}
              value={formDatas.gender}
              handleChange={handleChange}
              placeHolder="Choose a gender..."
            />
          </div>
          <div className="signup-patient__row">
            <label htmlFor="dob">Date of birth*: </label>
            <input
              type="date"
              value={formDatas.dob}
              onChange={handleChange}
              name="dob"
              max={timestampToDateISOTZ(nowTZTimestamp())}
              id="dob"
            />
          </div>
          <div className="signup-patient__row">
            <label htmlFor="hcn">Health Card#: </label>
            <input
              type="text"
              value={formDatas.healthNbr}
              onChange={handleChange}
              name="healthNbr"
              autoComplete="off"
              id="hcn"
            />
          </div>
          <div className="signup-patient__row">
            <label htmlFor="hcv">Health Card Version: </label>
            <input
              type="text"
              value={formDatas.healthVersion}
              onChange={handleChange}
              name="healthVersion"
              autoComplete="off"
              id="hcv"
            />
          </div>
          <div className="signup-patient__row">
            <label>Health Card Province: </label>
            <GenericList
              name="healthProvince"
              list={provinceStateTerritoryCT}
              value={formDatas.healthProvince}
              handleChange={handleChange}
              placeHolder="Choose a province..."
            />
          </div>
          <div className="signup-patient__row">
            <label htmlFor="hc_expiry">Health Card Expiry: </label>
            <input
              type="date"
              value={formDatas.healthExpiry}
              onChange={handleChange}
              name="healthExpiry"
              id="hc_expiry"
            />
          </div>
          <div className="signup-patient__row">
            <label htmlFor="sin">SIN: </label>
            <input
              type="text"
              value={formDatas.sin}
              onChange={handleChange}
              name="sin"
              autoComplete="off"
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
            <label htmlFor="line1">Address*: </label>
            <input
              type="text"
              value={formDatas.line1}
              onChange={handleChange}
              name="line1"
              autoComplete="off"
              id="line1"
            />
          </div>
          <div className="signup-patient__row">
            <label htmlFor="city">City*: </label>
            <input
              type="text"
              value={formDatas.city}
              onChange={handleChange}
              name="city"
              autoComplete="off"
              id="city"
            />
          </div>
          <div className="signup-patient__row">
            <label>Province/State: </label>
            <GenericList
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
            <input
              type="text"
              value={
                postalOrZip === "postal"
                  ? formDatas.postalCode
                  : formDatas.zipCode
              }
              onChange={handleChange}
              name="postalZipCode"
              autoComplete="off"
              id="postalZipCode"
              placeholder={
                postalOrZip === "postal" ? "A1A 1A1" : "12345 or 12345-6789"
              }
            />
          </div>
          <div className="signup-patient__row">
            <label htmlFor="cellphone">Cell Phone*: </label>
            <input
              type="tel"
              value={formDatas.cellphone}
              onChange={handleChange}
              name="cellphone"
              autoComplete="off"
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
            <label htmlFor="homephone">Home Phone: </label>
            <input
              type="tel"
              value={formDatas.homephone}
              onChange={handleChange}
              name="homephone"
              autoComplete="off"
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
            <label htmlFor="workphone">Work Phone: </label>
            <input
              type="tel"
              value={formDatas.workphone}
              onChange={handleChange}
              name="workphone"
              autoComplete="off"
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
            <label htmlFor="email">Email*: </label>
            <input
              type="email"
              value={formDatas.email}
              name="email"
              autoComplete="off"
              onChange={handleChange}
              id="email"
            />
          </div>
          <div className="signup-patient__row">
            <label>Preferred Official Language: </label>
            <GenericList
              name="preferredOffLang"
              list={officialLanguageCT}
              value={formDatas.preferredOffLang}
              handleChange={handleChange}
              placeHolder="Choose a preferred official language"
              noneOption={false}
            />
          </div>
          <div className="signup-patient__row signup-patient__row--avatar">
            <label htmlFor="avatar">Avatar: </label>
            <div className="signup-patient__image">
              <div className="signup-patient__image-preview">
                <div className="signup-patient__image-preview-square">
                  {formDatas.avatar ? (
                    <img
                      src={`${import.meta.env.VITE_XANO_BASE_URL}${
                        formDatas.avatar?.path
                      }`}
                      alt="avatar"
                    />
                  ) : (
                    <img src={avatarLogo} alt="user-avatar-placeholder" />
                  )}
                </div>
                <i
                  className="fa-solid fa-camera"
                  onClick={() => setWebcamVisible((v) => !v)}
                  style={{ cursor: "pointer" }}
                />
                {isLoadingFile && <CircularProgressSmall />}
              </div>
              <div className="signup-patient__image-options">
                <input
                  name="avatar"
                  type="file"
                  accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg"
                  onChange={handleAvatarChange}
                  id="avatar"
                />
              </div>
            </div>
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
