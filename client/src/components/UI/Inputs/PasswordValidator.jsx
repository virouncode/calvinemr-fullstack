const PasswordValidator = ({ passwordValidity }) => {
  return (
    <ul>
      <li>
        {passwordValidity.size ? (
          <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
        ) : (
          <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
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
          <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
        ) : (
          <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
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
          <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
        ) : (
          <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
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
          <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
        ) : (
          <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
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
          <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
        ) : (
          <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
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
