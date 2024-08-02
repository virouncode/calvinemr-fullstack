import { useState } from "react";
import { useNavigate } from "react-router-dom";

import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useAdminsInfosContext from "../../../hooks/context/useAdminsInfosContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { myAccountAdminSchema } from "../../../validation/accounts/myAccountAdminValidation";

const MyAccountAdmin = () => {
  //HOOKS
  const { user } = useUserContext();
  const { adminsInfos } = useAdminsInfosContext();
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);
  const [tempFormDatas, setTempFormDatas] = useState(
    adminsInfos.find(({ id }) => id === user.id)
  );
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [progress, setProgress] = useState(false);
  const navigate = useNavigate();

  const initialDatas = adminsInfos.find(({ id }) => id === user.id);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setTempFormDatas({ ...tempFormDatas, [name]: value });
  };

  const handleChangeCredentials = (e) => {
    navigate("/admin/credentials");
  };

  const handleEdit = (e) => {
    setEditVisible(true);
  };

  const handleSave = async (e) => {
    //Validation
    try {
      await myAccountAdminSchema.validate(tempFormDatas);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    try {
      //Submission
      setProgress(true);
      const datasToPut = {
        id: tempFormDatas.id,
        date_created: tempFormDatas.date_created,
        updates: [...tempFormDatas.updates, { date_updated: nowTZTimestamp() }],
        email: tempFormDatas.email.toLowerCase(),
        access_level: tempFormDatas.access_level,
        temp_login: tempFormDatas.temp_login,
        first_name: firstLetterUpper(tempFormDatas.first_name),
        last_name: firstLetterUpper(tempFormDatas.last_name),
        full_name:
          firstLetterUpper(tempFormDatas.first_name) +
          " " +
          firstLetterUpper(tempFormDatas.last_name),
      };
      const response = await xanoPut(`/admin/${user.id}`, "admin", datasToPut);
      setSuccessMsg("Infos changed successfully");
      socket.emit("message", {
        route: "USER",
        action: "update",
        content: {
          id: user.id,
          data: response,
        },
      });
      socket.emit("message", {
        route: "ADMINS INFOS",
        action: "update",
        content: {
          id: user.id,
          data: response,
        },
      });

      setEditVisible(false);
      setProgress(false);
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      setErrMsg(`Error: unable to save infos: ${err.message}`);
      setProgress(false);
    }
  };

  const handleCancel = (e) => {
    setErrMsg("");
    setTempFormDatas(initialDatas);
    setEditVisible(false);
  };

  return (
    <div className="myaccount-section__container" style={{ width: "25%" }}>
      {errMsg && <p className="myaccount-section__err">{errMsg}</p>}
      {successMsg && <p className="myaccount-section__success">{successMsg}</p>}
      {tempFormDatas && (
        <div className="myaccount-section__form">
          <div style={{ margin: "0 auto" }}>
            <div className="myaccount-section__row">
              <label>Email*: </label>
              <p>{tempFormDatas.email}</p>
            </div>
            <div className="myaccount-section__row">
              <label htmlFor="first-name">First Name*: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.first_name}
                  onChange={handleChange}
                  name="first_name"
                  autoComplete="off"
                  id="first-name"
                />
              ) : (
                <p>{tempFormDatas.first_name}</p>
              )}
            </div>
            <div className="myaccount-section__row">
              <label html="last-name">Last Name*: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.last_name}
                  onChange={handleChange}
                  name="last_name"
                  autoComplete="off"
                  id="last-name"
                />
              ) : (
                <p>{tempFormDatas.last_name}</p>
              )}
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

export default MyAccountAdmin;
