import React, { createContext, PropsWithChildren, useState } from "react";
import { PurposeType } from "../types/api";
import { PurposesContextType } from "../types/app";

const PurposesContext = createContext<PurposesContextType | null>(null);

export const PurposesProvider = ({ children }: PropsWithChildren) => {
  const [purposes, setPurposes] = useState<PurposeType[]>(() => {
    const storedPurposes = localStorage.getItem("purposes");
    return storedPurposes ? JSON.parse(storedPurposes) : [];
  });
  return (
    <PurposesContext.Provider
      value={{
        purposes,
        setPurposes,
      }}
    >
      {children}
    </PurposesContext.Provider>
  );
};

export default PurposesContext;
