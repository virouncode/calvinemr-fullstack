import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import useUserContext from "../../hooks/context/useUserContext";
import useTitle from "../../hooks/useTitle";
import { UserStaffType } from "../../types/app";
import AllCycles from "../../components/Staff/AllCycles/AllCycles";

const StaffAllCyclesPage = () => {
  const { user } = useUserContext() as { user: UserStaffType };
  useTitle("All cycles");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>All Cycles</title>
        </Helmet>
      </HelmetProvider>
      <section className="allCycles">
        <AllCycles />
      </section>
    </>
  );
};

export default StaffAllCyclesPage;
