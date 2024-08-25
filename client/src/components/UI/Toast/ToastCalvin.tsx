import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastCalvinProps = {
  id: string;
};

const ToastCalvin = ({ id }: ToastCalvinProps) => {
  return (
    <ToastContainer
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
