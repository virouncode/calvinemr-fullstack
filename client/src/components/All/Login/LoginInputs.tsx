import React from "react";
import EyeIcon from "../../UI/Icons/EyeIcon";
import Input from "../../UI/Inputs/Input";
import InputEmail from "../../UI/Inputs/InputEmail";
import InputPassword from "../../UI/Inputs/InputPassword";
type LoginInputsProps = {
  formDatas: {
    email: string;
    password: string;
    pin: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordVisible: boolean;
  pinVisible: boolean;
  handleTogglePwd: () => void;
  handleTogglePin: () => void;
};

const LoginInputs = ({
  formDatas,
  handleChange,
  passwordVisible,
  pinVisible,
  handleTogglePwd,
  handleTogglePin,
}: LoginInputsProps) => {
  return (
    <>
      <div className="login__form-row">
        <InputEmail
          id="email"
          name="email"
          onChange={handleChange}
          value={formDatas.email}
          autoFocus={true}
          label="Email"
        />
      </div>
      <div className="login__form-row" style={{ position: "relative" }}>
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
      <div className="login__form-row" style={{ position: "relative" }}>
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
