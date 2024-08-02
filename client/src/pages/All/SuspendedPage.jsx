import { Helmet, HelmetProvider } from "react-helmet-async";
import Suspended from "../../components/All/Suspended/Suspended";

const SuspendedPage = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Suspended account</title>
        </Helmet>
      </HelmetProvider>
      <section className="suspended-section">
        <Suspended />
      </section>
    </>
  );
};

export default SuspendedPage;
