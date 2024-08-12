import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { AdminType, SiteType, StaffType } from "../../../types/api";
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
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";

type StaffAccountEditProps = {
  infos: StaffType;
  editVisible: boolean;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  sites: SiteType[];
};

const StaffAccountEdit = ({
  infos,
  editVisible,
  setEditVisible,
  sites,
}: StaffAccountEditProps) => {
  //HOOKS
  const [formDatas, setFormDatas] = useState<StaffType>(infos);
  const { user } = useUserContext() as { user: AdminType };
  const { socket } = useSocketContext();
  const [errMsg, setErrMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setErrMsg("");
    const value = e.target.value;
    setFormDatas({ ...formDatas, site_id: parseInt(value) });
  };

  const handleCancel = () => {
    setEditVisible(false);
  };

  const handleSignChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrMsg("");
    if (file.size > 25000000) {
      setErrMsg("File is over 25Mb, please choose another file");
      return;
    }
    // setting up the reader
    setIsLoadingFile(true);
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
        toast.error(`Error: unable to load file: ${err.message}`, {
          containerId: "A",
        });
      }
    };
  };

  const handleSave = async () => {
    try {
      setProgress(true);
      const full_name =
        formDatas.first_name +
        " " +
        (formDatas.middle_name ? formDatas.middle_name + " " : "") +
        formDatas.last_name;

      const datasToPut: StaffType = { ...formDatas };

      //Formatting
      datasToPut.first_name = firstLetterUpper(datasToPut.first_name);
      datasToPut.middle_name = firstLetterUpper(datasToPut.middle_name);
      datasToPut.last_name = firstLetterUpper(datasToPut.last_name);
      datasToPut.full_name = firstLetterUpper(full_name);
      datasToPut.speciality = firstLetterUpper(datasToPut.speciality);
      datasToPut.subspeciality = firstLetterUpper(datasToPut.subspeciality);
      datasToPut.updates = [
        ...(infos.updates ?? []),
        {
          date_updated: nowTZTimestamp(),
          updated_by_id: user?.id as number,
          updated_by_user_type: "admin",
        },
      ];
      if (
        datasToPut.video_link.trim() &&
        (!datasToPut.video_link.includes("http") ||
          !datasToPut.video_link.includes("https"))
      ) {
        datasToPut.video_link = ["https://", datasToPut.video_link].join("");
      }
      //Validation
      try {
        await staffSchema.validate(datasToPut);
      } catch (err) {
        setErrMsg(err.message);
        setProgress(false);
        return;
      }
      //Submission
      const response = await xanoPut(`/staff/${infos.id}`, "admin", datasToPut);
      socket?.emit("message", {
        route: "STAFF INFOS",
        action: "update",
        content: {
          id: infos.id,
          data: response,
        },
      });
      setEditVisible(false);
      toast.success("Infos changed successfully", { containerId: "A" });
      setProgress(false);
    } catch (err) {
      setErrMsg(`Error: unable to save infos: ${err.message}`);
      setProgress(false);
    }
  };

  return (
    <div
      className="staff-account__container"
      style={{ border: errMsg && editVisible ? "solid 1.5px red" : "" }}
    >
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      {formDatas && (
        <div className="staff-account__form">
          <div className="staff-account__column">
            <div className="staff-account__row">
              <label>Email*: </label>
              <p>{formDatas.email}</p>
            </div>
            <div className="staff-account__row">
              <Input
                value={formDatas.first_name}
                onChange={handleChange}
                name="first_name"
                id="first_name"
                label="First Name*: "
              />
            </div>
            <div className="staff-account__row">
              <Input
                value={formDatas.middle_name}
                onChange={handleChange}
                name="middle_name"
                id="middle_name"
                label="Midle Name*: "
              />
            </div>
            <div className="staff-account__row">
              <Input
                value={formDatas.last_name}
                onChange={handleChange}
                name="last_name"
                id="last_name"
                label="Last Name*: "
              />
            </div>
            <div className="staff-account__row">
              <SiteSelect
                handleSiteChange={handleSiteChange}
                sites={sites}
                value={formDatas.site_id}
                label="Site*: "
              />
            </div>
            <div className="staff-account__row">
              <GenderSelect
                id="gender"
                name="gender"
                value={formDatas.gender}
                onChange={handleChange}
                label="Gender*: "
              />
            </div>
            <div className="staff-account__row">
              <OccupationsSelect
                id="occupation"
                name="title"
                value={formDatas.title}
                onChange={handleChange}
                label="Occupation*: "
              />
            </div>
            <div className="staff-account__row">
              <label htmlFor="status">Account status*: </label>
              <select
                required
                value={formDatas.account_status}
                onChange={handleChange}
                name="account_status"
                id="status"
              >
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="staff-account__column">
            <div className="staff-account__row">
              <Input
                value={formDatas.speciality}
                onChange={handleChange}
                name="speciality"
                id="speciality"
                label="Speciality: "
              />
            </div>
            <div className="staff-account__row">
              <Input
                value={formDatas.subspeciality}
                onChange={handleChange}
                name="subspeciality"
                id="subspeciality"
                label="Sub speciality: "
              />
            </div>
            <div className="staff-account__row">
              <label htmlFor="licence">Licence#: </label>
              <Input
                value={formDatas.licence_nbr}
                onChange={handleChange}
                name="licence_nbr"
                id="licence_nbr"
                label="Licence#: "
              />
            </div>
            <div className="staff-account__row">
              <label htmlFor="ohip">OHIP#: </label>
              <Input
                value={formDatas.ohip_billing_nbr}
                onChange={handleChange}
                name="ohip_billing_nbr"
                id="ohip_billing_nbr"
                label="OHIP#: "
              />
            </div>
            <div className="staff-account__row">
              <InputTel
                value={formDatas.cell_phone}
                onChange={handleChange}
                name="cell_phone"
                id="cell_phone"
                label="Cell phone*: "
                placeholder="xxx-xxx-xxxx"
              />
            </div>
            <div className="staff-account__row">
              <InputTel
                value={formDatas.backup_phone}
                onChange={handleChange}
                name="backup_phone"
                id="backup_phone"
                label="Backup phone: "
                placeholder="xxx-xxx-xxxx"
              />
            </div>
            <div className="staff-account__row">
              <Input
                value={formDatas.video_link}
                onChange={handleChange}
                name="video_link"
                id="video_link"
                label="Link for video calls: "
                placeholder="https://my-video-link.com"
              />
            </div>
            <div className="staff-account__row">
              <label>E-sign: </label>
              <div className="staff-account__image">
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
        </div>
      )}
      <div className="staff-account__btns">
        <SaveButton onClick={handleSave} disabled={isLoadingFile || progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </div>
  );
};

export default StaffAccountEdit;
