import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import { myAccountStaffSchema } from "../../../validation/accounts/myAccountStaffValidation";
import SiteSelect from "../EventForm/SiteSelect";

const MyAccountStaff = () => {
  //HOOKS
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);
  const [formDatas, setFormDatas] = useState(null);
  const [tempFormDatas, setTempFormDatas] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [progress, setProgress] = useState(false);
  const navigate = useNavigate();
  const { data: sites } = useSites();

  useEffect(() => {
    setFormDatas(staffInfos.find(({ id }) => id === user.id));
    setTempFormDatas(staffInfos.find(({ id }) => id === user.id));
  }, [staffInfos, user.id]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setTempFormDatas({ ...tempFormDatas, [name]: value });
  };

  const handleChangeCredentials = () => {
    navigate("/staff/credentials");
  };

  const handleSiteChange = (e) => {
    setTempFormDatas({ ...tempFormDatas, site_id: parseInt(e.target.value) });
  };

  const handleEdit = () => {
    setEditVisible(true);
  };

  const handleSave = async () => {
    //Validation
    try {
      await myAccountStaffSchema.validate(tempFormDatas);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    try {
      //Submission
      setProgress(true);
      const response = await xanoPut(
        `/staff/${user.id}`,
        "staff",
        tempFormDatas
      );
      socket.emit("message", {
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
      socket.emit("message", {
        route: "STAFF INFOS",
        action: "update",
        content: {
          id: user.id,
          data: response,
        },
      });
      setEditVisible(false);
      setProgress(false);
      toast.success(`Infos changed successfully`, { containerId: "A" });
    } catch (err) {
      toast.error(`Error: unable to save infos: ${err.message}`, {
        containerId: "A",
      });
      setProgress(false);
    }
  };

  const handleCancel = () => {
    setErrMsg("");
    setTempFormDatas(formDatas);
    setEditVisible(false);
  };

  return (
    <div
      className="myaccount-section__container"
      style={{ border: errMsg && "solid 1px red" }}
    >
      {errMsg && <p className="myaccount-section__err">{errMsg}</p>}
      {tempFormDatas && (
        <div className="myaccount-section__form">
          <div className="myaccount-section__column">
            <div className="myaccount-section__row">
              <label>Email*: </label>
              <p>{tempFormDatas.email}</p>
            </div>
            <div className="myaccount-section__row">
              <label>First Name*: </label>
              <p>{tempFormDatas.first_name}</p>
            </div>
            <div className="myaccount-section__row">
              <label>Middle Name: </label>
              <p>{tempFormDatas.middle_name}</p>
            </div>
            <div className="myaccount-section__row">
              <label>Last Name*: </label>
              <p>{tempFormDatas.last_name}</p>
            </div>
            <div className="myaccount-section__row">
              <label>Site*: </label>
              {editVisible ? (
                <SiteSelect
                  handleSiteChange={handleSiteChange}
                  sites={sites}
                  value={tempFormDatas.site_id}
                  label={false}
                />
              ) : (
                <p>{tempFormDatas.site_infos.name}</p>
              )}
            </div>
            <div className="myaccount-section__row">
              <label>Gender*: </label>
              <p>{tempFormDatas.gender}</p>
            </div>
            <div className="myaccount-section__row">
              <label>Occupation*: </label>
              <p>{tempFormDatas.title}</p>
            </div>
            <div className="myaccount-section__row">
              <label>Speciality: </label>
              <p>{tempFormDatas.speciality}</p>
            </div>
          </div>
          <div className="myaccount-section__column">
            <div className="myaccount-section__row">
              <label>Subspeciality: </label>
              <p>{tempFormDatas.subspeciality}</p>
            </div>
            <div className="myaccount-section__row">
              <label>Licence#: </label>
              <p>{tempFormDatas.licence_nbr}</p>
            </div>
            <div className="myaccount-section__row">
              <label>OHIP#: </label>
              <p>{tempFormDatas.licence_nbr}</p>
            </div>
            <div className="myaccount-section__row">
              <label htmlFor="cellphone">Cell phone*: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.cell_phone}
                  onChange={handleChange}
                  name="cell_phone"
                  autoComplete="off"
                  required
                  id="cellphone"
                  placeholder="xxx-xxx-xxxx"
                />
              ) : (
                <p>{tempFormDatas.cell_phone}</p>
              )}
            </div>
            <div className="myaccount-section__row">
              <label htmlFor="backupphone">Backup phone: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.backup_phone}
                  onChange={handleChange}
                  name="backup_phone"
                  autoComplete="off"
                  id="backupphone"
                  placeholder="xxx-xxx-xxxx"
                />
              ) : (
                <p>{tempFormDatas.backup_phone}</p>
              )}
            </div>
            <div className="myaccount-section__row">
              <label htmlFor="video_link">Link for video calls: </label>
              {editVisible ? (
                <input
                  name="video_link"
                  type="text"
                  autoComplete="off"
                  value={tempFormDatas.video_link}
                  onChange={handleChange}
                  id="video_link"
                />
              ) : (
                <p>{tempFormDatas.video_link}</p>
              )}
            </div>
            {/* <div className="myaccount-section__row">
              <label>AI consent: </label>
              <p>{tempFormDatas.ai_consent ? "Yes" : "No"}</p>
            </div> */}
            <div className="myaccount-section__row">
              <label>E-sign: </label>
              <div className="myaccount-section__image">
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
      <div className="myaccount-section__btns">
        {editVisible ? (
          <>
            <button
              onClick={handleSave}
              disabled={progress}
              className="save-btn"
            >
              Save
            </button>
            <button onClick={handleCancel} disabled={progress}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={handleEdit} disabled={progress}>
              Edit
            </button>
            <button onClick={handleChangeCredentials} disabled={progress}>
              Change login credentials
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyAccountStaff;
