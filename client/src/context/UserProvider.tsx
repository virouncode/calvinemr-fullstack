import React, { createContext, useState } from "react";
import { UserContextType, UserType } from "../types/app";

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<UserType>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
