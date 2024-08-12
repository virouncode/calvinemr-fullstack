import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import {
  PaginatedAlertsType,
  PaginatedAllergiesType,
  PaginatedAppointmentsType,
  PaginatedCareElementsType,
  PaginatedCyclesType,
  PaginatedEformsType,
  PaginatedFamilyHistoriesType,
  PaginatedGroupsType,
  PaginatedImmunizationsType,
  PaginatedLettersType,
  PaginatedMedsType,
  PaginatedMessagesExternalType,
  PaginatedMessagesType,
  PaginatedPastHealthsType,
  PaginatedPersonalHistoryType,
  PaginatedPharmaciesType,
  PaginatedPregnanciesType,
  PaginatedPrescriptionType,
  PaginatedProblemListsType,
  PaginatedRelationshipsType,
  PaginatedRemindersType,
  PaginatedReportsType,
  PaginatedRiskFactorsType,
} from "../../../types/api";
import { Topic } from "../../../types/app";
import { getTopicUrl } from "../../../utils/topics/getTopicUrl";

type TopicDataType<T extends Topic> = T extends "PAST HEALTH"
  ? PaginatedPastHealthsType
  : T extends "FAMILY HISTORY"
  ? PaginatedFamilyHistoriesType
  : T extends "RELATIONSHIPS"
  ? PaginatedRelationshipsType
  : T extends "ALERTS & SPECIAL NEEDS"
  ? PaginatedAlertsType
  : T extends "RISK FACTORS"
  ? PaginatedRiskFactorsType
  : T extends "MEDICATIONS & TREATMENTS"
  ? PaginatedMedsType
  : T extends "PAST PRESCRIPTIONS"
  ? PaginatedPrescriptionType
  : T extends "PHARMACIES"
  ? PaginatedPharmaciesType
  : T extends "E-FORMS"
  ? PaginatedEformsType
  : T extends "REMINDERS"
  ? PaginatedRemindersType
  : T extends "LETTERS/REFERRALS"
  ? PaginatedLettersType
  : T extends "GROUPS"
  ? PaginatedGroupsType
  : T extends "PERSONAL HISTORY"
  ? PaginatedPersonalHistoryType
  : T extends "CARE ELEMENTS"
  ? PaginatedCareElementsType
  : T extends "PROBLEM LIST"
  ? PaginatedProblemListsType
  : T extends "PREGNANCIES"
  ? PaginatedPregnanciesType
  : T extends "CYCLES"
  ? PaginatedCyclesType
  : T extends "ALLERGIES & ADVERSE REACTIONS"
  ? PaginatedAllergiesType
  : T extends "REPORTS"
  ? PaginatedReportsType
  : T extends "IMMUNIZATIONS"
  ? PaginatedImmunizationsType
  : T extends "APPOINTMENTS"
  ? PaginatedAppointmentsType
  : T extends "MESSAGES ABOUT PATIENT"
  ? PaginatedMessagesType
  : T extends "MESSAGES WITH PATIENT"
  ? PaginatedMessagesExternalType
  : { nextPage: number | null };

export const useTopic = <T extends Topic>(topic: T, patientId: number) => {
  return useInfiniteQuery({
    queryKey: topic === "PHARMACIES" ? [topic] : [topic, patientId],
    queryFn: ({ pageParam }): Promise<TopicDataType<T>> => {
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
