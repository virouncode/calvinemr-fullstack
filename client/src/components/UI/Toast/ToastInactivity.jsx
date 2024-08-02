import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastInactivity = ({ id }) => {
  return (
    <ToastContainer
      enableMultiContainer
      containerId={id}
      position="top-right"
      hideProgressBar={false}
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

export default ToastInactivity;
