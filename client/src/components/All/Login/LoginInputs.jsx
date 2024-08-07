import EyeIcon from "../../UI/Icons/EyeIcon";
import Input from "../../UI/Inputs/Input";
import InputEmail from "../../UI/Inputs/InputEmail";
import InputPassword from "../../UI/Inputs/InputPassword";

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
        <InputEmail
          id="email"
          name="email"
          onChange={handleChange}
          value={formDatas.email}
          autoFocus={true}
          label="Email"
        />
      </div>
      <div className="login-form__row" style={{ position: "relative" }}>
        {passwordVisible ? (
          <>
            <Input
              id="password"
              name="password"
              onChange={handleChange}
              value={formDatas.password}
              label="Password"
            />
            <EyeIcon onClick={handleTogglePwd} />
          </>
        ) : (
          <>
            <InputPassword
              id="password"
              name="password"
              onChange={handleChange}
              value={formDatas.password}
              label="Password"
            />
            <EyeIcon onClick={handleTogglePwd} slash={true} />
          </>
        )}
      </div>
      <div className="login-form__row" style={{ position: "relative" }}>
        {pinVisible ? (
          <>
            <Input
              id="pin"
              name="pin"
              onChange={handleChange}
              value={formDatas.pin}
              label="PIN"
            />
            <EyeIcon onClick={handleTogglePin} />
          </>
        ) : (
          <>
            <InputPassword
              id="pin"
              name="pin"
              onChange={handleChange}
              value={formDatas.pin}
              label="PIN"
            />
            <EyeIcon onClick={handleTogglePin} slash={true} />
          </>
        )}
      </div>
    </>
  );
};

export default LoginInputs;
