import CircularProgressSmallBlack from "../Progress/CircularProgressSmallBlack";

const LoginButton = ({ label, onClick, disabled, loading }) => {
  return (
    <button
      type="button"
      className="login-btn"
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? <CircularProgressSmallBlack /> : label}
    </button>
  );
};

export default LoginButton;
