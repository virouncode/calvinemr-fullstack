import React from "react";
import { Id } from "react-toastify";
import SubheaderClinic from "./SubheaderClinic";
import SubheaderTitle from "./SubheaderTitle";
import SubheaderWelcome from "./SubheaderWelcome";
import WeatherLogo from "./WeatherLogo";

type SubheaderProps = {
  title: string;
  toastExpiredID: React.MutableRefObject<Id | null>;
  tokenLimitVerifierID: React.MutableRefObject<number | null>;
};

const Subheader = ({
  title,
  toastExpiredID,
  tokenLimitVerifierID,
}: SubheaderProps) => {
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
