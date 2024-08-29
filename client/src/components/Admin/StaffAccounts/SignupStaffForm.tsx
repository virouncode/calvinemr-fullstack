import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { xanoDeleteBatch } from "../../../api/xanoCRUD/xanoDelete";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  AdminType,
  ClinicType,
  NotepadType,
  SettingsType,
  SiteType,
  StaffType,
} from "../../../types/api";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { staffSchema } from "../../../validation/signup/staffValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Input from "../../UI/Inputs/Input";
import InputImgFile from "../../UI/Inputs/InputImgFile";
import InputTel from "../../UI/Inputs/InputTel";
import GenderSelect from "../../UI/Lists/GenderSelect";
import OccupationsSelect from "../../UI/Lists/OccupationsSelect";
import SiteSelect from "../../UI/Lists/SiteSelect";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
axios.defaults.withCredentials = true;

type SignupStaffFormProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  sites: SiteType[];
};

const SignupStaffForm = ({ setAddVisible, sites }: SignupStaffFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: AdminType };
  const { socket } = useSocketContext();
  const { clinic } = useClinicContext() as { clinic: ClinicType };
  const [errMsg, setErrMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [formDatas, setFormDatas] = useState<Partial<StaffType> | undefined>();
  const [progress, setProgress] = useState(false);

  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setErrMsg("");
    const value = e.target.value;
    setFormDatas({ ...formDatas, site_id: parseInt(value) });
  };

  const handleCancel = () => {
    setAddVisible(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleSignChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      const content = e.target?.result; // this is the content!
      try {
        const fileToUpload = await xanoPost(
          "/upload/attachment",
          "admin",

          { content }
        );
        setFormDatas({ ...formDatas, sign: fileToUpload });
        setIsLoadingFile(false);
      } catch (err) {
        if (err instanceof Error)
          toast.error(`Error unable to load file: ${err.message}`, {
            containerId: "A",
          });
        setIsLoadingFile(false);
      }
    };
  };
  const handleSubmit = async () => {
    setErrMsg("");
    setProgress(true);
    const successfulRequests: { endpoint: string; id: number }[] = [];
    //Validation
    try {
      const full_name =
        formDatas?.first_name +
        " " +
        (formDatas?.middle_name ? formDatas.middle_name + " " : "") +
        formDatas?.last_name;

      const datasToPost: Partial<StaffType> & { clinic_name: string } = {
        ...formDatas,
        created_by_id: user?.id,
        date_created: nowTZTimestamp(),
        access_level: "staff",
        account_status: "Active",
        ai_consent: true,
        clinic_name: clinic.name,
      };

      //Formatting
      datasToPost.email = datasToPost.email?.toLowerCase() ?? "";
      datasToPost.first_name = firstLetterUpper(datasToPost.first_name ?? "");
      datasToPost.middle_name = firstLetterUpper(datasToPost.middle_name ?? "");
      datasToPost.last_name = firstLetterUpper(datasToPost.last_name ?? "");
      datasToPost.full_name = firstLetterUpper(full_name);
      datasToPost.speciality = firstLetterUpper(datasToPost.speciality ?? "");
      datasToPost.subspeciality = firstLetterUpper(
        datasToPost.subspeciality ?? ""
      );
      if (
        datasToPost.video_link?.trim() &&
        (!datasToPost.video_link.includes("http") ||
          !datasToPost.video_link.includes("https"))
      ) {
        datasToPost.video_link = ["https://", datasToPost.video_link].join("");
      }
      //Validation
      try {
        await staffSchema.validate(datasToPost);
      } catch (err) {
        if (err instanceof Error) setErrMsg(err.message);
        setProgress(false);
        return;
      }
      try {
        const existingStaff = await xanoGet("/staff_with_email", "admin", {
          email: datasToPost.email,
        });

        if (existingStaff) {
          setErrMsg(
            "There is already an account with this email, please choose another one"
          );
          setProgress(false);
          return;
        }
      } catch (err) {
        if (err instanceof Error)
          setErrMsg(`Unable to post new staff member: ${err.message}`);
        setProgress(false);
        return;
      }
      //Submission
      const staffResponse: StaffType = (
        await axios.post(`/api/xano/new_staff`, datasToPost)
      ).data;
      successfulRequests.push({ endpoint: "/staff", id: staffResponse.id });
      socket?.emit("message", {
        route: "STAFF INFOS",
        action: "create",
        content: { data: staffResponse },
      });
      const settingsResponse: SettingsType = await xanoPost(
        "/settings",
        "admin",
        {
          staff_id: staffResponse.id,
          slot_duration: "00:15",
          first_day: 1,
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
        }
      );
      successfulRequests.push({
        endpoint: "/settings",
        id: settingsResponse.id,
      });

      const availabilityResponse = await xanoPost("/availability", "admin", {
        staff_id: staffResponse.id,
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
      console.log("ok availability");
      successfulRequests.push({
        endpoint: "/availability",
        id: availabilityResponse.id,
      });
      const notepadResponse: NotepadType = await xanoPost(
        "/notepads",
        "admin",
        {
          staff_id: staffResponse.id,
          date_created: nowTZTimestamp(),
          notes: "",
        }
      );
      console.log("ok notepad");
      successfulRequests.push({
        endpoint: "/notepads",
        id: notepadResponse.id,
      });
      toast.success("Staff member added successfully", { containerId: "A" });
      setAddVisible(false);
    } catch (err) {
      if (err instanceof Error)
        setErrMsg(`Unable to add staff member : ${err.message}`);
      await xanoDeleteBatch(successfulRequests, "admin");
    } finally {
      setProgress(false);
    }
  };
  return (
    <div
      className="signup-staff__container"
      style={{ border: errMsg && "solid 1.5px red" }}
    >
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <form className="signup-staff__form">
        <div className="signup-staff__column">
          <div className="signup-staff__row">
            <Input
              value={formDatas?.email ?? ""}
              onChange={handleChange}
              name="email"
              id="email"
              label="Email*: "
            />
          </div>
          <div className="signup-staff__row">
            <Input
              value={formDatas?.first_name ?? ""}
              onChange={handleChange}
              name="first_name"
              id="first_name"
              label="First Name*: "
            />
          </div>
          <div className="signup-staff__row">
            <Input
              value={formDatas?.middle_name ?? ""}
              onChange={handleChange}
              name="middle_name"
              id="middle_name"
              label="Middle Name: "
            />
          </div>
          <div className="signup-staff__row">
            <Input
              value={formDatas?.last_name ?? ""}
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
              value={formDatas?.site_id ?? 0}
              label="Site*: "
            />
          </div>
          <div className="signup-staff__row">
            <GenderSelect
              id="gender"
              name="gender"
              value={formDatas?.gender ?? "Male"}
              onChange={handleChange}
              label="Gender*: "
            />
          </div>
          <div className="signup-staff__row">
            <OccupationsSelect
              id="occupation"
              name="title"
              value={formDatas?.title ?? "Doctor"}
              onChange={handleChange}
              label="Occupation*: "
            />
          </div>
        </div>

        <div className="signup-staff__column">
          <div className="signup-staff__row">
            <Input
              value={formDatas?.speciality ?? ""}
              onChange={handleChange}
              name="speciality"
              id="speciality"
              label="Speciality: "
            />
          </div>
          <div className="signup-staff__row">
            <Input
              value={formDatas?.subspeciality ?? ""}
              onChange={handleChange}
              name="subspeciality"
              id="subspeciality"
              label="Sub speciality: "
            />
          </div>
          <div className="signup-staff__row">
            <Input
              value={formDatas?.licence_nbr ?? ""}
              onChange={handleChange}
              name="licence_nbr"
              id="licence_nbr"
              label="Licence#: "
            />
          </div>
          <div className="signup-staff__row">
            <Input
              value={formDatas?.ohip_billing_nbr ?? ""}
              onChange={handleChange}
              name="ohip_billing_nbr"
              id="ohip_billing_nbr"
              label="OHIP#: "
            />
          </div>
          <div className="signup-staff__row">
            <InputTel
              value={formDatas?.cell_phone ?? ""}
              onChange={handleChange}
              name="cell_phone"
              id="cell_phone"
              label="Cell phone*: "
              placeholder="xxx-xxx-xxxx"
            />
          </div>
          <div className="signup-staff__row">
            <InputTel
              value={formDatas?.backup_phone ?? ""}
              onChange={handleChange}
              name="backup_phone"
              id="backup_phone"
              label="Backup phone: "
              placeholder="xxx-xxx-xxxx"
            />
          </div>
          <div className="signup-staff__row">
            <Input
              value={formDatas?.video_link ?? ""}
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
                img={formDatas?.sign ?? null}
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
