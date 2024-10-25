import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  AdminType,
  AttachmentType,
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
  //Hooks
  const { user } = useUserContext() as { user: AdminType };
  const { socket } = useSocketContext();
  const [formDatas, setFormDatas] = useState<StaffType>(infos);
  const [errMsg, setErrMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setFormDatas(infos);
  }, [infos]);

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
    if (file.size > 128000000) {
      toast.error("The file is over 128Mb, please choose another file", {
        containerId: "A",
      });
      return;
    }
    // setting up the reader
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
      setFormDatas({ ...formDatas, sign: fileToUpload });
      setIsLoadingFile(false);
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to load file: ${err.message}`, {
          containerId: "A",
        });
    }
  };

  const handleSave = async () => {
    try {
      setProgress(true);
      const full_name =
        formDatas.first_name +
        " " +
        (formDatas.middle_name ? formDatas.middle_name + " " : "") +
        formDatas.last_name;

      const datasToPut: StaffType = {
        ...formDatas,
        first_name: firstLetterUpper(formDatas.first_name),
        middle_name: firstLetterUpper(formDatas.middle_name),
        last_name: firstLetterUpper(formDatas.last_name),
        full_name: firstLetterUpper(full_name),
        speciality: firstLetterUpper(formDatas.speciality),
        subspeciality: firstLetterUpper(formDatas.subspeciality),
        updates: [
          ...(infos.updates ?? []),
          {
            date_updated: nowTZTimestamp(),
            updated_by_id: user.id,
            updated_by_user_type: "admin",
          },
        ],
        video_link:
          formDatas.video_link.trim() &&
          (!formDatas.video_link.includes("http") ||
            !formDatas.video_link.includes("https"))
            ? ["https://", formDatas.video_link].join("")
            : formDatas.video_link,
      };

      //Validation
      try {
        await staffSchema.validate(datasToPut);
      } catch (err) {
        if (err instanceof Error) setErrMsg(err.message);
        setProgress(false);
        return;
      }
      //Submission
      const response: StaffType = await xanoPut(
        `/staff/${infos.id}`,
        "admin",
        datasToPut
      );
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
    } catch (err) {
      if (err instanceof Error)
        setErrMsg(`Error: unable to save infos: ${err.message}`);
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
      {formDatas && (
        <div className="signup-staff__form">
          <div className="signup-staff__column">
            <div className="signup-staff__row">
              <label>Email*: </label>
              <p>{formDatas.email}</p>
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
                label="Middle Name: "
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
            <div className="signup-staff__row">
              <label htmlFor="status">Account status*: </label>
              <select
                required
                value={formDatas.account_status}
                onChange={handleChange}
                name="account_status"
                id="status"
              >
                <option value="" disabled>
                  Choose a status...
                </option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="Suspended">Suspended</option>
              </select>
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
                  img={formDatas.sign ?? null}
                  alt="staff-sign"
                  width={150}
                  placeholderText="Sign"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="signup-staff__btns">
        <SaveButton onClick={handleSave} disabled={isLoadingFile || progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </div>
  );
};

export default StaffAccountEdit;
