import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Billing from "../../components/Staff/Billing/Billing";
import useUserContext from "../../hooks/context/useUserContext";
import useTitle from "../../hooks/useTitle";
import { UserStaffType } from "../../types/app";

const StaffBillingPage = () => {
  const { user } = useUserContext() as { user: UserStaffType };
  useTitle(user.title === "Secretary" ? "Billings" : "My billings");
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

export default StaffBillingPage;
