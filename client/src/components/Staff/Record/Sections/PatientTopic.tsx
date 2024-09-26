import { useMediaQuery } from "@mui/material";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  useTopicDelete,
  useTopicPost,
  useTopicPut,
} from "../../../../hooks/reactquery/mutations/topicMutations";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import {
  AlertType,
  AllergyType,
  AppointmentType,
  CareElementType,
  CycleType,
  DemographicsType,
  EformType,
  FamilyHistoryType,
  ImmunizationType,
  LetterType,
  MedType,
  MessageExternalType,
  MessageType,
  PastHealthType,
  PersonalHistoryType,
  PharmacyType,
  PregnancyType,
  PrescriptionType,
  ProblemListType,
  RelationshipType,
  ReminderType,
  RiskFactorType,
  TodoType,
  TopicType,
  XanoPaginatedType,
} from "../../../../types/api";
import { toPatientName } from "../../../../utils/names/toPatientName";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import NewMessageExternal from "../../Messaging/External/NewMessageExternal";
import NewMessageExternalMobile from "../../Messaging/External/NewMessageExternalMobile";
import NewMessage from "../../Messaging/Internal/NewMessage";
import NewMessageMobile from "../../Messaging/Internal/NewMessageMobile";
import NewTodo from "../../Messaging/Internal/NewTodo";
import NewTodoMobile from "../../Messaging/Internal/NewTodoMobile";
import AlertsDropDown from "../Topics/Alerts/AlertsDropDown";
import AlertsPopUp from "../Topics/Alerts/AlertsPopUp";
import AllergiesDropDown from "../Topics/Allergies/AllergiesDropDown";
import AllergiesPopUp from "../Topics/Allergies/AllergiesPopUp";
import AppointmentsDropdown from "../Topics/Appointments/AppointmentsDropDown";
import AppointmentsPopUp from "../Topics/Appointments/AppointmentsPopUp";
import CareElementsDropDown from "../Topics/CareElements/CareElementsDropDown";
import CareElementsPopUp from "../Topics/CareElements/CareElementsPopUp";
import CycleDropDown from "../Topics/Cycles/CyclesDropDown";
import CyclesPopUp from "../Topics/Cycles/CyclesPopUp";
import EformsDropDown from "../Topics/Eforms/EformsDropDown";
import EformsPopUp from "../Topics/Eforms/EformsPopUp";
import FamilyHistoryDropDown from "../Topics/FamilyHistory/FamilyHistoryDropDown";
import FamilyHistoryPopUp from "../Topics/FamilyHistory/FamilyHistoryPopUp";
import ImmunizationsDropDown from "../Topics/Immunizations/ImmunizationsDropDown";
import ImmunizationsPopUp from "../Topics/Immunizations/ImmunizationsPopUp";
import LettersDropDown from "../Topics/Letters/LettersDropDown";
import LettersPopUp from "../Topics/Letters/LettersPopUp";
import MedicationsDropDown from "../Topics/Medications/MedicationsDropDown";
import MedicationsPopUp from "../Topics/Medications/MedicationsPopUp";
import MessagesDropDown from "../Topics/MessagesAboutPatient/MessagesDropDown";
import MessagesExternalDropDown from "../Topics/MessagesWithPatient/MessagesExternalDropDown";
import PastHealthDropDown from "../Topics/PastHealth/PastHealthDropDown";
import PastHealthPopUp from "../Topics/PastHealth/PastHealthPopUp";
import PersonalHistoryDropDown from "../Topics/PersonalHistory/PersonalHistoryDropDown";
import PersonalHistoryPopUp from "../Topics/PersonalHistory/PersonalHistoryPopUp";
import PharmaciesDropDown from "../Topics/Pharmacies/PharmaciesDropDown";
import PharmaciesPopUp from "../Topics/Pharmacies/PharmaciesPopUs";
import PregnanciesDropDown from "../Topics/Pregnancies/PregnanciesDropDown";
import PregnanciesPopUp from "../Topics/Pregnancies/PregnanciesPopUp";
import PrescriptionsDropDown from "../Topics/Prescriptions/PrescriptionsDropDown";
import PrescriptionsPopUp from "../Topics/Prescriptions/PrescriptionsPopUp";
import ProblemListDropDown from "../Topics/ProblemList/ProblemListDropDown";
import ProblemListPopUp from "../Topics/ProblemList/ProblemListPopUp";
import RelationshipsDropDown from "../Topics/Relationships/RelationshipsDropDown";
import RelationshipsPopUp from "../Topics/Relationships/RelationshipsPopUp";
import RemindersDropDown from "../Topics/Reminders/RemindersDropDown";
import RemindersPopUp from "../Topics/Reminders/RemindersPopUp";
import RisksDropDown from "../Topics/Risks/RisksDropDown";
import RisksPopUp from "../Topics/Risks/RisksPopUp";
import TodosDropDown from "../Topics/Todos/TodosDropDown";
import PatientTopicHeader from "./PatientTopicHeader";

