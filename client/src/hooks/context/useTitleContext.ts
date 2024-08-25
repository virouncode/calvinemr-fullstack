import { useContext } from "react";
import TitleContext from "../../context/TitleProvider";

const useTitleContext = () => {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error("useTitleContext must be used within an AuthProvider");
  }
  return context;
};

export default useTitleContext;
