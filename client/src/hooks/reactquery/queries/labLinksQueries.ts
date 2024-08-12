import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import {
  LabLinkCredentialsType,
  LabLinkType,
  PaginatedLabLinksPersonalType,
} from "../../../types/api";

export const useLabLinks = () => {
  return useQuery({
    queryKey: ["labLinks"],
    queryFn: (): Promise<LabLinkType[]> => xanoGet("/lablinks", "staff"),
  });
};
export const useLabLinksPersonal = (staffId: number, search: string) => {
  return useInfiniteQuery({
    queryKey: ["labLinksPersonal", staffId, search],
    queryFn: ({ pageParam }): Promise<PaginatedLabLinksPersonalType> =>
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
  return useQuery({
    queryKey: ["labLinksCredentials", staffId],
    queryFn: (): Promise<LabLinkCredentialsType[]> =>
      xanoGet("/lablinks_credentials_of_staff", "staff", { staff_id: staffId }),
  });
};
