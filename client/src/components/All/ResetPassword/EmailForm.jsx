import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useClinicContext from "../../../hooks/context/useClinicContext";
import CircularProgressSmall from "../../UI/Progress/CircularProgressSmall";

axios.defaults.withCredentials = true;

const EmailForm = ({
  setRequestSent,
  setErrMsg,
  type,
  setType,
  setEmailInput,
  emailInput,
}) => {
  const { clinic } = useClinicContext();
  const [progress, setProgress] = useState(false);
  const navigate = useNavigate();

  const handleTypeChange = (e) => {
    setErrMsg("");
    setType(e.target.value);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    //verifier l'email
    try {
      setProgress(true);
      const response = await xanoGet(`/${type}_with_email`, "reset", {
        email: emailInput.toLowerCase(),
      });
      if (!response) {
        setErrMsg(`There is no ${type} account associated with this email`);
        setProgress(false);
        return;
      }
      await axios.get(`/api/xano/temp_password`, {
        params: {
          userType: type,
          email: emailInput.toLowerCase(),
          clinicName: clinic.name,
        },
      });
      setRequestSent(true);
    } catch (err) {
      toast.error(`Unable to send the request: ${err.message}`, {
        containerId: "A",
      });
    }
    setProgress(false);
  };

  return (
    <form onSubmit={handleSubmitEmail}>
      <div className="email-form-row-radio">
        <div className="email-form-row-radio-item">
          <input
            type="radio"
            id="staff"
            name="type"
            value="staff"
            checked={type === "staff"}
            onChange={handleTypeChange}
          />
          <label htmlFor="staff">Staff</label>
        </div>
        <div className="email-form-row-radio-item">
          <input
            type="radio"
            id="patient"
            name="type"
            value="patient"
            checked={type === "patient"}
            onChange={handleTypeChange}
          />
          <label htmlFor="patient">Patient</label>
        </div>
        <div className="email-form-row-radio-item">
          <input
            type="radio"
            id="admin"
            name="type"
            value="admin"
            checked={type === "admin"}
            onChange={handleTypeChange}
          />
          <label htmlFor="admin">Admin</label>
        </div>
      </div>
      <div className="email-form-row">
        <label htmlFor="email">Enter your email: </label>
        <input
          type="email"
          onChange={(e) => {
            setEmailInput(e.target.value);
            setErrMsg("");
          }}
          required
          value={emailInput}
          autoFocus
        />
        <div>
          <input type="submit" value="Submit" disabled={progress} />
          <button onClick={handleCancel} style={{ marginLeft: "5px" }}>
            Cancel
          </button>
        </div>

        {progress && <CircularProgressSmall />}
      </div>
    </form>
  );
};

export default EmailForm;
