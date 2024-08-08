import React, { createContext, useState } from "react";
import { AdminType } from "../types/api";
import { AdminsInfosContextType } from "../types/app";

const AdminsInfosContext = createContext<AdminsInfosContextType | null>(null);

export const AdminsInfosProvider = ({ children }) => {
  const [adminsInfos, setAdminsInfos] = useState<AdminType[]>(() => {
    const storedAdminsInfos = localStorage.getItem("adminsInfos");
    return storedAdminsInfos ? JSON.parse(storedAdminsInfos) : [];
  });
  return (
    <AdminsInfosContext.Provider
      value={{
        adminsInfos,
        setAdminsInfos,
      }}
    >
      {children}
    </AdminsInfosContext.Provider>
  );
};

export default AdminsInfosContext;
