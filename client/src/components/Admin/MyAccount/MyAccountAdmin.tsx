import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { AdminType } from "../../../types/api";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { myAccountAdminSchema } from "../../../validation/accounts/myAccountAdminValidation";
import Button from "../../UI/Buttons/Button";
import CancelButton from "../../UI/Buttons/CancelButton";
import EditButton from "../../UI/Buttons/EditButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import InputTextToggle from "../../UI/Inputs/InputTextToggle";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";

const MyAccountAdmin = () => {
  //HOOKS
  const { user } = useUserContext() as { user: AdminType };
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);
  const [tempFormDatas, setTempFormDatas] = useState(user);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [progress, setProgress] = useState(false);
  const navigate = useNavigate();

  //HANDLERS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setTempFormDatas({ ...tempFormDatas, [name]: value });
  };

  const handleChangeCredentials = () => {
    navigate("/admin/credentials");
  };

  const handleEdit = () => {
    setEditVisible(true);
  };

  const handleSave = async () => {
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
      socket?.emit("message", {
        route: "USER",
        action: "update",
        content: {
          id: user?.id,
          data: response,
        },
      });
      socket?.emit("message", {
        route: "ADMINS INFOS",
        action: "update",
        content: {
          id: user?.id,
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

  const handleCancel = () => {
    setErrMsg("");
    setEditVisible(false);
  };

  return (
    <div className="myaccount-section__container" style={{ width: "25%" }}>
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}{" "}
      {successMsg && <p className="myaccount-section__success">{successMsg}</p>}
      {tempFormDatas && (
        <div className="myaccount-section__form">
          <div style={{ margin: "0 auto" }}>
            <div className="myaccount-section__row">
              <label>Email*: </label>
              <p>{tempFormDatas.email}</p>
            </div>
            <div className="myaccount-section__row">
              <InputTextToggle
                value={tempFormDatas.first_name}
                onChange={handleChange}
                name="first_name"
                id="first_name"
                editVisible={editVisible}
                label="First Name*: "
              />
            </div>
            <div className="myaccount-section__row">
              <InputTextToggle
                value={tempFormDatas.last_name}
                onChange={handleChange}
                name="last_name"
                id="last_name"
                editVisible={editVisible}
                label="Last Name*: "
              />
            </div>
          </div>
        </div>
      )}
      <div className="myaccount-section__btns">
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

export default MyAccountAdmin;
