import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../context/useUserContext";

export const useDoctors = () => {
  const { user } = useUserContext();
  const userType = user.access_level;
  return useInfiniteQuery({
    queryKey: ["doctors"],
    queryFn: ({ pageParam }) => {
      return xanoGet("/doctors", userType, { page: pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const useDoctorsSearch = (search) => {
  const { user } = useUserContext();
  const userType = user.access_level;
  return useInfiniteQuery({
    queryKey: ["doctors", search],
    queryFn: ({ pageParam }) => {
      return xanoGet("/doctors_simple_search", userType, {
        page: pageParam,
        search,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
