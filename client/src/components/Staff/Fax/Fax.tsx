import React, { useEffect } from "react";
import useSocketContext from "../../../hooks/context/useSocketContext";

type FaxProps = {
  faxBase64: string;
};

const Fax = ({ faxBase64 }: FaxProps) => {
  //Hooks
  const { socket } = useSocketContext();
  const byteCharacters = atob(faxBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });

  // Create a blob URL
  const faxUrl = URL.createObjectURL(blob);

  useEffect(() => {
    socket?.emit("message", { key: ["faxes inbox"] });
    socket?.emit("message", { key: ["faxes outbox"] });
  }, [socket]);
  return <embed src={faxUrl} title="fax" />;
};

export default Fax;
