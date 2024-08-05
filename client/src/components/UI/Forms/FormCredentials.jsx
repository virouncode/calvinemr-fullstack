import CancelButton from "../Buttons/CancelButton";
import SubmitButton from "../Buttons/SubmitButton";
import PasswordValidator from "../Inputs/PasswordValidator";

const FormCredentials = ({
  credentials,
  handleChange,
  handlePasswordChange,
  passwordValidity,
  handleCancel,
}) => {
  return (
    <>
      <div className="credentials-form-row">
        <label htmlFor="email">New email</label>
        <input
          id="email"
          type="email"
          onChange={handleChange}
          name="email"
          value={credentials.email}
          autoComplete="off"
          required
        />
      </div>
      <div className="credentials-form-row">
        <label htmlFor="password">New password</label>
        <input
          id="password"
          type="password"
          onChange={handlePasswordChange}
          name="password"
          value={credentials.password}
          autoFocus
          autoComplete="off"
          required
        />
      </div>
      <div className="credentials-form-row">
        <PasswordValidator passwordValidity={passwordValidity} />
      </div>
      <div className="credentials-form-row">
        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          id="confirm-password"
          type="password"
          onChange={handleChange}
          name="confirmPassword"
          value={credentials.confirmPassword}
          autoComplete="off"
          required
        />
      </div>
      <div className="credentials-form-row">
        <label htmlFor="pin">New PIN</label>
        <input
          id="pin"
          type="password"
          onChange={handleChange}
          name="pin"
          value={credentials.pin}
          autoComplete="off"
          required
        />
      </div>
      <div className="credentials-form-row-submit">
        <SubmitButton />
        <CancelButton onClick={handleCancel} />
      </div>
    </>
  );
};

export default FormCredentials;
