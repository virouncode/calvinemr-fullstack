import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import {
  LabLinkCredentialsType,
  LabLinkPersonalType,
  LabLinkType,
  XanoPaginatedType,
} from "../../../types/api";

export const useLabLinks = () => {
  return useQuery<LabLinkType[]>({
    queryKey: ["labLinks"],
    queryFn: () => xanoGet("/lablinks", "staff"),
  });
};
export const useLabLinksPersonal = (staffId: number, search: string) => {
  return useInfiniteQuery<XanoPaginatedType<LabLinkPersonalType>, Error>({
    queryKey: ["labLinksPersonal", staffId, search],
    queryFn: ({ pageParam }) =>
      xanoGet("/lablinks_personal_of_staff", "staff", {
        staff_id: staffId,
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const useLabLinksCredentials = (staffId: number) => {
  return useQuery<LabLinkCredentialsType[]>({
    queryKey: ["labLinksCredentials", staffId],
    queryFn: () =>
      xanoGet("/lablinks_credentials_of_staff", "staff", { staff_id: staffId }),
  });
};
