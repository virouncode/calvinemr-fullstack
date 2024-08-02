const LoginLogo = ({ setCreditsVisible }) => {
  return (
    <div className="login-logo" onClick={() => setCreditsVisible((p) => !p)}>
      <div className="login-logo__title">{`Welcome to ${
        import.meta.env.VITE_CLINIC_NAME
      }`}</div>
    </div>
  );
};

export default LoginLogo;
