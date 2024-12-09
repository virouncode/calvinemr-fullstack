import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import {
  AdminType,
  BillingCodeTemplateType,
  XanoPaginatedType,
} from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import useUserContext from "../../context/useUserContext";

export const useBillingCodesTemplates = (search: string) => {
  const { user } = useUserContext() as { user: UserStaffType | AdminType };
  const userType = user.access_level;
  return useInfiniteQuery<XanoPaginatedType<BillingCodeTemplateType>>({
    queryKey: ["billingCodesTemplates", search],
    queryFn: ({ pageParam }) =>
      xanoGet("/billing_codes_templates", userType, {
        page: pageParam,
        search,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const useBillingCodesFavoritesTemplates = (
  userId: number,
  search: string
) => {
  const { user } = useUserContext() as { user: UserStaffType | AdminType };
  const userType = user.access_level;
  return useQuery<BillingCodeTemplateType[]>({
    queryKey: ["billingCodesFavoritesTemplates", userId, search],
    queryFn: () =>
      xanoGet("/billing_codes_templates_favorites_for_staff", userType, {
        search,
        staff_id: userId,
      }),
  });
};
