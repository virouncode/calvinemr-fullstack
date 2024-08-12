import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { EformBlankType } from "../../../types/api";

export const useEformsBlank = () => {
  return useQuery({
    queryKey: ["eformsBlank"],
    queryFn: (): Promise<EformBlankType[]> => {
      return xanoGet("/eforms_blank", "staff");
    },
  });
};
