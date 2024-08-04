import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { staffSchema } from "../../../validation/signup/staffValidation";
import SiteSelect from "../../Staff/EventForm/SiteSelect";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Input from "../../UI/Inputs/Input";
import InputImgFile from "../../UI/Inputs/InputImgFile";
import InputTel from "../../UI/Inputs/InputTel";
import GenderSelect from "../../UI/Lists/GenderSelect";
import OccupationsSelect from "../../UI/Lists/OccupationsSelect";

axios.defaults.withCredentials = true;

const SignupStaffForm = ({ setAddVisible, sites }) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { clinic } = useClinicContext();
  const [errMsg, setErrMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [formDatas, setFormDatas] = useState({
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    site_id: 1,
    gender: "Male",
    title: "Doctor",
    access_level: "staff",
    speciality: "",
    subspeciality: "",
    licence_nbr: "",
    ohip_billing_nbr: "",
    account_status: "Active",
    cell_phone: "",
    backup_phone: "",
    video_link: "",
    ai_consent: true,
    sign: null,
  });
  const [progress, setProgress] = useState(false);

  const handleSiteChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    setFormDatas({ ...formDatas, site_id: parseInt(value) });
  };

  const handleCancel = () => {
    setAddVisible(false);
  };

  const handleChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleSignChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrMsg("");
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
        let fileToUpload = await xanoPost(
          "/upload/attachment",
          "admin",

          { content }
        );
        setFormDatas({ ...formDatas, sign: fileToUpload });
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
    setProgress(true);
    //Validation
    try {
      const full_name =
        formDatas.first_name +
        " " +
        (formDatas.middle_name ? formDatas.middle_name + " " : "") +
        formDatas.last_name;

      const datasToPost = {
        ...formDatas,
        created_by_id: user.id,
        date_created: nowTZTimestamp(),
      };

      //Formatting
      datasToPost.email = datasToPost.email.toLowerCase();
      datasToPost.first_name = firstLetterUpper(datasToPost.first_name);
      datasToPost.middle_name = firstLetterUpper(datasToPost.middle_name);
      datasToPost.last_name = firstLetterUpper(datasToPost.last_name);
      datasToPost.full_name = firstLetterUpper(full_name);
      datasToPost.speciality = firstLetterUpper(datasToPost.speciality);
      datasToPost.subspeciality = firstLetterUpper(datasToPost.subspeciality);
      if (
        datasToPost.video_link.trim() &&
        (!datasToPost.video_link.includes("http") ||
          !datasToPost.video_link.includes("https"))
      ) {
        datasToPost.video_link = ["https://", datasToPost.video_link].join("");
      }
      datasToPost.clinic_name = clinic.name; //For the email sent to the new staff member
      //Validation
      try {
        await staffSchema.validate(datasToPost);
      } catch (err) {
        setErrMsg(err.message);
        setProgress(false);
        return;
      }
      try {
        const response = await xanoGet("/staff_with_email", "admin", {
          email: datasToPost.email,
        });

        if (response) {
          setErrMsg(
            "There is already an account with this email, please choose another one"
          );
          setProgress(false);
          return;
        }
      } catch (err) {
        setErrMsg(`Unable to post new staff member: ${err.message}`);
        setProgress(false);
        return;
      }
      //Submission
      const response = await axios.post(`/api/xano/new_staff`, datasToPost);
      socket.emit("message", {
        route: "STAFF INFOS",
        action: "create",
        content: { data: response.data },
      });
      await xanoPost("/settings", "admin", {
        staff_id: response.data.id,
        slot_duration: "00:15",
        first_day: "1",
        autolock_time_min: 30,
        authorized_messages_patients_ids: [],
        invitation_templates: [
          {
            name: "In person appointment",
            intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment.\n`,
            infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
            message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nBring your OHIP card and any relevant documentation.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\n`,
          },
          {
            name: "Video appointment",
            intro: `This email/text message is to remind you about your upcoming VIDEO appointment.\n`,
            infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: This appointment is online. DO NOT COME TO THE CLINIC.\n\nPlease login 5 minutes before your appointment by clicking the following link:\n[video_call_link]\n\n`,
            message: `You will be directed to the virtual waiting room. The physician will let you in the meeting once available.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\n`,
          },
          {
            name: "Phone appointment",
            intro: `This email/text message is to remind you about your upcoming PHONE appointment.\n`,
            infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: This appointment is a phone call. DO NOT COME TO THE CLINIC.\n\n`,
            message: `Please make sure your phone is on and not on mute. The call will come from the clinic, or a No Caller ID number.\nIf you do not answer the phone, the appointment could be cancelled and rescheduled.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\n`,
          },
          {
            name: "Surgery/Procedure",
            intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment for your Surgery/Procedure.\n`,
            infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
            message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nBring your OHIP card and any relevant documentation.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\nSpecial instructions:\nPlease do not eat or drink for at least 6 hours before your appointment.\n\n`,
          },
          {
            name: "Meeting",
            intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment.\n`,
            infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
            message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\n`,
          },
          {
            name: "Diagnostic Imaging",
            intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment for your Diagnostic Imaging procedure (ultrasound, X-ray, etc…)\n`,
            infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
            message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nBring your OHIP card and any relevant documentation.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\nSpecial instructions:\nPlease do not eat or drink for at least 6 hours before your appointment.\n\n`,
          },
          {
            name: "Blood test / Urine test",
            intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment for your blood and/or urine test.\n`,
            infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
            message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nBring your OHIP card and any relevant documentation.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\nSpecial instructions:\nPlease do not eat or drink for at least 6 hours before your appointment.\n\n`,
          },
          { name: "[Blank]", intro: "", infos: "", message: "" },
        ],
        date_created: nowTZTimestamp(),
        clinical_notes_order: "desc",
      });

      await xanoPost("/availability", "admin", {
        staff_id: response.data.id,
        date_created: nowTZTimestamp(),
        schedule_morning: {
          monday: [
            { hours: "09", min: "00", ampm: "AM" },
            { hours: "12", min: "00", ampm: "PM" },
          ],
          tuesday: [
            { hours: "09", min: "00", ampm: "AM" },
            { hours: "12", min: "00", ampm: "PM" },
          ],
          wednesday: [
            { hours: "09", min: "00", ampm: "AM" },
            { hours: "12", min: "00", ampm: "PM" },
          ],
          thursday: [
            { hours: "09", min: "00", ampm: "AM" },
            { hours: "12", min: "00", ampm: "PM" },
          ],
          friday: [
            { hours: "09", min: "00", ampm: "AM" },
            { hours: "12", min: "00", ampm: "PM" },
          ],
          saturday: [
            { hours: "09", min: "00", ampm: "AM" },
            { hours: "12", min: "00", ampm: "PM" },
          ],
          sunday: [
            { hours: "09", min: "00", ampm: "AM" },
            { hours: "12", min: "00", ampm: "PM" },
          ],
        },
        schedule_afternoon: {
          monday: [
            { hours: "01", min: "00", ampm: "PM" },
            { hours: "04", min: "00", ampm: "PM" },
          ],
          tuesday: [
            { hours: "01", min: "00", ampm: "PM" },
            { hours: "04", min: "00", ampm: "PM" },
          ],
          wednesday: [
            { hours: "01", min: "00", ampm: "PM" },
            { hours: "04", min: "00", ampm: "PM" },
          ],
          thursday: [
            { hours: "01", min: "00", ampm: "PM" },
            { hours: "04", min: "00", ampm: "PM" },
          ],
          friday: [
            { hours: "01", min: "00", ampm: "PM" },
            { hours: "04", min: "00", ampm: "PM" },
          ],
          saturday: [
            { hours: "01", min: "00", ampm: "PM" },
            { hours: "04", min: "00", ampm: "PM" },
          ],
          sunday: [
            { hours: "01", min: "00", ampm: "PM" },
            { hours: "04", min: "00", ampm: "PM" },
          ],
        },
        unavailability: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        },
        default_duration_hours: 1,
        default_duration_min: 0,
      });
      await xanoPost("/notepads", "admin", {
        staff_id: response.data.id,
        date_created: nowTZTimestamp(),
        notes: "",
      });

      toast.success("Staff member added successfully", { containerId: "A" });
      setAddVisible(false);
      setProgress(false);
    } catch (err) {
      setErrMsg(err.message);
      setProgress(false);
    }
  };
  return (
    <div
      className="signup-staff__container"
      style={{ border: errMsg && "solid 1.5px red" }}
    >
      {errMsg && <p className="signup-staff__err">{errMsg}</p>}
      <form className="signup-staff__form">
        <div className="signup-staff__column">
          <div className="signup-staff__row">
            <Input
              value={formDatas.email}
              onChange={handleChange}
              name="email"
              id="email"
              label="Email*: "
            />
          </div>
          <div className="signup-staff__row">
            <Input
              value={formDatas.first_name}
              onChange={handleChange}
              name="first_name"
              id="first_name"
              label="First Name*: "
            />
          </div>
          <div className="signup-staff__row">
            <Input
              value={formDatas.middle_name}
              onChange={handleChange}
              name="middle_name"
              id="middle_name"
              label="Midle Name*: "
            />
          </div>
          <div className="signup-staff__row">
            <Input
              value={formDatas.last_name}
              onChange={handleChange}
              name="last_name"
              id="last_name"
              label="Last Name*: "
            />
          </div>
          <div className="signup-staff__row">
            <SiteSelect
              handleSiteChange={handleSiteChange}
              sites={sites}
              value={formDatas.site_id}
              label="Site*: "
            />
          </div>
          <div className="signup-staff__row">
            <GenderSelect
              id="gender"
              name="gender"
              value={formDatas.gender}
              onChange={handleChange}
              label="Gender*: "
            />
          </div>
          <div className="signup-staff__row">
            <OccupationsSelect
              id="occupation"
              name="title"
              value={formDatas.title}
              onChange={handleChange}
              label="Occupation*: "
            />
          </div>
        </div>

        <div className="signup-staff__column">
          <div className="signup-staff__row">
            <Input
              value={formDatas.speciality}
              onChange={handleChange}
              name="speciality"
              id="speciality"
              label="Speciality: "
            />
          </div>
          <div className="signup-staff__row">
            <Input
              value={formDatas.subspeciality}
              onChange={handleChange}
              name="subspeciality"
              id="subspeciality"
              label="Sub speciality: "
            />
          </div>
          <div className="signup-staff__row">
            <Input
              value={formDatas.licence_nbr}
              onChange={handleChange}
              name="licence_nbr"
              id="licence_nbr"
              label="Licence#: "
            />
          </div>
          <div className="signup-staff__row">
            <Input
              value={formDatas.ohip_billing_nbr}
              onChange={handleChange}
              name="ohip_billing_nbr"
              id="ohip_billing_nbr"
              label="OHIP#: "
            />
          </div>
          <div className="signup-staff__row">
            <InputTel
              value={formDatas.cell_phone}
              onChange={handleChange}
              name="cell_phone"
              id="cell_phone"
              label="Cell phone*: "
              placeholder="xxx-xxx-xxxx"
            />
          </div>
          <div className="signup-staff__row">
            <InputTel
              value={formDatas.backup_phone}
              onChange={handleChange}
              name="backup_phone"
              id="backup_phone"
              label="Backup phone: "
              placeholder="xxx-xxx-xxxx"
            />
          </div>
          <div className="signup-staff__row">
            <Input
              value={formDatas.video_link}
              onChange={handleChange}
              name="video_link"
              id="video_link"
              label="Link for video calls: "
              placeholder="https://my-video-link.com"
            />
          </div>
          <div className="signup-staff__row">
            <label>E-sign: </label>
            <div className="signup-staff__image">
              <InputImgFile
                isLoadingFile={isLoadingFile}
                onChange={handleSignChange}
                img={formDatas.sign}
                alt="staff-sign"
                width={150}
              />
            </div>
          </div>
        </div>
      </form>
      <div className="signup-staff__submit">
        <SaveButton
          onClick={handleSubmit}
          disabled={progress}
          label="Sign Up"
        />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </div>
  );
};

export default SignupStaffForm;
