import React, {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
} from "react";
import { ClinicType } from "../types/api";
import { ClinicContextType } from "../types/app";

const ClinicContext = createContext<ClinicContextType | null>(null);

export const ClinicProvider = ({ children }: PropsWithChildren) => {
  const [clinic, setClinic] = useState<ClinicType | null>(() => {
    const storedClinic = localStorage.getItem("clinic");
    return storedClinic ? JSON.parse(storedClinic) : {};
  });

  const value = useMemo(() => ({ clinic, setClinic }), [clinic]);

  return (
    <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>
  );
};

export default ClinicContext;
