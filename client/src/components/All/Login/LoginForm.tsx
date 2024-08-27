import { AxiosError } from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import xanoPostAuth from "../../../api/xanoCRUD/xanoPostAuth";
import useAdminsInfosContext from "../../../hooks/context/useAdminsInfosContext";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  AdminType,
  ClinicType,
  DemographicsType,
  PatientType,
  SettingsType,
  StaffType,
} from "../../../types/api";
import { toPatientName } from "../../../utils/names/toPatientName";
import { loginSchema } from "../../../validation/login/loginValidation";
import LoginButton from "../../UI/Buttons/LoginButton";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoginInputs from "./LoginInputs";
import LoginTitle from "./LoginTitle";

const LOGIN_URL = "/auth/login";
const USERINFO_URL = "/auth/me";

const LoginForm = () => {
  //Hooks
  const { setAuth } = useAuthContext();
  const { setUser } = useUserContext();
  const { setClinic } = useClinicContext();
  const { setAdminsInfos } = useAdminsInfosContext();
  const { setStaffInfos } = useStaffInfosContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [err, setErr] = useState("");
  const [formDatas, setFormDatas] = useState({
    email: "",
    password: "",
    pin: "",
  });
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [pinVisible, setPinVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setErr("");
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmitStaff = async () => {
    //Validation
    try {
      await loginSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErr(err.message);
      return;
    }
    //Formatting
    const formDatasToPost = {
      ...formDatas,
      email: formDatas.email.toLowerCase(),
    };
    const email = formDatasToPost.email;
    const password = formDatasToPost.password;
    const pin = formDatasToPost.pin;
    //Submission

    //************************************* STAFF *************************************//
    try {
      setLoadingStaff(true);
      //=============== AUTH =================//
      const response = await xanoPostAuth(LOGIN_URL, "staff", {
        email,
        password,
        pin,
      });
      setAuth({ email, tokenLimit: response.data + 60000 });
      localStorage.setItem(
        "auth",
        JSON.stringify({ email, tokenLimit: response.data + 60000 })
      );

      //================ USER INFOS ===================//

      const user: StaffType = await xanoGet(USERINFO_URL, "staff");
      if (user.account_status === "Suspended") {
        navigate("/suspended");
        return;
      }
      if (user.account_status === "Closed") {
        navigate("/closed");
        return;
      }

      //================ USER SETTINGS ===================//
      const settings: SettingsType = await xanoGet(
        "/settings_of_staff",
        "staff",
        {
          staff_id: user.id,
        }
      );

      //================ USER UNREAD MESSAGES =============//

      const unreadMessagesNbr: number = await xanoGet(
        "/unread_messages_of_staff",
        "staff",
        {
          staff_id: user.id,
        }
      );
      const unreadMessagesExternalNbr: number = await xanoGet(
        "/unread_messages_external_of_staff",
        "staff",
        {
          staff_id: user.id,
        }
      );
      const unreadTodosNbr: number = await xanoGet(
        "/unread_todos_of_staff",
        "staff",
        {
          staff_id: user.id,
        }
      );
      const unreadNbr =
        unreadTodosNbr + unreadMessagesExternalNbr + unreadMessagesNbr;

      setUser({
        ...user,
        settings,
        unreadMessagesNbr,
        unreadMessagesExternalNbr,
        unreadTodosNbr,
        unreadNbr,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          settings,
          unreadMessagesNbr,
          unreadMessagesExternalNbr,
          unreadTodosNbr,
          unreadNbr,
        })
      );

      //================ CLINIC =============//
      const clinic: ClinicType = await xanoGet("/clinic/1", "staff");
      setClinic(clinic);
      localStorage.setItem("clinic", JSON.stringify(clinic));

      //================== STAFF INFOS ====================//
      const staffInfos: StaffType[] = await xanoGet("/staff", "staff");
      setStaffInfos(staffInfos);
      localStorage.setItem("staffInfos", JSON.stringify(staffInfos));

      //=============== ADMIN INFOS =================//
      const adminsInfos: AdminType[] = await xanoGet("/admins", "staff");
      setAdminsInfos(adminsInfos);
      localStorage.setItem("adminsInfos", JSON.stringify(adminsInfos));

      //=============== WARN IF SITE CLOSED =================//
      localStorage.setItem("alreadyWarnedSiteClosed", "false");

      setLoadingStaff(false);
      navigate(
        (location.state?.from?.pathname.includes("staff") &&
          location.state?.from?.pathname) ||
          "/staff/calendar",
        { replace: true }
      ); //go where we wanted to go and replace history (the back button will not go to the login page)
    } catch (err) {
      setLoadingStaff(false);
      if (err instanceof AxiosError) {
        if (!err?.response) {
          setErr("No server response");
        } else if (err.response?.status === 400) {
          setErr("Missing email or password");
        } else if (err.response?.status === 401) {
          setErr("Unhauthorized");
        } else {
          setErr("Login failed, please try again");
        }
      }
    }
  };

  const handleSubmitPatient = async () => {
    //Validation
    try {
      await loginSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErr(err.message);
      return;
    }
    //Formatting
    const formDatasToPost = {
      ...formDatas,
      email: formDatas.email.toLowerCase(),
    };
    const email = formDatasToPost.email;
    const password = formDatasToPost.password;
    const pin = formDatasToPost.pin;
    //Submission
    //************************************* PATIENT *************************************//
    try {
      setLoadingPatient(true);
      //=============== AUTH =================//
      const response = await xanoPostAuth(LOGIN_URL, "patient", {
        email,
        password,
        pin,
      });
      setAuth({ email, tokenLimit: response.data + 60000 });
      localStorage.setItem(
        "auth",
        JSON.stringify({ email, tokenLimit: response.data + 60000 })
      );

      //================ USER INFOS ===================//

      const user: PatientType = await xanoGet(USERINFO_URL, "patient");
      if (user.account_status === "Suspended") {
        navigate("/suspended");
        return;
      }
      if (user.account_status === "Closed") {
        navigate("/closed");
        return;
      }

      //================ USER DEMOGRAPHICS =============//
      const demographics: DemographicsType = await xanoGet(
        `/demographics_of_patient`,
        "patient",
        {
          patient_id: user.id,
        }
      );

      //================ USER UNREAD MESSAGES =============//
      const unreadNbr: number = await xanoGet(
        `/unread_messages_of_patient`,
        "patient",
        {
          patient_id: user.id,
        }
      );
      setUser({
        ...user,
        full_name: toPatientName(demographics),
        demographics,
        unreadNbr,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          full_name: toPatientName(demographics),
          demographics,
          unreadNbr,
        })
      );
      //================ CLINIC =============//
      const clinic: ClinicType = await xanoGet("/clinic/1", "patient");
      setClinic(clinic);
      localStorage.setItem("clinic", JSON.stringify(clinic));

      //================== STAFF INFOS ====================//
      const staffInfos: StaffType[] = await xanoGet("/staff", "patient");
      setStaffInfos(staffInfos);
      localStorage.setItem("staffInfos", JSON.stringify(staffInfos));
      setLoadingPatient(false);
      navigate(
        (location.state?.from?.pathname.includes("patient") &&
          location.state?.from?.pathname) ||
          "/patient/messages",
        { replace: true }
      ); //on renvoit vers là où on voulait aller
    } catch (err) {
      setLoadingPatient(false);
      if (err instanceof AxiosError) {
        if (!err?.response) {
          setErr("No server response");
        } else if (err.response?.status === 400) {
          setErr("Missing email or password");
        } else if (err.response?.status === 401) {
          setErr("Unhauthorized");
        } else {
          setErr("Login failed, please try again");
        }
      }
    }
  };

  const handleSubmitAdmin = async () => {
    //Validation
    try {
      await loginSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErr(err.message);
      return;
    }
    //Formatting
    const formDatasToPost = {
      ...formDatas,
      email: formDatas.email.toLowerCase(),
    };
    const email = formDatasToPost.email;
    const password = formDatasToPost.password;
    const pin = formDatasToPost.pin;
    //Submission
    //************************************* ADMIN *************************************//
    try {
      setLoadingAdmin(true);
      //=============== AUTH =================//
      const response = await xanoPostAuth(LOGIN_URL, "admin", {
        email,
        password,
        pin,
      });
      setAuth({ email, tokenLimit: response.data + 60000 });
      localStorage.setItem(
        "auth",
        JSON.stringify({ email, tokenLimit: response.data + 60000 })
      );

      //=============== USER =================//
      const user: AdminType = await xanoGet(USERINFO_URL, "admin");
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      //================ CLINIC =============//
      const clinic: ClinicType = await xanoGet("/clinic/1", "admin");
      setClinic(clinic);
      localStorage.setItem("clinic", JSON.stringify(clinic));

      //=============== STAFF INFOS =================//
      const staffInfos: StaffType[] = await xanoGet("/staff", "admin");
      setStaffInfos(staffInfos);
      localStorage.setItem("staffInfos", JSON.stringify(staffInfos));

      //=============== ADMIN INFOS =================//
      const adminsInfos: AdminType[] = await xanoGet("/admins", "admin");
      setAdminsInfos(adminsInfos);
      localStorage.setItem("adminsInfos", JSON.stringify(adminsInfos));
      setLoadingAdmin(false);
      navigate(
        (location.state?.from?.pathname.includes("admin") &&
          location.state?.from?.pathname) ||
          "/admin/dashboard",
        { replace: true }
      ); //on renvoit vers là où on voulait aller
    } catch (err) {
      setLoadingAdmin(false);
      if (err instanceof AxiosError) {
        if (!err?.response) {
          setErr("No server response");
        } else if (err.response?.status === 400) {
          setErr("Missing email or password");
        } else if (err.response?.status === 401) {
          setErr("Unhauthorized");
        } else {
          setErr("Login failed, please try again");
        }
      }
    }
  };

  const handleTogglePwd = () => {
    setPasswordVisible((v) => !v);
  };

  const handleTogglePin = () => {
    setPinVisible((v) => !v);
  };

  const handleClickForgot = () => {
    navigate("/reset-password");
  };
  return (
    <div className="login-newcard">
      <LoginTitle />
      <form className="login-form">
        {err ? (
          <ErrorParagraph errorMsg={err} />
        ) : (
          <p className="login__err" style={{ visibility: "hidden" }}>
            Placeholder
          </p>
        )}
        <LoginInputs
          formDatas={formDatas}
          handleChange={handleChange}
          passwordVisible={passwordVisible}
          pinVisible={pinVisible}
          handleTogglePwd={handleTogglePwd}
          handleTogglePin={handleTogglePin}
        />
        <div className="login-form__btn-label">Sign In as</div>
        <div className="login-form__btn-container">
          <LoginButton
            onClick={handleSubmitStaff}
            disabled={loadingStaff || loadingPatient || loadingAdmin}
            label="Staff"
            loading={loadingStaff}
          />
          <LoginButton
            onClick={handleSubmitPatient}
            disabled={loadingStaff || loadingPatient || loadingAdmin}
            label="Patient"
            loading={loadingPatient}
          />
          <LoginButton
            onClick={handleSubmitAdmin}
            disabled={loadingStaff || loadingPatient || loadingAdmin}
            label="Admin"
            loading={loadingAdmin}
          />
        </div>
        <p className="login-forgot">
          <span onClick={handleClickForgot}>I forgot my password/pin</span>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
