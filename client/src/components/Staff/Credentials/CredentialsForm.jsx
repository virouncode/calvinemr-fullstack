import { useState } from "react";
import { useNavigate } from "react-router-dom";

import xanoGet from "../../../api/xanoCRUD/xanoGet";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import FormCredentials from "../../UI/Forms/FormCredentials";

const CredentialsForm = () => {
  const navigate = useNavigate();
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [credentials, setCredentials] = useState({
    email: auth.email,
    password: "",
    confirmPassword: "",
    pin: "",
  });
  const [passwordValidity, setPasswordValidity] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    size: false,
  });
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleCancel = () => {
    navigate("/staff/my-account");
  };
  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
    setCredentials({ ...credentials, [name]: value });
  };
  const handlePasswordChange = (e) => {
    setErrMsg("");
    let value = e.target.value;
    let newValidity = {};
    if (/[A-Z]/.test(value)) {
      newValidity.uppercase = true;
    } else {
      newValidity.uppercase = false;
    }
    if (/[a-z]/.test(value)) {
      newValidity.lowercase = true;
    } else {
      newValidity.lowercase = false;
    }
    if (/[0-9]/.test(value)) {
      newValidity.number = true;
    } else {
      newValidity.number = false;
    }
    if (/\W|_/.test(value)) {
      newValidity.special = true;
    } else {
      newValidity.special = false;
    }
    if (value.length >= 8 && value.length <= 16) {
      newValidity.size = true;
    } else {
      newValidity.size = false;
    }
    setPasswordValidity(newValidity);
    setCredentials({ ...credentials, password: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email) {
      setErrMsg("Email is required");
      return;
    }
    if (!credentials.password) {
      setErrMsg("Password is required");
      return;
    }
    if (credentials.confirmPassword !== credentials.password) {
      setErrMsg("Passwords do not match");
      return;
    }
    if (
      /^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[^\w\s]).{8,20}$/.test(
        credentials.password
      ) === false
    ) {
      setErrMsg("Invalid Password");
      return;
    }
    if (/^\d{4}$/.test(credentials.pin) === false) {
      setErrMsg("Invalid PIN (must be 4 digits)");
      return;
    }

    if (credentials.email.toLowerCase() !== auth.email.toLowerCase()) {
      try {
        const response = await xanoGet(`/staff_with_email`, "staff", {
          email: credentials.email.toLowerCase(),
        });
        if (response) {
          setErrMsg("There is already an account with this email");
          return;
        }
      } catch (err) {
        setErrMsg(`Error: unable to change credentials: ${err.message}`);
        return;
      }
    }

    try {
      //get staffInfo
      const me = await xanoGet(`/staff/${user.id}`, "staff");
      me.email = credentials.email.toLowerCase();
      me.password = credentials.password;
      me.pin = credentials.pin;
      const response = await xanoPut(`/staff/password/${user.id}`, "staff", me);
      socket.emit("message", {
        route: "STAFF INFOS",
        action: "update",
        content: { id: user.id, data: response },
      });
      //pas besoin de socket sur USER car il va se relogger
      setSuccessMsg("Credentials changed succesfully");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setErrMsg(`Error: unable to change credentials: ${err.message}`);
      return;
    }
  };

  return successMsg ? (
    <p className="credentials-success">{successMsg}</p>
  ) : (
    <>
      <form
        className="credentials-form"
        onSubmit={handleSubmit}
        style={{ border: errMsg && "solid 1px red" }}
      >
        {errMsg && <div className="credentials-err">{errMsg}</div>}
        <FormCredentials
          credentials={credentials}
          passwordValidity={passwordValidity}
          handleChangeChange={handleChange}
          onPasswordChange={handlePasswordChange}
          handleCancel={handleCancel}
        />
      </form>
    </>
  );
};

export default CredentialsForm;
