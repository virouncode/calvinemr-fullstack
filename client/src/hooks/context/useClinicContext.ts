import { useContext } from "react";
import ClinicContext from "../../context/ClinicProvider";

const useClinicContext = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error("useClinicContext must be used within an AuthProvider");
  }
  return context;
};

export default useClinicContext;
