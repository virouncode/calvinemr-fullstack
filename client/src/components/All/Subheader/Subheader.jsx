import SubheaderClinic from "./SubheaderClinic";
import SubheaderTitle from "./SubheaderTitle";
import SubheaderWelcome from "./SubheaderWelcome";
import WeatherLogo from "./WeatherLogo";

const Subheader = ({ title, toastExpiredID, tokenLimitVerifierID }) => {
  //=================== STATES =======================//
  return (
    <section className="subheader-section">
      <div className="subheader-section__left">
        <SubheaderClinic />
        <WeatherLogo />
      </div>
      <div className="subheader-section__center">
        <SubheaderTitle title={title} />
      </div>
      <SubheaderWelcome
        toastExpiredID={toastExpiredID}
        tokenLimitVerifierID={tokenLimitVerifierID}
      />
    </section>
  );
};

export default Subheader;
