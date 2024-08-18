import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import {
  AlertType,
  AllergyType,
  AppointmentType,
  CareElementType,
  CycleType,
  EformType,
  FamilyHistoryType,
  GroupType,
  ImmunizationType,
  LetterType,
  MedType,
  MessageExternalType,
  MessageType,
  PaginatedDatasType,
  PastHealthType,
  PersonalHistoryType,
  PharmacyType,
  PregnancyType,
  PrescriptionType,
  ProblemListType,
  RelationshipType,
  ReminderType,
  ReportType,
  RiskFactorType,
} from "../../../types/api";
import { Topic } from "../../../types/app";
import { getTopicUrl } from "../../../utils/topics/getTopicUrl";

type TopicDataType<T extends Topic> = T extends "PAST HEALTH"
  ? PastHealthType
  : T extends "FAMILY HISTORY"
  ? FamilyHistoryType
  : T extends "RELATIONSHIPS"
  ? RelationshipType
  : T extends "ALERTS & SPECIAL NEEDS"
  ? AlertType
  : T extends "RISK FACTORS"
  ? RiskFactorType
  : T extends "MEDICATIONS & TREATMENTS"
  ? MedType
  : T extends "PAST PRESCRIPTIONS"
  ? PrescriptionType
  : T extends "PHARMACIES"
  ? PharmacyType
  : T extends "E-FORMS"
  ? EformType
  : T extends "REMINDERS"
  ? ReminderType
  : T extends "LETTERS/REFERRALS"
  ? LetterType
  : T extends "GROUPS"
  ? GroupType
  : T extends "PERSONAL HISTORY"
  ? PersonalHistoryType
  : T extends "CARE ELEMENTS"
  ? CareElementType
  : T extends "PROBLEM LIST"
  ? ProblemListType
  : T extends "PREGNANCIES"
  ? PregnancyType
  : T extends "CYCLES"
  ? CycleType
  : T extends "ALLERGIES & ADVERSE REACTIONS"
  ? AllergyType
  : T extends "REPORTS"
  ? ReportType
  : T extends "IMMUNIZATIONS"
  ? ImmunizationType
  : T extends "APPOINTMENTS"
  ? AppointmentType
  : T extends "MESSAGES ABOUT PATIENT"
  ? MessageType
  : T extends "MESSAGES WITH PATIENT"
  ? MessageExternalType
  : null;

export const useTopic = <T extends Topic>(topic: T, patientId: number) => {
  return useInfiniteQuery({
    queryKey: topic === "PHARMACIES" ? [topic] : [topic, patientId],
    queryFn: ({ pageParam }): Promise<PaginatedDatasType<TopicDataType<T>>> => {
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
