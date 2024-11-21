import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useRouteError } from "react-router-dom";
import Error from "../../components/All/Error/Error";

const ErrorPage = () => {
  const error = useRouteError() as { statusText: string; message: string };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Error</title>
        </Helmet>
      </HelmetProvider>
      <section className="error">
        <Error />
      </section>
    </>
  );
};

export default ErrorPage;
