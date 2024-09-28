import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import LoginForm from "../../components/All/Login/LoginForm";
import LoginTitle from "../../components/All/Login/LoginTitle";

const LoginPage = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Calvin EMR Login</title>
        </Helmet>
      </HelmetProvider>
      <section className="login">
        <LoginTitle />
        <LoginForm />
      </section>
    </>
  );
};

export default LoginPage;
