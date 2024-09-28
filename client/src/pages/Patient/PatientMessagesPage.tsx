import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import MessagesPatient from "../../components/Patient/Messages/MessagesPatient";
import useTitle from "../../hooks/useTitle";

const PatientMessagesPage = () => {
  useTitle("Messages");

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Messages</title>
        </Helmet>
      </HelmetProvider>
      <section className="messages">
        <MessagesPatient />
      </section>
    </>
  );
};

export default PatientMessagesPage;
