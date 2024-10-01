import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Billing from "../../components/Staff/Billing/Billing";
import useTitle from "../../hooks/useTitle";

const AdminBillingPage = () => {
  useTitle("Billings");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Billing</title>
        </Helmet>
      </HelmetProvider>
      <section className="billing">
        <Billing />
      </section>
    </>
  );
};

export default AdminBillingPage;
