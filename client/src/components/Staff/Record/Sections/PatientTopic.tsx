import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import {
  useTopicDelete,
  useTopicPost,
  useTopicPut,
} from "../../../../hooks/reactquery/mutations/topicMutations";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import {
  AlertType,
  CareElementType,
  DemographicsType,
  TopicType,
  XanoPaginatedType,
} from "../../../../types/api";
import { toPatientName } from "../../../../utils/names/toPatientName";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import NewMessageExternal from "../../Messaging/External/NewMessageExternal";
import NewMessage from "../../Messaging/Internal/NewMessage";
import NewTodo from "../../Messaging/Internal/NewTodo";
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
import EformsContent from "../Topics/Eforms/EformsContent";
import EformsPU from "../Topics/Eforms/EformsPU";
import FamilyHistoryContent from "../Topics/FamilyHistory/FamilyHistoryContent";
import FamilyHistoryPU from "../Topics/FamilyHistory/FamilyHistoryPU";
import ImmunizationsContent from "../Topics/Immunizations/ImmunizationsContent";
import ImmunizationsPU from "../Topics/Immunizations/ImmunizationsPU";
import LettersContent from "../Topics/Letters/LettersContent";
import LettersPU from "../Topics/Letters/LettersPU";
import MedicationsContent from "../Topics/Medications/MedicationsContent";
import MedicationsPU from "../Topics/Medications/MedicationsPU";
import MessagesContent from "../Topics/MessagesAboutPatient/MessagesContent";
import MessagesExternalContent from "../Topics/MessagesWithPatient/MessagesExternalContent";
import PastHealthContent from "../Topics/PastHealth/PastHealthContent";
import PastHealthPU from "../Topics/PastHealth/PastHealthPU";
import PersonalHistoryContent from "../Topics/PersonalHistory/PersonalHistoryContent";
import PersonalHistoryPU from "../Topics/PersonalHistory/PersonalHistoryPU";
import PharmaciesContent from "../Topics/Pharmacies/PharmaciesContent";
import PharmaciesPU from "../Topics/Pharmacies/PharmaciesPU";
import PregnanciesContent from "../Topics/Pregnancies/PregnanciesContent";
import PregnanciesPU from "../Topics/Pregnancies/PregnanciesPU";
import PrescriptionsContent from "../Topics/Prescriptions/PrescriptionsContent";
import PrescriptionsPU from "../Topics/Prescriptions/PrescriptionsPU";
import ProblemListContent from "../Topics/ProblemList/ProblemListContent";
import ProblemListPU from "../Topics/ProblemList/ProblemListPU";
import RelationshipsContent from "../Topics/Relationships/RelationshipsContent";
import RelationshipsPU from "../Topics/Relationships/RelationshipsPU";
import RemindersContent from "../Topics/Reminders/RemindersContent";
import RemindersPU from "../Topics/Reminders/RemindersPU";
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
  loadingPatient?: boolean;
  errPatient?: string;
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
  loadingPatient,
  errPatient,
}: PatientTopicProps) => {
  //Hooks
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triangleRef = useRef<SVGSVGElement | null>(null);
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
          <PastHealthContent
            topicDatas={topicDatas}
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "PAST HEALTH" && popUpVisible && (
          <FakeWindow
            title={`PAST HEALTH of ${patientName}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PastHealthPU
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* FAMILY HISTORY */}
        {topic === "FAMILY HISTORY" && (
          <FamilyHistoryContent
            topicDatas={topicDatas}
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "FAMILY HISTORY" && popUpVisible && (
          <FakeWindow
            title={`FAMILY HISTORY of ${patientName}`}
            width={1200}
            height={600}
            x={(window.innerWidth - 1200) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <FamilyHistoryPU
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* RELATIONSHIPS */}
        {topic === "RELATIONSHIPS" && (
          <RelationshipsContent
            topicDatas={topicDatas}
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
            <RelationshipsPU
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
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
            width={1100}
            height={600}
            x={(window.innerWidth - 1100) / 2}
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
                topicPost as UseMutationResult<
                  AlertType,
                  Error,
                  AlertType,
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
            topicDatas={topicDatas}
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "RISK FACTORS" && popUpVisible && (
          <FakeWindow
            title={`RISK FACTORS of ${patientName}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <RisksPopUp
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* MEDICATIONS & TREATMENTS */}
        {topic === "MEDICATIONS & TREATMENTS" && (
          <MedicationsContent
            topicDatas={topicDatas}
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "MEDICATIONS & TREATMENTS" && popUpVisible && (
          <FakeWindow
            title={`MEDICATIONS & TREATMENTS for ${patientName}`}
            width={1400}
            height={620}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 620) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <MedicationsPU
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicDelete={topicDelete}
              isPending={isPending}
              errMsg={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PAST PRESCRIPTIONS */}
        {topic === "PAST PRESCRIPTIONS" && (
          <PrescriptionsContent
            topicDatas={topicDatas}
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
            <PrescriptionsPU
              topicDatas={topicDatas}
              isPending={isPending}
              error={error}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
              topicDelete={topicDelete}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PHARMACIES */}
        {topic === "PHARMACIES" && (
          <PharmaciesContent
            patientId={patientId}
            demographicsInfos={demographicsInfos}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        )}
        {topic === "PHARMACIES" && popUpVisible && (
          <FakeWindow
            title={`PREFERRED PHARMACY of ${patientName}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PharmaciesPU
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/*E-FORMS */}
        {topic === "E-FORMS" && (
          <EformsContent
            topicDatas={topicDatas}
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
            <EformsPU
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* REMINDERS */}
        {topic === "REMINDERS" && (
          <RemindersContent
            topicDatas={topicDatas}
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
            <RemindersPU
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/* LETTERS/REFERRALS */}
        {topic === "LETTERS/REFERRALS" && (
          <LettersContent
            topicDatas={topicDatas}
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "LETTERS/REFERRALS" && popUpVisible && (
          <FakeWindow
            title={`LETTERS/REFERRALS for ${patientName}`}
            width={1200}
            height={600}
            x={(window.innerWidth - 1200) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <LettersPU
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
              patientName={patientName}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/* PERSONAL HISTORY */}
        {topic === "PERSONAL HISTORY" && (
          <PersonalHistoryContent
            topicDatas={topicDatas}
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "PERSONAL HISTORY" && popUpVisible && (
          <FakeWindow
            title={`PERSONAL HISTORY of ${patientName}`}
            width={600}
            height={500}
            x={(window.innerWidth - 600) / 2}
            y={(window.innerHeight - 500) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PersonalHistoryPU
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
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
            height={580}
            x={(window.innerWidth - 500) / 2}
            y={(window.innerHeight - 580) / 2}
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
                topicPost as UseMutationResult<
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
          <ProblemListContent
            topicDatas={topicDatas}
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "PROBLEM LIST" && popUpVisible && (
          <FakeWindow
            title={`PROBLEM LIST of ${patientName}`}
            width={1250}
            height={600}
            x={(window.innerWidth - 1250) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ProblemListPU
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PREGNANCIES */}
        {topic === "PREGNANCIES" && (
          <PregnanciesContent
            topicDatas={topicDatas}
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
            <PregnanciesPU
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* CYCLES */}
        {topic === "CYCLES" && (
          <CycleDropDown
            topicDatas={topicDatas}
            isPending={isPending}
            error={error}
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
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* ALLERGIES */}
        {topic === "ALLERGIES & ADVERSE REACTIONS" && (
          <AllergiesDropDown
            topicDatas={topicDatas}
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "ALLERGIES & ADVERSE REACTIONS" && popUpVisible && (
          <FakeWindow
            title={`ALLERGIES & ADVERSE REACTIONS of ${patientName}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AllergiesPopUp
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/* IMMUNIZATIONS */}
        {topic === "IMMUNIZATIONS" && <ImmunizationsContent />}
        {topic === "IMMUNIZATIONS" && popUpVisible && (
          <FakeWindow
            title={`IMMUNIZATIONS of ${patientName}`}
            width={1460}
            height={800}
            x={0}
            y={0}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ImmunizationsPU
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              patientDob={patientDob}
              loadingPatient={loadingPatient}
              errPatient={errPatient}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* APPOINTMENTS */}
        {topic === "APPOINTMENTS" && (
          <AppointmentsDropdown
            topicDatas={topicDatas}
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "APPOINTMENTS" && popUpVisible && (
          <FakeWindow
            title={`APPOINTMENTS of ${patientName}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AppointmentsPopUp
              topicDatas={topicDatas}
              topicPost={topicPost}
              topicPut={topicPut}
              topicDelete={topicDelete}
              isPending={isPending}
              error={error}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* MESSAGES ABOUT PATIENT */}
        {topic === "MESSAGES ABOUT PATIENT" && (
          <MessagesContent
            topicDatas={topicDatas}
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "MESSAGES ABOUT PATIENT" && popUpVisible && (
          <FakeWindow
            title="NEW MESSAGE"
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <NewMessage
              setNewVisible={setPopUpVisible}
              initialPatient={{
                id: patientId,
                name: toPatientName(demographicsInfos),
              }}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* MESSAGES WITH PATIENT */}
        {topic === "MESSAGES WITH PATIENT" && (
          <MessagesExternalContent
            topicDatas={topicDatas}
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "MESSAGES WITH PATIENT" && popUpVisible && (
          <FakeWindow
            title="NEW EXTERNAL MESSAGE"
            width={1000}
            height={600}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
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
          </FakeWindow>
        )}
        {/*******************/}
        {/* TO-DOS ABOUT PATIENT */}
        {topic === "TO-DOS ABOUT PATIENT" && (
          <TodosDropDown
            topicDatas={topicDatas}
            isPending={isPending}
            error={error}
          />
        )}
        {topic === "TO-DOS ABOUT PATIENT" && popUpVisible && (
          <FakeWindow
            title="NEW TO-DO"
            width={1300}
            height={620}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 620) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <NewTodo
              setNewTodoVisible={setPopUpVisible}
              initialPatient={{
                id: patientId,
                name: toPatientName(demographicsInfos),
              }}
            />
          </FakeWindow>
        )}
      </div>
    </div>
  );
};

export default PatientTopic;
