import { useEffect } from "react";
import useTitleContext from "./context/useTitleContext";

const useTitle = (text: string) => {
  const { setTitle } = useTitleContext();
  useEffect(() => {
    setTitle(text);
  }, [setTitle, text]);
};

export default useTitle;
