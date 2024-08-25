import React, { createContext, PropsWithChildren, useState } from "react";
import { TitleContextType } from "../types/app";

const TitleContext = createContext<TitleContextType | null>(null);

export const TitleProvider = ({ children }: PropsWithChildren) => {
  const [title, setTitle] = useState<string>("");
  return (
    <TitleContext.Provider
      value={{
        title,
        setTitle,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
};

export default TitleContext;
