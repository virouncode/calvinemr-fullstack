import { useEffect } from "react";

const useFormSubmitShortcut = (handleSubmit) => {
  useEffect(() => {
    const handleKeyboardShortcut = async (e) => {
      if (e.keyCode === 13) {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => window.removeEventListener("keydown", handleKeyboardShortcut);
  }, [handleSubmit]);
};

export default useFormSubmitShortcut;
