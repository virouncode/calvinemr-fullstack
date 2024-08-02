import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useEformsBlank = () => {
  return useQuery({
    queryKey: ["eformsBlank"],
    queryFn: () => {
      return xanoGet("/eforms_blank", "staff");
    },
  });
};
