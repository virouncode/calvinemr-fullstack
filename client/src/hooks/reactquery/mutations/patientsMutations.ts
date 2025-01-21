import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { DemographicsType } from "../../../types/api";
import {
  UserAdminType,
  UserPatientType,
  UserStaffType,
} from "../../../types/app";
import useSocketContext from "../../context/useSocketContext";
import useUserContext from "../../context/useUserContext";

export const usePatientPut = (patientId: number) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  const { user } = useUserContext() as {
    user: UserStaffType | UserPatientType | UserAdminType;
  };
  const userType = user.access_level;

  return useMutation({
    mutationFn: (demographicsToPut: DemographicsType) =>
      xanoPut(
        `/demographics/${demographicsToPut.id}`,
        userType,
        demographicsToPut
      ),
    // onMutate: async (demographicsToPut: DemographicsType) => {
    //   await queryClient.cancelQueries({ queryKey: ["patient", patientId] });
    //   const previousDemographics: DemographicsType[] | undefined =
    //     queryClient.getQueryData(["patient", patientId]);
    //   queryClient.setQueryData(["patient", patientId], demographicsToPut);
    //   return { previousDemographics };
    // },
    onSuccess: (data: DemographicsType) => {
      socket?.emit("message", { key: ["patient", patientId] });
      socket?.emit("message", { key: ["patients"] });
      if (userType === "patient") {
        socket?.emit("message", {
          route: "USER",
          action: "update",
          content: {
            id: user.id,
            data: {
              ...user,
              demographics: data,
            },
          },
        });
      }
      toast.success("Demographics updated succesfully", { containerId: "A" });
    },
    onError: (error, variables, context) => {
      // queryClient.setQueryData(
      //   ["patient", patientId],
      //   context?.previousDemographics
      // );
      toast.error(`Error: unable to update demographics: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const usePatientPost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (demographicsToPost: Partial<DemographicsType>) =>
      xanoPost(`/demographics`, "staff", demographicsToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["patients"] });
    },
  });
};
