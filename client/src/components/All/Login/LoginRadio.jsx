const LoginRadio = ({ formDatas, handleChangeType }) => {
  return (
    <div className="login-form__row-radio">
      <div className="login-form__row-radio-item">
        <input
          type="radio"
          id="staff"
          name="type"
          value="staff"
          checked={formDatas.type === "staff"}
          onChange={handleChangeType}
        />
        <label htmlFor="staff">Staff</label>
      </div>
      <div className="login-form__row-radio-item">
        <input
          type="radio"
          id="patient"
          name="type"
          value="patient"
          checked={formDatas.type === "patient"}
          onChange={handleChangeType}
        />
        <label htmlFor="patient">Patient</label>
      </div>
      <div className="login-form__row-radio-item">
        <input
          type="radio"
          id="admin"
          name="type"
          value="admin"
          checked={formDatas.type === "admin"}
          onChange={handleChangeType}
        />
        <label htmlFor="admin">Admin</label>
      </div>
    </div>
  );
};

export default LoginRadio;
