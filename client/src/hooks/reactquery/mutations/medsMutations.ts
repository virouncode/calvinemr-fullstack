import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { xanoDeleteBatchSuccessfulRequests } from "../../../api/xanoCRUD/xanoDelete";
import { xanoPostBatch } from "../../../api/xanoCRUD/xanoPost";
import { MedType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useMedsPostBatch = (patientId: number) => {
  const { socket } = useSocketContext();
  let successfulRequests: { endpoint: "/medications"; id: number }[] = [];
  return useMutation({
    mutationFn: (medsToPost: Partial<MedType>[]) =>
      xanoPostBatch("/medications", "staff", medsToPost),
    onSuccess: (datas: MedType[]) => {
      socket?.emit("message", { key: ["MEDICATIONS & TREATMENTS", patientId] });
      socket?.emit("message", { key: ["dashboardMedications"] });
      socket?.emit("message", { key: ["patientRecord"] });
      toast.success("Medication(s) post succesfully", {
        containerId: "A",
      });
      successfulRequests = datas.map((item) => ({
        endpoint: "/medications",
        id: item.id,
      }));
    },
    onError: (error) => {
      toast.error(`Error: unable to post medications(s): ${error.message}`, {
        containerId: "A",
      });
      xanoDeleteBatchSuccessfulRequests(successfulRequests, "staff");
    },
  });
};
