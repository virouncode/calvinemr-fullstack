import React, {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
} from "react";
import { PurposeType } from "../types/api";
import { PurposesContextType } from "../types/app";

const PurposesContext = createContext<PurposesContextType | null>(null);

export const PurposesProvider = ({ children }: PropsWithChildren) => {
  const [purposes, setPurposes] = useState<PurposeType[]>(() => {
    const storedPurposes = localStorage.getItem("purposes");
    return storedPurposes ? JSON.parse(storedPurposes) : [];
  });

  const value = useMemo(() => ({ purposes, setPurposes }), [purposes]);

  return (
    <PurposesContext.Provider value={value}>
      {children}
    </PurposesContext.Provider>
  );
};

export default PurposesContext;
