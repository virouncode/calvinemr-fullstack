import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { getTopicUrl } from "../../../utils/topics/getTopicUrl";

export const useTopic = (topic, patientId) => {
  return useInfiniteQuery({
    queryKey: topic === "PHARMACIES" ? [topic] : [topic, patientId],
    queryFn: ({ pageParam }) => {
      return xanoGet(getTopicUrl(topic), "staff", {
        patient_id: patientId,
        page: pageParam,
      });
    },
    enabled: !!getTopicUrl(topic),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
