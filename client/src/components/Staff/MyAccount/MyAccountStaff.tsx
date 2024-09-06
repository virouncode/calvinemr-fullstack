import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import { StaffType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { myAccountStaffSchema } from "../../../validation/accounts/myAccountStaffValidation";
import Button from "../../UI/Buttons/Button";
import CancelButton from "../../UI/Buttons/CancelButton";
import EditButton from "../../UI/Buttons/EditButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import InputTelToggle from "../../UI/Inputs/InputTelToggle";
import InputTextToggle from "../../UI/Inputs/InputTextToggle";
import SiteSelect from "../../UI/Lists/SiteSelect";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";

const MyAccountStaff = () => {
  //Hooks
  const navigate = useNavigate();
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);
  const [formDatas, setFormDatas] = useState<StaffType>(
    staffInfos.find(({ id }) => id === user.id) as StaffType
  );
  const [tempFormDatas, setTempFormDatas] = useState<StaffType>(
    staffInfos.find(({ id }) => id === user.id) as StaffType
  );
  const [errMsg, setErrMsg] = useState("");
  const [progress, setProgress] = useState(false);
  //Queries
  const { data: sites, isPending, error } = useSites();

  useEffect(() => {
    setFormDatas(staffInfos.find(({ id }) => id === user.id) as StaffType);
    setTempFormDatas(staffInfos.find(({ id }) => id === user.id) as StaffType);
  }, [staffInfos, user.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setTempFormDatas({ ...(tempFormDatas as StaffType), [name]: value });
  };

  const handleChangeCredentials = () => {
    navigate("/staff/credentials");
  };

  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTempFormDatas({
      ...(tempFormDatas as StaffType),
      site_id: parseInt(e.target.value),
    });
  };

  const handleEdit = () => {
    setEditVisible(true);
  };

  const handleSave = async () => {
    //Validation
    try {
      await myAccountStaffSchema.validate(tempFormDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    try {
      //Submission
      setProgress(true);
      const response: StaffType = await xanoPut(
        `/staff/${user.id}`,
        "staff",
        tempFormDatas as StaffType
      );
      socket?.emit("message", {
        route: "USER",
        action: "update",
        content: {
          id: user.id,
          data: {
            ...user,
            cell_phone: tempFormDatas.cell_phone,
            backup_phone: tempFormDatas.backup_phone,
            video_link: tempFormDatas.video_link,
          },
        },
      });
      socket?.emit("message", {
        route: "STAFF INFOS",
        action: "update",
        content: {
          id: user.id,
          data: response,
        },
      });
      setEditVisible(false);
      toast.success(`Infos changed successfully`, { containerId: "A" });
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to save infos: ${err.message}`, {
          containerId: "A",
        });
    } finally {
      setProgress(false);
    }
  };

  const handleCancel = () => {
    setErrMsg("");
    setTempFormDatas(formDatas);
    setEditVisible(false);
  };

  if (isPending)
    return (
      <div className="myaccount__container">
        <LoadingParagraph />
      </div>
    );
  if (error)
    return (
      <div className="myaccount__container">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  return (
    <div
      className="myaccount__container"
      style={{ border: errMsg && "solid 1px red" }}
    >
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      {tempFormDatas && (
        <div className="myaccount__form">
          <div className="myaccount__column">
            <div className="myaccount__row">
              <label>Email*: </label>
              <p>{tempFormDatas.email}</p>
            </div>
            <div className="myaccount__row">
              <label>First Name*: </label>
              <p>{tempFormDatas.first_name}</p>
            </div>
            <div className="myaccount__row">
              <label>Middle Name: </label>
              <p>{tempFormDatas.middle_name}</p>
            </div>
            <div className="myaccount__row">
              <label>Last Name*: </label>
              <p>{tempFormDatas.last_name}</p>
            </div>
            <div className="myaccount__row">
              {editVisible ? (
                <SiteSelect
                  handleSiteChange={handleSiteChange}
                  sites={sites}
                  value={tempFormDatas.site_id}
                  label="Site*:"
                />
              ) : (
                <p>{tempFormDatas.site_infos?.name ?? ""}</p>
              )}
            </div>
            <div className="myaccount__row">
              <label>Gender*: </label>
              <p>{tempFormDatas.gender}</p>
            </div>
            <div className="myaccount__row">
              <label>Occupation*: </label>
              <p>{tempFormDatas.title}</p>
            </div>
            <div className="myaccount__row">
              <label>Speciality: </label>
              <p>{tempFormDatas.speciality}</p>
            </div>
          </div>
          <div className="myaccount__column">
            <div className="myaccount__row">
              <label>Subspeciality: </label>
              <p>{tempFormDatas.subspeciality}</p>
            </div>
            <div className="myaccount__row">
              <label>Licence#: </label>
              <p>{tempFormDatas.licence_nbr}</p>
            </div>
            <div className="myaccount__row">
              <label>OHIP#: </label>
              <p>{tempFormDatas.licence_nbr}</p>
            </div>
            <div className="myaccount__row">
              <InputTelToggle
                value={tempFormDatas.cell_phone}
                onChange={handleChange}
                name="cell_phone"
                id="cellphone"
                label="Cell phone*:"
                placeholder="xxx-xxx-xxxx"
                editVisible={editVisible}
              />
            </div>
            <div className="myaccount__row">
              <InputTelToggle
                value={tempFormDatas.backup_phone}
                onChange={handleChange}
                name="backup_phone"
                id="backupphone"
                label="Backup phone*:"
                placeholder="xxx-xxx-xxxx"
                editVisible={editVisible}
              />
            </div>
            <div className="myaccount__row">
              <InputTextToggle
                value={tempFormDatas.video_link}
                onChange={handleChange}
                name="video_link"
                id="video_link"
                editVisible={editVisible}
                label="Link for video calls:"
                placeholder="https://mylink.com"
              />
            </div>
            <div className="myaccount__row">
              <label>E-sign: </label>
              <div className="myaccount__image">
                {tempFormDatas.sign ? (
                  <img
                    src={`${import.meta.env.VITE_XANO_BASE_URL}${
                      tempFormDatas.sign?.path
                    }`}
                    alt="e-sign"
                    width="150px"
                  />
                ) : (
                  <img
                    src="https://placehold.co/150x100/png?font=roboto&text=Sign"
                    alt="user-avatar-placeholder"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="myaccount__btns">
        {editVisible ? (
          <>
            <SaveButton onClick={handleSave} disabled={progress} />
            <CancelButton onClick={handleCancel} disabled={progress} />
          </>
        ) : (
          <>
            <EditButton onClick={handleEdit} disabled={progress} />
            <Button
              onClick={handleChangeCredentials}
              disabled={progress}
              label="Change login credentials"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MyAccountStaff;
