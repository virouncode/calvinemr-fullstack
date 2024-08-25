import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import CalvinAIChat from "../../components/Staff/CalvinAIChat/CalvinAIChat";
import useTitle from "../../hooks/useTitle";

const StaffCalvinAIPage = () => {
  // const { user } = useUserContext();
  // const [start, setStart] = useState(user.ai_consent);
  useTitle("Calvin AI Chat");

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>CalvinAI Chat</title>
        </Helmet>
      </HelmetProvider>
      <section className="calvinai-section">
        <CalvinAIChat />
      </section>
    </>
  );
};

export default StaffCalvinAIPage;
