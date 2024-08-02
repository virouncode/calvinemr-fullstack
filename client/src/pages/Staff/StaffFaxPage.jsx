import { Helmet, HelmetProvider } from "react-helmet-async";
import Faxes from "../../components/Staff/Fax/Faxes";

const StaffFaxPage = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Fax</title>
        </Helmet>
      </HelmetProvider>
      <section className="fax-section">
        <Faxes />
      </section>
    </>
  );
};

export default StaffFaxPage;
