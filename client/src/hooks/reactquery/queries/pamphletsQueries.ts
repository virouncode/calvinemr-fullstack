import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { PamphletType, XanoPaginatedType } from "../../../types/api";
import { UserPatientType, UserStaffType } from "../../../types/app";
import useUserContext from "../../context/useUserContext";

export const usePamphlets = (search: string) => {
  const { user } = useUserContext() as {
    user: UserStaffType | UserPatientType;
  };
  const userType = user.access_level;
  return useInfiniteQuery<XanoPaginatedType<PamphletType>>({
    queryKey: ["pamphlets", search],
    queryFn: ({ pageParam }) =>
      xanoGet("/pamphlets", userType, {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
