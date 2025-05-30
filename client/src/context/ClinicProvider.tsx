import React, { createContext, PropsWithChildren, useState } from "react";
import { ClinicType } from "../types/api";
import { ClinicContextType } from "../types/app";

const ClinicContext = createContext<ClinicContextType | null>(null);

export const ClinicProvider = ({ children }: PropsWithChildren) => {
  const [clinic, setClinic] = useState<ClinicType | null>(() => {
    const storedClinic = localStorage.getItem("clinic");
    return storedClinic ? JSON.parse(storedClinic) : {};
  });

  return (
    <ClinicContext.Provider
      value={{
        clinic,
        setClinic,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export default ClinicContext;
