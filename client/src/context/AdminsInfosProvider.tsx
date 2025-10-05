import React, {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
} from "react";
import { AdminType } from "../types/api";
import { AdminsInfosContextType } from "../types/app";

const AdminsInfosContext = createContext<AdminsInfosContextType | null>(null);

export const AdminsInfosProvider = ({ children }: PropsWithChildren) => {
  const [adminsInfos, setAdminsInfos] = useState<AdminType[]>(() => {
    const storedAdminsInfos = localStorage.getItem("adminsInfos");
    return storedAdminsInfos ? JSON.parse(storedAdminsInfos) : [];
  });

  const value = useMemo(() => ({ adminsInfos, setAdminsInfos }), [adminsInfos]);

  return (
    <AdminsInfosContext.Provider value={value}>
      {children}
    </AdminsInfosContext.Provider>
  );
};

export default AdminsInfosContext;
