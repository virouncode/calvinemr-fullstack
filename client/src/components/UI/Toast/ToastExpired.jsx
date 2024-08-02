import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastExpired = ({ id }) => {
  return (
    <ToastContainer
      enableMultiContainer
      containerId={id}
      position="top-right"
      autoClose={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      limit={1}
    />
  );
};

export default ToastExpired;
