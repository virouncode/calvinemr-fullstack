import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { DoctorType, PaginatedDatasType } from "../../../types/api";
import useUserContext from "../../context/useUserContext";

export const useDoctors = () => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  return useInfiniteQuery({
    queryKey: ["doctors"],
    queryFn: ({ pageParam }): Promise<PaginatedDatasType<DoctorType>> => {
      return xanoGet("/doctors", userType as string, { page: pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const useDoctorsSearch = (search) => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  return useInfiniteQuery({
    queryKey: ["doctors", search],
    queryFn: ({ pageParam }): Promise<PaginatedDatasType<DoctorType>> => {
      return xanoGet("/doctors_simple_search", userType as string, {
        page: pageParam,
        search,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
