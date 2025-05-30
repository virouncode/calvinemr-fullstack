import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import xanoGet from "../../../api/xanoCRUD/xanoGet";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { AdminType } from "../../../types/api";
import { CredentialsFormType, PasswordValidityType } from "../../../types/app";
import FormCredentials from "../../UI/Forms/FormCredentials";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";

const CredentialsFormAdmin = () => {
  //Hooks
  const navigate = useNavigate();
  const { auth } = useAuthContext();
  const { user } = useUserContext() as { user: AdminType };
  const { socket } = useSocketContext();
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [credentials, setCredentials] = useState<CredentialsFormType>({
    email: auth?.email ?? "",
    password: "",
    confirmPassword: "",
    pin: "",
  });
  const [passwordValidity, setPasswordValidity] =
    useState<PasswordValidityType>({
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
      size: false,
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleCancel = () => {
    navigate("/admin/my-account");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    const value = e.target.value;
    const newValidity: PasswordValidityType = {
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
      size: false,
    };
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    if (credentials.email.toLowerCase() !== auth?.email.toLowerCase()) {
      try {
        const response = await xanoGet(`/admin_with_email`, "admin", {
          email: credentials.email.toLowerCase(),
        });
        if (response) {
          setErrMsg("There is already an account with this email");
          return;
        }
      } catch (err) {
        if (err instanceof Error)
          setErrMsg(`Error: unable to change credentials: ${err.message}`);
        return;
      }
    }

    try {
      //get my infos
      const me: AdminType = await xanoGet(`/admin/${user.id}`, "admin");
      me.email = credentials.email.toLowerCase();
      me.password = credentials.password;
      me.pin = credentials.pin;
      const response = await xanoPut(`/admin/password/${user.id}`, "admin", me);
      socket?.emit("message", {
        route: "ADMINS INFOS",
        action: "update",
        content: { id: user.id, data: response },
      });
      //pas besoin de socket sur USER car il va se relogger
      setSuccessMsg("Credentials changed succesfully");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      if (err instanceof Error)
        setErrMsg(`Error: unable to change credentials: ${err.message}`);
      return;
    }
  };

  return successMsg ? (
    <p className="credentials__success">{successMsg}</p>
  ) : (
    <>
      <form
        className="credentials__form"
        onSubmit={handleSubmit}
        style={{ border: errMsg && "solid 1px red" }}
      >
        {errMsg && <ErrorParagraph errorMsg={errMsg} />}
        <FormCredentials
          credentials={credentials}
          passwordValidity={passwordValidity}
          handleChange={handleChange}
          handlePasswordChange={handlePasswordChange}
          handleCancel={handleCancel}
        />
      </form>
    </>
  );
};

export default CredentialsFormAdmin;
