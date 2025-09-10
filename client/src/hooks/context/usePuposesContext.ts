import { useContext } from "react";
import PurposesContext from "../../context/PurposesProvider";

const usePurposesContext = () => {
  const context = useContext(PurposesContext);
  if (!context) {
    throw new Error("usePurposesContext must be used within an AuthProvider");
  }
  return context;
};

export default usePurposesContext;
