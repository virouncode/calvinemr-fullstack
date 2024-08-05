import CancelButton from "../Buttons/CancelButton";
import SubmitButton from "../Buttons/SubmitButton";
import InputPassword from "../Inputs/InputPassword";

const FormVerifyPassword = ({
  password,
  pin,
  handlePwdChange,
  handlePinChange,
  handleCancel,
}) => {
  return (
    <>
      <div className="verify-pwd-form-row">
        <InputPassword
          value={password}
          onChange={handlePwdChange}
          name="password"
          id="password"
          label="Password"
        />
      </div>
      <div className="verify-pwd-form-row">
        <InputPassword
          value={pin}
          onChange={handlePinChange}
          name="pin"
          id="pin"
          label="PIN"
        />
      </div>
      <div className="verify-pwd-form-row verify-pwd-form-row--submit">
        <SubmitButton />
        <CancelButton onClick={handleCancel} />
      </div>
    </>
  );
};

export default FormVerifyPassword;
