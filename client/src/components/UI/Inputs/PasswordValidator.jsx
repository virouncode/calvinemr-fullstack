import CheckIcon from "../Icons/CheckIcon";
import XmarkIcon from "../Icons/XmarkIcon";

const PasswordValidator = ({ passwordValidity }) => {
  return (
    <ul>
      <li>
        {passwordValidity.size ? (
          <CheckIcon clickable={false} color="#0dbc01" />
        ) : (
          <XmarkIcon clickable={false} color="#ff4d4d" />
        )}{" "}
        <span
          style={{
            color: passwordValidity.size ? "#0dbc01" : "#ff4d4d",
          }}
        >
          8-20 characters
        </span>
      </li>
      <li>
        {passwordValidity.uppercase ? (
          <CheckIcon clickable={false} color="#0dbc01" />
        ) : (
          <XmarkIcon clickable={false} color="#ff4d4d" />
        )}{" "}
        <span
          style={{
            color: passwordValidity.uppercase ? "#0dbc01" : "#ff4d4d",
          }}
        >
          At least 1 uppercase letter
        </span>
      </li>
      <li>
        {passwordValidity.lowercase ? (
          <CheckIcon clickable={false} color="#0dbc01" />
        ) : (
          <XmarkIcon clickable={false} color="#ff4d4d" />
        )}{" "}
        <span
          style={{
            color: passwordValidity.lowercase ? "#0dbc01" : "#ff4d4d",
          }}
        >
          At least 1 lowercase letter
        </span>
      </li>
      <li>
        {passwordValidity.number ? (
          <CheckIcon clickable={false} color="#0dbc01" />
        ) : (
          <XmarkIcon clickable={false} color="#ff4d4d" />
        )}{" "}
        <span
          style={{
            color: passwordValidity.number ? "#0dbc01" : "#ff4d4d",
          }}
        >
          At least 1 number
        </span>
      </li>
      <li>
        {passwordValidity.special ? (
          <CheckIcon clickable={false} color="#0dbc01" />
        ) : (
          <XmarkIcon clickable={false} color="#ff4d4d" />
        )}{" "}
        <span
          style={{
            color: passwordValidity.special ? "#0dbc01" : "#ff4d4d",
          }}
        >
          At least 1 special character
        </span>
      </li>
    </ul>
  );
};

export default PasswordValidator;
