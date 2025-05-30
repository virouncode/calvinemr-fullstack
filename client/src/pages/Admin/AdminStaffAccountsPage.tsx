import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import StaffAccounts from "../../components/Admin/StaffAccounts/StaffAccounts";
import useTitle from "../../hooks/useTitle";

const AdminStaffAccountsPage = () => {
  useTitle("Staff accounts");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Manage staff accounts</title>
        </Helmet>
      </HelmetProvider>
      <section className="staff-accounts">
        <StaffAccounts />
      </section>
    </>
  );
};

export default AdminStaffAccountsPage;
