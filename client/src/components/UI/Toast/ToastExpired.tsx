import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastExpiredProps = {
  id: string;
};

const ToastExpired = ({ id }: ToastExpiredProps) => {
  return (
    <ToastContainer
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
