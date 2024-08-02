import { Helmet, HelmetProvider } from "react-helmet-async";
import Calendar from "../../components/Staff/Calendar/Calendar";
import useTitle from "../../hooks/useTitle";

const StaffCalendarPage = () => {
  useTitle("Calendar");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Calendar</title>
        </Helmet>
      </HelmetProvider>
      <section className="calendar-section">
        <Calendar />
      </section>
    </>
  );
};

export default StaffCalendarPage;
