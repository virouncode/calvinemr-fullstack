import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastInactivityProps = {
  id: string;
};

const ToastInactivity = ({ id }: ToastInactivityProps) => {
  return (
    <ToastContainer
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
