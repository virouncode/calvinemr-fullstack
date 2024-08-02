import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import xanoPostAuth from "../../../api/xanoCRUD/xanoPostAuth";
import useAdminsInfosContext from "../../../hooks/context/useAdminsInfosContext";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { toPatientName } from "../../../utils/names/toPatientName";
import { loginSchema } from "../../../validation/login/loginValidation";
import CircularProgressSmallBlack from "../../UI/Progress/CircularProgressSmallBlack";
import LoginInputs from "./LoginInputs";
import LoginLogo from "./LoginLogo";

const LOGIN_URL = "/auth/login";
const USERINFO_URL = "/auth/me";

const LoginForm = ({ setCreditsVisible }) => {
  const { setAuth } = useAuthContext();
  const { setUser } = useUserContext();
  const { setClinic } = useClinicContext();
  const { setAdminsInfos } = useAdminsInfosContext();
  const { setStaffInfos } = useStaffInfosContext();
  const navigate = useNavigate();
  const location = useLocation();
  //where we wanted to go as a staff member (because radio button is on "Staff") or staff/calendar by default
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

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setErr("");
    setFormDatas({ ...formDatas, [name]: value });
  };

  // const handleChangeType = (e) => {
  //   const value = e.target.value;
  //   const name = e.target.name;
  //   setFormDatas({ ...formDatas, [name]: value });
  //   if (value === "patient")
  //     setFrom(
  //       (location.state?.from?.pathname.includes("patient") &&
  //         location.state?.from?.pathname) ||
  //         "/patient/messages"
  //     );
  //   //where we wanted to go as a patient or patient/messages
  //   else if (value === "admin")
  //     setFrom(
  //       (location.state?.from?.pathname.includes("admin") &&
  //         location.state?.from?.pathname) ||
  //         "/admin/dashboard"
  //     );
  //   //where we wanted to go as an admin or admin/dashboard
  //   else if (value === "staff")
  //     setFrom(
  //       (location.state?.from?.pathname.includes("staff") &&
  //         location.state?.from?.pathname) ||
  //         "/staff/calendar"
  //     ); //where we wanted to go as a staff member or staff/calendar
  // };

  const handleSubmitStaff = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await loginSchema.validate(formDatas);
    } catch (err) {
      setErr(err.message);
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
      const auth = await xanoPostAuth(LOGIN_URL, "staff", {
        email,
        password,
        pin,
      });
      setAuth({ email, tokenLimit: auth.data + 60000 });
      localStorage.setItem(
        "auth",
        JSON.stringify({ email, tokenLimit: auth.data + 60000 })
      );

      //================ USER INFOS ===================//

      const user = await xanoGet(USERINFO_URL, "staff");
      if (user.account_status === "Suspended") {
        navigate("/suspended");
        return;
      }
      if (user.account_status === "Suspended") {
        navigate("/closed");
        return;
      }

      //================ USER SETTINGS ===================//
      const settings = await xanoGet("/settings_of_staff", "staff", {
        staff_id: user.id,
      });

      //================ USER UNREAD MESSAGES =============//

      const unreadMessagesNbr = await xanoGet(
        "/unread_messages_of_staff",
        "staff",
        {
          staff_id: user.id,
        }
      );
      const unreadMessagesExternalNbr = await xanoGet(
        "/unread_messages_external_of_staff",
        "staff",
        {
          staff_id: user.id,
        }
      );
      const unreadTodosNbr = await xanoGet("/unread_todos_of_staff", "staff", {
        staff_id: user.id,
      });
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
      const clinic = await xanoGet("/clinic/1", "staff");
      setClinic(clinic);
      localStorage.setItem("clinic", JSON.stringify(clinic));

      //================== STAFF INFOS ====================//
      const staffInfos = await xanoGet("/staff", "staff");
      setStaffInfos(staffInfos);
      localStorage.setItem("staffInfos", JSON.stringify(staffInfos));

      //=============== ADMIN INFOS =================//
      const adminsInfos = await xanoGet("/admins", "staff");
      setAdminsInfos(adminsInfos);
      localStorage.setItem("adminsInfos", JSON.stringify(adminsInfos));

      setLoadingStaff(false);
      navigate(
        (location.state?.from?.pathname.includes("staff") &&
          location.state?.from?.pathname) ||
          "/staff/calendar",
        { replace: true }
      ); //go where we wanted to go and replace history (the back button will not go to the login page)
    } catch (err) {
      setLoadingStaff(false);
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
  };

  const handleSubmitPatient = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await loginSchema.validate(formDatas);
    } catch (err) {
      setErr(err.message);
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
      await xanoPostAuth(LOGIN_URL, "patient", {
        email,
        password,
        pin,
      });
      setAuth({ email });
      localStorage.setItem("auth", JSON.stringify({ email }));

      //================ USER INFOS ===================//

      const user = await xanoGet(USERINFO_URL, "patient");
      if (user.account_status === "Suspended") {
        navigate("/suspended");
        return;
      }
      if (user.account_status === "Closed") {
        navigate("/closed");
        return;
      }

      //================ USER DEMOGRAPHICS =============//
      const demographics = await xanoGet(
        `/demographics_of_patient`,
        "patient",
        {
          patient_id: user.id,
        }
      );

      //================ USER UNREAD MESSAGES =============//
      const unreadNbr = await xanoGet(
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
      const clinic = await xanoGet("/clinic/1", "patient");
      setClinic(clinic);
      localStorage.setItem("clinic", JSON.stringify(clinic));

      //================== STAFF INFOS ====================//
      const staffInfos = await xanoGet("/staff", "patient");
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
  };

  const handleSubmitAdmin = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await loginSchema.validate(formDatas);
    } catch (err) {
      setErr(err.message);
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
      await xanoPostAuth(LOGIN_URL, "admin", {
        email,
        password,
        pin,
      });
      setAuth({ email });
      localStorage.setItem("auth", JSON.stringify({ email }));

      //=============== USER =================//
      const user = await xanoGet(USERINFO_URL, "admin");
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      //================ CLINIC =============//
      const clinic = await xanoGet("/clinic/1", "admin");
      setClinic(clinic);
      localStorage.setItem("clinic", JSON.stringify(clinic));

      //=============== STAFF INFOS =================//
      const staffInfos = await xanoGet("/staff", "admin");
      setStaffInfos(staffInfos);
      localStorage.setItem("staffInfos", JSON.stringify(staffInfos));

      //=============== ADMIN INFOS =================//
      const adminsInfos = await xanoGet("/admins", "admin");
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
      <LoginLogo setCreditsVisible={setCreditsVisible} />
      <form className="login-form">
        {/* <LoginRadio formDatas={formDatas} handleChangeType={handleChangeType} /> */}
        {err ? (
          <p className={"login__err"}>{err}</p>
        ) : (
          <p className={"login__err"} style={{ visibility: "hidden" }}>
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
          <button
            type="button"
            className="save-btn-login"
            onClick={handleSubmitStaff}
            disabled={loadingStaff || loadingPatient || loadingAdmin}
          >
            {loadingStaff ? <CircularProgressSmallBlack /> : "Staff"}
          </button>
          <button
            type="button"
            className="save-btn-login"
            onClick={handleSubmitPatient}
            disabled={loadingStaff || loadingPatient || loadingAdmin}
          >
            {loadingPatient ? <CircularProgressSmallBlack /> : "Patient"}
          </button>
          <button
            type="button"
            className="save-btn-login"
            onClick={handleSubmitAdmin}
            disabled={loadingStaff || loadingPatient || loadingAdmin}
          >
            {loadingAdmin ? <CircularProgressSmallBlack /> : "Admin"}
          </button>
        </div>
        <p className="login-forgot">
          <span onClick={handleClickForgot}>I forgot my password/pin</span>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
