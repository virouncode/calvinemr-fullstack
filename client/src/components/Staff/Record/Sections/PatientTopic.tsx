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
import FamilyHistoryDropDown from "../Topics/FamilyHistory/FamilyHistoryDropDown";
import FamilyHistoryPopUp from "../Topics/FamilyHistory/FamilyHistoryPopUp";
import ImmunizationsContent from "../Topics/Immunizations/ImmunizationsContent";
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
          <PastHealthDropDown
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
            <PastHealthPopUp
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
          <FamilyHistoryDropDown
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
            <FamilyHistoryPopUp
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
          <RelationshipsDropDown
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
            <RelationshipsPopUp
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
          <MedicationsDropDown
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
            <MedicationsPopUp
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
          <PrescriptionsDropDown
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
            <PrescriptionsPopUp
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
          <PharmaciesDropDown
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
            <PharmaciesPopUp
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
          <RemindersDropDown
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
            <RemindersPopUp
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
          <LettersDropDown
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
            <LettersPopUp
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
          <PersonalHistoryDropDown
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
            <PersonalHistoryPopUp
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
          <ProblemListDropDown
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
            <ProblemListPopUp
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
          <PregnanciesDropDown
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
            <PregnanciesPopUp
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
            <ImmunizationsPopUp
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
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isFetching}
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
          <MessagesDropDown
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
          <MessagesExternalDropDown
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
