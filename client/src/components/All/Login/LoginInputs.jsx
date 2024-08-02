const LoginInputs = ({
  formDatas,
  handleChange,
  passwordVisible,
  pinVisible,
  handleTogglePwd,
  handleTogglePin,
}) => {
  return (
    <>
      <div className="login-form__row">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          autoComplete="off"
          onChange={handleChange}
          value={formDatas.email}
          autoFocus
        />
      </div>
      <div className="login-form__row" style={{ position: "relative" }}>
        <label htmlFor="password">Password</label>
        {passwordVisible ? (
          <>
            <input
              type="text"
              id="password"
              name="password"
              onChange={handleChange}
              value={formDatas.password}
              autoComplete="off"
            />
            <i
              className="fa-regular fa-eye"
              style={{
                position: "absolute",
                right: "5px",
                fontSize: "0.7rem",
                cursor: "pointer",
              }}
              onClick={handleTogglePwd}
            />
          </>
        ) : (
          <>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={formDatas.password}
              autoComplete="off"
            />
            <i
              className="fa-regular fa-eye-slash"
              style={{
                position: "absolute",
                right: "5px",
                fontSize: "0.7rem",
                cursor: "pointer",
              }}
              onClick={handleTogglePwd}
            />
          </>
        )}
      </div>
      <div className="login-form__row" style={{ position: "relative" }}>
        <label htmlFor="pin">PIN</label>
        {pinVisible ? (
          <>
            <input
              type="text"
              id="pin"
              name="pin"
              onChange={handleChange}
              value={formDatas.pin}
              autoComplete="off"
            />
            <i
              className="fa-regular fa-eye"
              style={{
                position: "absolute",
                right: "5px",
                fontSize: "0.7rem",
                cursor: "pointer",
              }}
              onClick={handleTogglePin}
            />
          </>
        ) : (
          <>
            <input
              type="password"
              id="pin"
              name="pin"
              onChange={handleChange}
              value={formDatas.pin}
              autoComplete="off"
            />
            <i
              className="fa-regular fa-eye-slash"
              style={{
                position: "absolute",
                right: "5px",
                fontSize: "0.7rem",
                cursor: "pointer",
              }}
              onClick={handleTogglePin}
            />
          </>
        )}
      </div>
    </>
  );
};

export default LoginInputs;
