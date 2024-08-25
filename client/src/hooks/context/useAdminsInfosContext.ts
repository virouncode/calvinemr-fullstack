import { useContext } from "react";
import AdminsInfosContext from "../../context/AdminsInfosProvider";

const useAdminsInfosContext = () => {
  const context = useContext(AdminsInfosContext);
  if (!context) {
    throw new Error(
      "useAdminsInfosContext must be used within an AuthProvider"
    );
  }
  return context;
};

export default useAdminsInfosContext;
