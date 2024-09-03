import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { PharmacyType, XanoPaginatedType } from "../../../types/api";

export const usePatientPharmacies = (
  patientId: number,
  search: {
    name: string;
    address: string;
    city: string;
    postal_code: string;
    phone: string;
  }
) => {
  return useInfiniteQuery<XanoPaginatedType<PharmacyType>, Error>({
    queryKey: ["pharmacies", patientId, search],
    queryFn: ({ pageParam }) => {
      return xanoGet("/pharmacies_search", "patient", {
        page: pageParam,
        search,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
