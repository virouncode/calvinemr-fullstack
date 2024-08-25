import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { TopicPaginatedDataMap, TopicPaginatedType } from "../../../types/api";
import { getTopicUrl } from "../../../utils/topics/getTopicUrl";

export const useTopic = <T extends TopicPaginatedType>(
  topic: T,
  patientId: number
) => {
  return useInfiniteQuery<TopicPaginatedDataMap[T], Error>({
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
