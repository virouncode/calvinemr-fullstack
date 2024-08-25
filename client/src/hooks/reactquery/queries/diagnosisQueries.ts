import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { DiagnosisType, XanoPaginatedType } from "../../../types/api";
import useUserContext from "../../context/useUserContext";

export const useDiagnosis = (search: string) => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  return useInfiniteQuery<XanoPaginatedType<DiagnosisType>>({
    queryKey: ["diagnosis", search],
    queryFn: ({ pageParam }) => {
      return xanoGet(`/diagnosis_codes_search`, userType as string, {
        search,
        page: pageParam,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
