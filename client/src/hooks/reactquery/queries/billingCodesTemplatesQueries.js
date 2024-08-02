import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../context/useUserContext";

export const useBillingCodesTemplates = (search) => {
  const { user } = useUserContext();
  const userType = user.access_level;
  return useInfiniteQuery({
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
