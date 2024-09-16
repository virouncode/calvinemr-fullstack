import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Faxes from "../../components/Staff/Fax/Faxes";
import useTitle from "../../hooks/useTitle";

const StaffFaxPage = () => {
  useTitle("Fax");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Fax</title>
        </Helmet>
      </HelmetProvider>
      <section className="fax">
        <Faxes />
      </section>
    </>
  );
};

export default StaffFaxPage;
