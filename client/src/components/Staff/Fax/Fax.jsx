import { useEffect } from "react";
import useSocketContext from "../../../hooks/context/useSocketContext";

const Fax = ({ fax }) => {
  const { socket } = useSocketContext();
  const dataUrl = "data:application/pdf;base64," + fax;
  useEffect(() => {
    socket.emit("message", { key: ["faxes inbox"] });
    socket.emit("message", { key: ["faxes outbox"] });
  }, [socket]);
  return (
    <div>
      <iframe src={dataUrl} width="100%" height="600px" title="test" />
    </div>
  );
};

export default Fax;
