import { useContext } from "react";
import PurposesCategoriesContext from "../../context/PurposesCatgoriesProvider";

const usePurposesCategoriesContext = () => {
  const context = useContext(PurposesCategoriesContext);
  if (!context) {
    throw new Error(
      "usePurposesCategoriesContext must be used within an AuthProvider"
    );
  }
  return context;
};

export default usePurposesCategoriesContext;
