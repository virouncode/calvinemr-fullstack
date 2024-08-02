import { Helmet, HelmetProvider } from "react-helmet-async";
import Login from "../../components/All/Login/Login";

const LoginPage = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Calvin EMR Login</title>
        </Helmet>
      </HelmetProvider>
      <section className="login-section">
        {/* <LoginCard /> */}
        <Login />
      </section>
    </>
  );
};

export default LoginPage;
