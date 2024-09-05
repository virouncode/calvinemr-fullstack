import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ReportsInbox from "../../components/Staff/ReportsInbox/ReportsInbox";
import ReportsInboxSecretary from "../../components/Staff/ReportsInbox/ReportsInboxSecretary";
import useUserContext from "../../hooks/context/useUserContext";
import useTitle from "../../hooks/useTitle";
import { UserStaffType } from "../../types/app";

const StaffReportsInboxPage = () => {
  const { user } = useUserContext() as { user: UserStaffType };
  useTitle("Inbox");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Inbox</title>
        </Helmet>
      </HelmetProvider>
      <section className="reportsinbox">
        {user.title === "Secretary" ? (
          <ReportsInboxSecretary />
        ) : (
          <ReportsInbox />
        )}
      </section>
    </>
  );
};

export default StaffReportsInboxPage;
