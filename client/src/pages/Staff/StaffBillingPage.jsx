import { Helmet, HelmetProvider } from "react-helmet-async";
import Billing from "../../components/Staff/Billing/Billing";
import useUserContext from "../../hooks/context/useUserContext";
import useTitle from "../../hooks/useTitle";

const StaffBillingPage = () => {
  const { user } = useUserContext();
  useTitle(user.title === "Secretary" ? "Billings" : "My billings");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Billing</title>
        </Helmet>
      </HelmetProvider>
      <section className="billing-section">
        <Billing />
      </section>
    </>
  );
};

export default StaffBillingPage;
