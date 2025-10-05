import React, {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
} from "react";
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

  const value = useMemo(
    () => ({ purposesCategories, setPurposesCategories }),
    [purposesCategories]
  );

  return (
    <PurposesCategoriesContext.Provider value={value}>
      {children}
    </PurposesCategoriesContext.Provider>
  );
};

export default PurposesCategoriesContext;
