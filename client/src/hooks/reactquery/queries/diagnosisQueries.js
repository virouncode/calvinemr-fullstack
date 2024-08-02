import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../context/useUserContext";

export const useDiagnosis = (search) => {
  const { user } = useUserContext();
  const userType = user.access_level;
  return useInfiniteQuery({
    queryKey: ["diagnosis", search],
    queryFn: ({ pageParam }) => {
      return xanoGet(`/diagnosis_codes_search`, userType, {
        search,
        page: pageParam,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
