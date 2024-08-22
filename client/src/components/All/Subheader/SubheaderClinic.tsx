import React, { useEffect, useState } from "react";
import useClinicContext from "../../../hooks/context/useClinicContext";
import { nowHumanTZ } from "../../../utils/dates/formatDates";

const SubheaderClinic = () => {
  //Hooks
  const { clinic } = useClinicContext();
  const [clock, setClock] = useState("");

  useEffect(() => {
    const displayClock = () => {
      setClock(nowHumanTZ());
    };
    displayClock();
    const intervalClock = setInterval(displayClock, 1000);
    return () => clearInterval(intervalClock);
  }, []);

  return (
    <p className="subheader-section__clinic">
      {clinic?.name}, {clock}
    </p>
  );
};

export default SubheaderClinic;
