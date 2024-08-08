import { useContext } from "react";
import StaffInfosContext from "../../context/StaffInfosProvider";

const useStaffInfosContext = () => {
  const context = useContext(StaffInfosContext);
  if (!context) {
    throw new Error("useStaffInfosContext must be used within an AuthProvider");
  }
  return context;
};

export default useStaffInfosContext;
