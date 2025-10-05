import React, {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
} from "react";
import { TitleContextType } from "../types/app";

const TitleContext = createContext<TitleContextType | null>(null);

export const TitleProvider = ({ children }: PropsWithChildren) => {
  const [title, setTitle] = useState<string>("");
  const value = useMemo(() => ({ title, setTitle }), [title]);
  return (
    <TitleContext.Provider value={value}>{children}</TitleContext.Provider>
  );
};

export default TitleContext;
