import React, { createContext, useState } from "react";
import { StaffType } from "../types/api";
import { StaffInfosContextType } from "../types/app";

const StaffInfosContext = createContext<StaffInfosContextType | null>(null);

export const StaffInfosProvider = ({ children }) => {
  const [staffInfos, setStaffInfos] = useState<StaffType[]>(() => {
    const storedStaffInfos = localStorage.getItem("staffInfos");
    return storedStaffInfos ? JSON.parse(storedStaffInfos) : [];
  });

  return (
    <StaffInfosContext.Provider
      value={{
        staffInfos,
        setStaffInfos,
      }}
    >
      {children}
    </StaffInfosContext.Provider>
  );
};

export default StaffInfosContext;
