import React, {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
} from "react";
import { AuthContextType, AuthType } from "../types/app";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState<AuthType | null>(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : {};
  });

  const value = useMemo(() => ({ auth, setAuth }), [auth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
