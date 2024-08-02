import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastCalvin = ({ id }) => {
  return (
    <ToastContainer
      enableMultiContainer
      containerId={id}
      position="bottom-right"
      autoClose={1000}
      hideProgressBar={true}
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

export default ToastCalvin;
