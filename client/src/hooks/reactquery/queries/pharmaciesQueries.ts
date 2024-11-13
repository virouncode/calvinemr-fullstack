import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { PharmacyType, XanoPaginatedType } from "../../../types/api";
import useUserContext from "../../context/useUserContext";

export const usePharmaciesSearch = (search: string) => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  return useInfiniteQuery<XanoPaginatedType<PharmacyType>>({
    queryKey: ["pharmacies", search],
    queryFn: ({ pageParam }) => {
      return xanoGet("/pharmacies_simple_search", userType as string, {
        page: pageParam,
        search,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
