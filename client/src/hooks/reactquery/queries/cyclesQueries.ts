import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { CycleType, DemographicsType } from "../../../types/api";

export const useAllCyclesOfDoctor = (doctorId: number) => {
  return useQuery<(CycleType & { patient_infos: Partial<DemographicsType> })[]>(
    {
      queryKey: ["allCycles", doctorId],
      queryFn: () => {
        if (doctorId === -1) return xanoGet("/all_cycles", "staff");
        return xanoGet("/all_cycles_of_doctor", "staff", {
          doctor_id: doctorId,
        });
      },
    }
  );
};
