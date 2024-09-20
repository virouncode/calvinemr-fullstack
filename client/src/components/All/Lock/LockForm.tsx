import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Id, toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useAdminsInfosContext from "../../../hooks/context/useAdminsInfosContext";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { AdminType, SettingsType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import Button from "../../UI/Buttons/Button";
import SaveButton from "../../UI/Buttons/SaveButton";
import InputPassword from "../../UI/Inputs/InputPassword";
import AutoLockTimeSelect from "../../UI/Lists/AutoLockTimeSelect";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
axios.defaults.withCredentials = true;

type LockFormProps = {
  setLockedScreen: React.Dispatch<React.SetStateAction<boolean>>;
  toastExpiredID: React.MutableRefObject<Id | null>;
  tokenLimitVerifierID: React.MutableRefObject<number | null>;
};

const LockForm = ({
  setLockedScreen,
  toastExpiredID,
  tokenLimitVerifierID,
}: LockFormProps) => {
  //Hooks
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();
  const { socket } = useSocketContext();
  const { setAuth } = useAuthContext();
  const { setStaffInfos } = useStaffInfosContext();
  const { setAdminsInfos } = useAdminsInfosContext();
  const { setClinic } = useClinicContext();
  const [errMsg, setErrMsg] = useState("");
  const [autolockTime, setAutoLockTime] = useState(
    user?.access_level === "admin"
      ? (user as AdminType)?.autolock_time_min
      : (user as UserStaffType)?.settings?.autolock_time_min
  );
  const [pin, setPin] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    setPin(e.target.value);
  };
  const handleAutoLockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAutoLockTime(parseInt(e.target.value));
  };
  const handleSubmit = useCallback(async () => {
    try {
      const response = await axios.post(`/api/xano/unlock`, {
        pin: parseInt(pin),
        user_id: user?.id,
        userType: user?.access_level,
      });
      if (response.data) {
        setLockedScreen(false);
        localStorage.setItem("locked", "false");
        localStorage.setItem("message", "unlock"); //send a message to all tabs to unlock
        localStorage.removeItem("message");

        if (
          user?.access_level === "admin" &&
          autolockTime !== (user as AdminType)?.autolock_time_min
        ) {
          const userToPut: AdminType = {
            ...(user as AdminType),
            autolock_time_min: autolockTime,
          };
          const response = await xanoPut(
            `/admin/${user.id}`,
            "admin",
            userToPut
          );
          socket?.emit("message", {
            route: "USER",
            action: "update",
            content: {
              id: user.id,
              data: response,
            },
          });
          socket?.emit("message", {
            route: "ADMINS INFOS",
            action: "update",
            content: {
              id: user.id,
              data: response,
            },
          });
          toast.success("Saved auto lock time preference", {
            containerId: "A",
          });
        } else if (
          user?.access_level === "staff" &&
          autolockTime !== (user as UserStaffType)?.settings?.autolock_time_min
        ) {
          const settingsToPut: SettingsType = {
            ...(user as UserStaffType)?.settings,
            autolock_time_min: autolockTime,
          };
          const response: SettingsType = await xanoPut(
            `/settings/${(user as UserStaffType)?.settings.id}`,
            "staff",
            settingsToPut
          );
          socket?.emit("message", {
            route: "USER",
            action: "update",
            content: {
              id: user?.id,
              data: {
                ...user,
                settings: response,
              },
            },
          });
          toast.success("Saved auto lock time preference", {
            containerId: "A",
          });
        }
      } else {
        throw new Error("Invalid PIN");
      }
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
    }
  }, [autolockTime, pin, setLockedScreen, socket, user]);

  const handleLogout = () => {
    setAuth(null);
    setUser(null);
    setStaffInfos([]);
    setAdminsInfos([]);
    setClinic(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("staffInfos");
    localStorage.removeItem("adminsInfos");
    localStorage.removeItem("clinic");
    localStorage.removeItem("lastAction");
    localStorage.removeItem("locked");
    localStorage.removeItem("currentNewClinicalNote");
    localStorage.removeItem("currentEditClinicalNote");
    localStorage.setItem("message", "logout");
    tokenLimitVerifierID.current && clearInterval(tokenLimitVerifierID.current);
    toastExpiredID.current && toast.dismiss(toastExpiredID.current);
    navigate("/");
  };

  useEffect(() => {
    const handleEnterShortcut = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleEnterShortcut);
    return () => {
      window.removeEventListener("keydown", handleEnterShortcut);
    };
  }, [handleSubmit]);

  return (
    <div className="lock__form">
      <div className="lock__form-message">
        This session was locked by <strong>{user?.full_name}</strong>
      </div>
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <div className="lock__form-input">
        <InputPassword
          value={pin}
          onChange={handleChange}
          name="password"
          id="password"
          placeholder="PIN 4-digits"
          autoFocus={true}
          label="Please enter PIN to unlock"
        />
      </div>
      <div className="lock__form-time">
        <AutoLockTimeSelect
          autolockTime={autolockTime}
          onChange={handleAutoLockChange}
          label="Change auto lock time"
        />
      </div>
      <div className="lock__form-btns">
        <SaveButton label="Unlock" onClick={handleSubmit} />
        <Button label="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default LockForm;
