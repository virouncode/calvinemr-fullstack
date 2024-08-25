import { useContext } from "react";
import SocketContext from "../../context/SocketProvider";

const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within an AuthProvider");
  }
  return context;
};

export default useSocketContext;
