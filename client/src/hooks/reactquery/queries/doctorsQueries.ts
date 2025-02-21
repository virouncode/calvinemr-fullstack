import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import {
  DoctorType,
  SearchStaffType,
  XanoPaginatedType,
} from "../../../types/api";
import useUserContext from "../../context/useUserContext";

export const useDoctors = () => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  return useInfiniteQuery<XanoPaginatedType<DoctorType>>({
    queryKey: ["doctors"],
    queryFn: ({ pageParam }) => {
      return xanoGet("/doctors", userType as string, { page: pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const useDoctorsSimpleSearch = (search: string) => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  return useInfiniteQuery<XanoPaginatedType<DoctorType>>({
    queryKey: ["doctors", search],
    queryFn: ({ pageParam }) => {
      return xanoGet("/doctors_simple_search", userType as string, {
        page: pageParam,
        search,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const useDoctorsSearch = (search: SearchStaffType) => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  return useInfiniteQuery<XanoPaginatedType<DoctorType>>({
    queryKey: ["doctors", search],
    queryFn: ({ pageParam }) => {
      return xanoGet("/doctors_search", userType as string, {
        page: pageParam,
        search,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
