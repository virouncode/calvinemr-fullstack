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
  //Hooks
  const { user } = useUserContext() as { user: AdminType };
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);
  const [formDatas, setFormDatas] = useState<AdminType>(user);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [progress, setProgress] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
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
      await myAccountAdminSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    try {
      //Submission
      setProgress(true);
      const datasToPut: AdminType = {
        ...formDatas,
        updates: [...formDatas.updates, { date_updated: nowTZTimestamp() }],
        email: formDatas.email.toLowerCase(),
        first_name: firstLetterUpper(formDatas.first_name),
        last_name: firstLetterUpper(formDatas.last_name),
        full_name:
          firstLetterUpper(formDatas.first_name) +
          " " +
          firstLetterUpper(formDatas.last_name),
      };
      const response: AdminType = await xanoPut(
        `/admin/${user.id}`,
        "admin",
        datasToPut
      );
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
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      if (err instanceof Error)
        setErrMsg(`Error: unable to save infos: ${err.message}`);
    } finally {
      setProgress(false);
    }
  };

  const handleCancel = () => {
    setErrMsg("");
    setFormDatas(user);
    setEditVisible(false);
  };

  return (
    <div className="myaccount-section__container" style={{ width: "30%" }}>
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}{" "}
      {successMsg && <p className="myaccount-section__success">{successMsg}</p>}
      {formDatas && (
        <div className="myaccount-section__form">
          <div style={{ margin: "0 auto" }}>
            <div className="myaccount-section__row--admin">
              <label>Email*: </label>
              <p>{formDatas.email}</p>
            </div>
            <div className="myaccount-section__row--admin">
              <InputTextToggle
                value={formDatas.first_name}
                onChange={handleChange}
                name="first_name"
                id="first_name"
                editVisible={editVisible}
                label="First Name*: "
              />
            </div>
            <div className="myaccount-section__row--admin">
              <InputTextToggle
                value={formDatas.last_name}
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
