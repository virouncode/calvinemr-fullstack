import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import {
  AdminType,
  BillingCodeTemplateType,
  PaginatedDatasType,
} from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import useUserContext from "../../context/useUserContext";

export const useBillingCodesTemplates = (search: string) => {
  const { user } = useUserContext() as { user: UserStaffType | AdminType };
  const userType = user.access_level;
  return useInfiniteQuery({
    queryKey: ["billingCodesTemplates", search],
    queryFn: ({
      pageParam,
    }): Promise<PaginatedDatasType<BillingCodeTemplateType>> =>
      xanoGet("/billing_codes_templates", userType, {
        page: pageParam,
        search,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
