import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { PurposeCategoryType, PurposeType } from "../../../types/api";

export const usePurposesCategories = () => {
  return useQuery<PurposeCategoryType[]>({
    queryKey: ["purposes_categories"],
    queryFn: () => {
      return xanoGet("/purposes_categories", "staff");
    },
  });
};

export const usePurposes = () => {
  return useQuery<PurposeType[]>({
    queryKey: ["purposes"],
    queryFn: () => {
      return xanoGet("/purposes", "staff");
    },
  });
};
