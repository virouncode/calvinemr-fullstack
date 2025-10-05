import React, {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
} from "react";
import { StaffType } from "../types/api";
import { StaffInfosContextType } from "../types/app";

const StaffInfosContext = createContext<StaffInfosContextType | null>(null);

export const StaffInfosProvider = ({ children }: PropsWithChildren) => {
  const [staffInfos, setStaffInfos] = useState<StaffType[]>(() => {
    const storedStaffInfos = localStorage.getItem("staffInfos");
    return storedStaffInfos ? JSON.parse(storedStaffInfos) : [];
  });

  const value = useMemo(() => ({ staffInfos, setStaffInfos }), [staffInfos]);

  return (
    <StaffInfosContext.Provider value={value}>
      {children}
    </StaffInfosContext.Provider>
  );
};

export default StaffInfosContext;