type PatientTopicProps = {
  backgroundColor: string;
  textColor: string;
  topic: Exclude<TopicType, "GROUPS">;
  patientName: string;
  patientId: number;
  patientDob?: number;
  contentsVisible?: boolean;
  side: "right" | "left";
  demographicsInfos?: DemographicsType;
};

const PatientTopic = ({
  backgroundColor,
  textColor,
  topic,
  patientName,
  patientId,
  patientDob,
  contentsVisible,
  side,
  demographicsInfos,
}: PatientTopicProps) => {
  //Hooks
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triangleRef = useRef<SVGSVGElement | null>(null);
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
  const isLargeScreen = useMediaQuery("(min-width: 1280px)");
  //Queries
  const {
    data: topicDatas,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTopic(topic, patientId);
  const topicPost = useTopicPost(topic, patientId);
  const topicPut = useTopicPut(topic, patientId);
  const topicDelete = useTopicDelete(topic, patientId);

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //HANDLERS
  const handlePopUpClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    if (!isLargeScreen && topic === "IMMUNIZATIONS") {
      toast.warning("This feature is only available on large screen", {
        containerId: "A",
      });
      return;
    }
    setPopUpVisible((v) => !v);
  };
  const handleClickHeader = () => {
    if (triangleRef.current)
      triangleRef.current.classList.toggle("triangle--active");
    if (containerRef.current)
      containerRef.current.classList.toggle(
        `patient-record__topic-container--active`
      );
    if (
      (topic === "LETTERS/REFERRALS" || topic === "TO-DOS ABOUT PATIENT") &&
      containerRef.current
    ) {
      containerRef.current.classList.toggle(
        `patient-record__topic-container--bottom`
      );
    }
  };

  return (
    <div className="patient-record__topic">
      <div
        className={`patient-record__topic-header patient-record__topic-header--${side}`}
        style={TOPIC_STYLE}
        onClick={handleClickHeader}
      >
        <PatientTopicHeader
          topic={topic}
          handlePopUpClick={handlePopUpClick}
          contentsVisible={contentsVisible ?? false}
          popUpButton={
            topic === "MESSAGES WITH PATIENT" ||
            topic === "MESSAGES ABOUT PATIENT" ||
            topic === "TO-DOS ABOUT PATIENT"
              ? "paperPlane"
              : "popUp"
          }
          triangleRef={triangleRef}
        />
      </div>
      <div
        className={
          contentsVisible
            ? topic === "LETTERS/REFERRALS" || topic === "TO-DOS ABOUT PATIENT"
              ? `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active patient-record__topic-container--bottom`
              : `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active`
            : `patient-record__topic-container patient-record__topic-container--${side} `
        }
        ref={containerRef}
      >
        {/*******************/}
        {/* PAST HEALTH */}
        {topic === "PAST HEALTH" && (
          <PastHealthDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<PastHealthType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "PAST HEALTH" && popUpVisible && (
          <FakeWindow
            title={`PAST HEALTH of ${patientName}`}
            width={window.innerWidth}
            height={600}
            x={0}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PastHealthPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<PastHealthType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  PastHealthType,
                  Error,
                  Partial<PastHealthType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<
                  PastHealthType,
                  Error,
                  PastHealthType,
                  void
                >
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<PastHealthType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* FAMILY HISTORY */}
        {topic === "FAMILY HISTORY" && (
          <FamilyHistoryDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<FamilyHistoryType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "FAMILY HISTORY" && popUpVisible && (
          <FakeWindow
            title={`FAMILY HISTORY of ${patientName}`}
            width={window.innerWidth}
            height={600}
            x={0}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <FamilyHistoryPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<FamilyHistoryType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  FamilyHistoryType,
                  Error,
                  Partial<FamilyHistoryType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<
                  FamilyHistoryType,
                  Error,
                  FamilyHistoryType,
                  void
                >
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<FamilyHistoryType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* RELATIONSHIPS */}
        {topic === "RELATIONSHIPS" && (
          <RelationshipsDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<RelationshipType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "RELATIONSHIPS" && popUpVisible && (
          <FakeWindow
            title={`RELATIONSHIPS of ${patientName}`}
            width={1000}
            height={600}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <RelationshipsPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<RelationshipType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  RelationshipType,
                  Error,
                  Partial<RelationshipType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<
                  RelationshipType,
                  Error,
                  RelationshipType,
                  void
                >
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<RelationshipType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* ALERTS AND SPECIAL NEEDS */}
        {topic === "ALERTS & SPECIAL NEEDS" && (
          <AlertsDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<AlertType>, unknown>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "ALERTS & SPECIAL NEEDS" && popUpVisible && (
          <FakeWindow
            title={`ALERTS & SPECIAL NEEDS about ${patientName}`}
            width={1024}
            height={600}
            x={(window.innerWidth - 1024) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AlertsPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<AlertType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  AlertType,
                  Error,
                  Partial<AlertType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<AlertType, Error, AlertType, void>
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<AlertType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* RISK FACTORS */}
        {topic === "RISK FACTORS" && (
          <RisksDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<RiskFactorType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "RISK FACTORS" && popUpVisible && (
          <FakeWindow
            title={`RISK FACTORS of ${patientName}`}
            width={window.innerWidth}
            height={600}
            x={0}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <RisksPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<RiskFactorType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  RiskFactorType,
                  Error,
                  Partial<RiskFactorType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<
                  RiskFactorType,
                  Error,
                  RiskFactorType,
                  void
                >
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<RiskFactorType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* MEDICATIONS & TREATMENTS */}
        {topic === "MEDICATIONS & TREATMENTS" && (
          <MedicationsDropDown
            topicDatas={
              topicDatas as InfiniteData<XanoPaginatedType<MedType>> | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "MEDICATIONS & TREATMENTS" && popUpVisible && (
          <FakeWindow
            title={`MEDICATIONS & TREATMENTS for ${patientName}`}
            width={window.innerWidth}
            height={620}
            x={0}
            y={(window.innerHeight - 620) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <MedicationsPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<MedType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  MedType,
                  Error,
                  Partial<MedType>,
                  void
                >
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos as DemographicsType}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<MedType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PAST PRESCRIPTIONS */}
        {topic === "PAST PRESCRIPTIONS" && (
          <PrescriptionsDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<PrescriptionType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "PAST PRESCRIPTIONS" && popUpVisible && (
          <FakeWindow
            title={`PAST PRESCRIPTIONS for ${patientName}`}
            width={1000}
            height={700}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 700) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PrescriptionsPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<PrescriptionType>>
                  | undefined
              }
              isPending={isPending}
              error={error}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<PrescriptionType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
              topicDelete={topicDelete}
              demographicsInfos={demographicsInfos as DemographicsType}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PHARMACIES */}
        {topic === "PHARMACIES" && (
          <PharmaciesDropDown
            demographicsInfos={demographicsInfos as DemographicsType}
          />
        )}
        {topic === "PHARMACIES" && popUpVisible && (
          <FakeWindow
            title={`PREFERRED PHARMACY of ${patientName}`}
            width={window.innerWidth}
            height={700}
            x={0}
            y={(window.innerHeight - 700) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PharmaciesPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<PharmacyType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  PharmacyType,
                  Error,
                  Partial<PharmacyType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<
                  PharmacyType,
                  Error,
                  PharmacyType,
                  void
                >
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos as DemographicsType}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<PharmacyType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/*E-FORMS */}
        {topic === "E-FORMS" && (
          <EformsDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<EformType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "E-FORMS" && popUpVisible && (
          <FakeWindow
            title={`ELECTRONIC FORMS of ${patientName}`}
            width={1000}
            height={650}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 650) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <EformsPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<EformType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  EformType,
                  Error,
                  Partial<EformType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<EformType, Error, EformType, void>
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<EformType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
              demographicsInfos={demographicsInfos as DemographicsType}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* REMINDERS */}
        {topic === "REMINDERS" && (
          <RemindersDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<ReminderType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "REMINDERS" && popUpVisible && (
          <FakeWindow
            title={`REMINDERS for ${patientName}`}
            width={800}
            height={600}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <RemindersPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<ReminderType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  ReminderType,
                  Error,
                  Partial<ReminderType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<
                  ReminderType,
                  Error,
                  ReminderType,
                  void
                >
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<ReminderType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/* LETTERS/REFERRALS */}
        {topic === "LETTERS/REFERRALS" && (
          <LettersDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<LetterType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "LETTERS/REFERRALS" && popUpVisible && (
          <FakeWindow
            title={`LETTERS/REFERRALS for ${patientName}`}
            width={window.innerWidth}
            height={600}
            x={0}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <LettersPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<LetterType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  LetterType,
                  Error,
                  Partial<LetterType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<
                  LetterType,
                  Error,
                  LetterType,
                  void
                >
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<LetterType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
              patientName={patientName}
              demographicsInfos={demographicsInfos as DemographicsType}
            />
          </FakeWindow>
        )}
        {/* PERSONAL HISTORY */}
        {topic === "PERSONAL HISTORY" && (
          <PersonalHistoryDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<PersonalHistoryType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "PERSONAL HISTORY" && popUpVisible && (
          <FakeWindow
            title={`PERSONAL HISTORY of ${patientName}`}
            width={400}
            height={750}
            x={(window.innerWidth - 400) / 2}
            y={(window.innerHeight - 750) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PersonalHistoryPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<PersonalHistoryType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  PersonalHistoryType,
                  Error,
                  Partial<PersonalHistoryType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<
                  PersonalHistoryType,
                  Error,
                  PersonalHistoryType,
                  void
                >
              }
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* CARE ELEMENTS */}
        {topic === "CARE ELEMENTS" && (
          <CareElementsDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<CareElementType>, unknown>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "CARE ELEMENTS" && popUpVisible && (
          <FakeWindow
            title={`CARE ELEMENTS of ${patientName}`}
            width={500}
            height={750}
            x={(window.innerWidth - 500) / 2}
            y={(window.innerHeight - 750) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <CareElementsPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<CareElementType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  CareElementType,
                  Error,
                  Partial<CareElementType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<
                  CareElementType,
                  Error,
                  CareElementType,
                  void
                >
              }
              isPending={isPending}
              error={error}
              patientId={patientId}
              patientName={patientName}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PROBLEM LIST */}
        {topic === "PROBLEM LIST" && (
          <ProblemListDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<ProblemListType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "PROBLEM LIST" && popUpVisible && (
          <FakeWindow
            title={`PROBLEM LIST of ${patientName}`}
            width={window.innerWidth}
            height={600}
            x={0}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ProblemListPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<ProblemListType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  ProblemListType,
                  Error,
                  Partial<ProblemListType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<
                  ProblemListType,
                  Error,
                  ProblemListType,
                  void
                >
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<ProblemListType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PREGNANCIES */}
        {topic === "PREGNANCIES" && (
          <PregnanciesDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<PregnancyType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "PREGNANCIES" && popUpVisible && (
          <FakeWindow
            title={`PREGNANCIES of ${patientName}`}
            width={1200}
            height={600}
            x={(window.innerWidth - 1200) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PregnanciesPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<PregnancyType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  PregnancyType,
                  Error,
                  Partial<PregnancyType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<
                  PregnancyType,
                  Error,
                  PregnancyType,
                  void
                >
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<PregnancyType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* CYCLES */}
        {topic === "CYCLES" && (
          <CycleDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<CycleType>>
                | undefined
            }
            topicPut={
              topicPut as UseMutationResult<CycleType, Error, CycleType, void>
            }
            isPending={isPending}
            error={error}
            demographicsInfos={demographicsInfos as DemographicsType}
          />
        )}
        {topic === "CYCLES" && popUpVisible && (
          <FakeWindow
            title={`CYCLES of ${patientName}`}
            width={1100}
            height={600}
            x={(window.innerWidth - 1100) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <CyclesPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<CycleType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  CycleType,
                  Error,
                  Partial<CycleType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<CycleType, Error, CycleType, void>
              }
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<CycleType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
              demographicsInfos={demographicsInfos as DemographicsType}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* ALLERGIES */}
        {topic === "ALLERGIES & ADVERSE REACTIONS" && (
          <AllergiesDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<AllergyType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "ALLERGIES & ADVERSE REACTIONS" && popUpVisible && (
          <FakeWindow
            title={`ALLERGIES & ADVERSE REACTIONS of ${patientName}`}
            width={window.innerWidth}
            height={600}
            x={0}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AllergiesPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<AllergyType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  AllergyType,
                  Error,
                  Partial<AllergyType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<
                  AllergyType,
                  Error,
                  AllergyType,
                  void
                >
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<AllergyType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/* IMMUNIZATIONS */}
        {topic === "IMMUNIZATIONS" && <ImmunizationsDropDown />}
        {topic === "IMMUNIZATIONS" && popUpVisible && (
          <FakeWindow
            title={`IMMUNIZATIONS of ${patientName}`}
            width={window.innerWidth}
            height={800}
            x={0}
            y={0}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ImmunizationsPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<ImmunizationType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  ImmunizationType,
                  Error,
                  Partial<ImmunizationType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<
                  ImmunizationType,
                  Error,
                  ImmunizationType,
                  void
                >
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              patientDob={patientDob as number}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<ImmunizationType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* APPOINTMENTS */}
        {topic === "APPOINTMENTS" && (
          <AppointmentsDropdown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<AppointmentType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "APPOINTMENTS" && popUpVisible && (
          <FakeWindow
            title={`APPOINTMENTS of ${patientName}`}
            width={window.innerWidth}
            height={600}
            x={0}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AppointmentsPopUp
              topicDatas={
                topicDatas as
                  | InfiniteData<XanoPaginatedType<AppointmentType>>
                  | undefined
              }
              topicPost={
                topicPost as UseMutationResult<
                  AppointmentType,
                  Error,
                  Partial<AppointmentType>,
                  void
                >
              }
              topicPut={
                topicPut as UseMutationResult<
                  AppointmentType,
                  Error,
                  AppointmentType,
                  void
                >
              }
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos as DemographicsType}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={
                fetchNextPage as (
                  options?: FetchNextPageOptions
                ) => Promise<
                  InfiniteQueryObserverResult<
                    InfiniteData<XanoPaginatedType<AppointmentType>, unknown>,
                    Error
                  >
                >
              }
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* MESSAGES ABOUT PATIENT */}
        {topic === "MESSAGES ABOUT PATIENT" && (
          <MessagesDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<MessageType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "MESSAGES ABOUT PATIENT" && popUpVisible && (
          <FakeWindow
            title="NEW MESSAGE"
            width={1024}
            height={600}
            x={(window.innerWidth - 1024) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            {isTabletOrMobile ? (
              <NewMessageMobile
                setNewVisible={setPopUpVisible}
                initialPatient={{
                  id: patientId,
                  name: toPatientName(demographicsInfos),
                }}
              />
            ) : (
              <NewMessage
                setNewVisible={setPopUpVisible}
                initialPatient={{
                  id: patientId,
                  name: toPatientName(demographicsInfos),
                }}
              />
            )}
          </FakeWindow>
        )}
        {/*******************/}
        {/* MESSAGES WITH PATIENT */}
        {topic === "MESSAGES WITH PATIENT" && (
          <MessagesExternalDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<MessageExternalType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "MESSAGES WITH PATIENT" && popUpVisible && (
          <FakeWindow
            title="NEW EXTERNAL MESSAGE"
            width={1000}
            height={630}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 630) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            {isTabletOrMobile ? (
              <NewMessageExternalMobile
                setNewVisible={setPopUpVisible}
                initialRecipients={[
                  {
                    id: patientId,
                    name: toPatientName(demographicsInfos),
                    email: demographicsInfos?.Email ?? "",
                    phone:
                      demographicsInfos?.PhoneNumber.find(
                        ({ _phoneNumberType }) => _phoneNumberType === "C"
                      )?.phoneNumber ?? "",
                  },
                ]}
              />
            ) : (
              <NewMessageExternal
                setNewVisible={setPopUpVisible}
                initialRecipients={[
                  {
                    id: patientId,
                    name: toPatientName(demographicsInfos),
                    email: demographicsInfos?.Email ?? "",
                    phone:
                      demographicsInfos?.PhoneNumber.find(
                        ({ _phoneNumberType }) => _phoneNumberType === "C"
                      )?.phoneNumber ?? "",
                  },
                ]}
              />
            )}
          </FakeWindow>
        )}
        {/*******************/}
        {/* TO-DOS ABOUT PATIENT */}
        {topic === "TO-DOS ABOUT PATIENT" && (
          <TodosDropDown
            topicDatas={
              topicDatas as
                | InfiniteData<XanoPaginatedType<TodoType>>
                | undefined
            }
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "TO-DOS ABOUT PATIENT" && popUpVisible && (
          <FakeWindow
            title="NEW TO-DO"
            width={1024}
            height={620}
            x={(window.innerWidth - 1024) / 2}
            y={(window.innerHeight - 620) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            {isTabletOrMobile ? (
              <NewTodoMobile
                setNewTodoVisible={setPopUpVisible}
                initialPatient={{
                  id: patientId,
                  name: toPatientName(demographicsInfos),
                }}
              />
            ) : (
              <NewTodo
                setNewTodoVisible={setPopUpVisible}
                initialPatient={{
                  id: patientId,
                  name: toPatientName(demographicsInfos),
                }}
              />
            )}
          </FakeWindow>
        )}
      </div>
    </div>
  );
};

export default PatientTopic;
