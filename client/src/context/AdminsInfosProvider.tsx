import React, { createContext, PropsWithChildren, useState } from "react";
import { AdminType } from "../types/api";
import { AdminsInfosContextType } from "../types/app";

const AdminsInfosContext = createContext<AdminsInfosContextType | null>(null);

export const AdminsInfosProvider = ({ children }: PropsWithChildren) => {
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
