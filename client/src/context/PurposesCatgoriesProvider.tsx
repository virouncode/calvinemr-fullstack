import React, { createContext, PropsWithChildren, useState } from "react";
import { PurposeCategoryType } from "../types/api";
import { PurposesCategoriesContextType } from "../types/app";

const PurposesCategoriesContext =
  createContext<PurposesCategoriesContextType | null>(null);

export const PurposesCategoriesProvider = ({ children }: PropsWithChildren) => {
  const [purposesCategories, setPurposesCategories] = useState<
    PurposeCategoryType[]
  >(() => {
    const storedPurposesCategories = localStorage.getItem("purposesCategories");
    return storedPurposesCategories ? JSON.parse(storedPurposesCategories) : [];
  });
  return (
    <PurposesCategoriesContext.Provider
      value={{
        purposesCategories,
        setPurposesCategories,
      }}
    >
      {children}
    </PurposesCategoriesContext.Provider>
  );
};

export default PurposesCategoriesContext;
