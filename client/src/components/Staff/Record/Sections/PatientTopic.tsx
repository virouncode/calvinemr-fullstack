import { useMediaQuery } from "@mui/material";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  AlertType,
  AllergyType,
  AppointmentType,
  CareElementType,
  ChecklistType,
  ConsentFormType,
  CycleType,
  DemographicsType,
  EformType,
  FamilyHistoryType,
  LetterType,
  MedType,
  MessageExternalType,
  MessageType,
  PastHealthType,
  PersonalHistoryType,
  PregnancyType,
  PrescriptionType,
  ProblemListType,
  RelationshipType,
  ReminderType,
  RiskFactorType,
  TodoType,
  TopicType,
  TopicUnionType,
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
import ChecklistDropDown from "../Topics/Checklist/ChecklistDropDown";
import ChecklistPopUp from "../Topics/Checklist/ChecklistPopUp";
import ConsentFormsDropDown from "../Topics/ConsentForms/ConsentFormsDropDown";
import ConsentFormsPopUp from "../Topics/ConsentForms/ConsentFormsPopUp";
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
  data?: TopicUnionType[];
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
  data,
}: PatientTopicProps) => {
  //Hooks
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triangleRef = useRef<SVGSVGElement | null>(null);
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
  const isLargeScreen = useMediaQuery("(min-width: 1280px)");

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //HANDLERS
  const handlePopUpClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    if (!isLargeScreen && topic === "IMMUNIZATIONS") {
      toast.warning("This feature is not optimized for small screens", {
        containerId: "A",
      });
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
    if (topic === "TO-DOS ABOUT PATIENT" && containerRef.current) {
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
          <PastHealthDropDown data={data as PastHealthType[]} />
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* FAMILY HISTORY */}
        {topic === "FAMILY HISTORY" && (
          <FamilyHistoryDropDown data={data as FamilyHistoryType[]} />
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* RELATIONSHIPS */}
        {topic === "RELATIONSHIPS" && (
          <RelationshipsDropDown data={data as RelationshipType[]} />
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* ALERTS AND SPECIAL NEEDS */}
        {topic === "ALERTS & SPECIAL NEEDS" && (
          <AlertsDropDown data={data as AlertType[]} />
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* RISK FACTORS */}
        {topic === "RISK FACTORS" && (
          <RisksDropDown data={data as RiskFactorType[]} />
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* MEDICATIONS & TREATMENTS */}
        {topic === "MEDICATIONS & TREATMENTS" && (
          <MedicationsDropDown data={data as MedType[]} />
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos as DemographicsType}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PAST PRESCRIPTIONS */}
        {topic === "PAST PRESCRIPTIONS" && (
          <PrescriptionsDropDown data={data as PrescriptionType[]} />
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
              demographicsInfos={demographicsInfos as DemographicsType}
              setPopUpVisible={setPopUpVisible}
              patientId={patientId}
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos as DemographicsType}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/*E-FORMS */}
        {topic === "E-FORMS" && <EformsDropDown data={data as EformType[]} />}
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos as DemographicsType}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/*CONSENT FORMS */}
        {topic === "CONSENT FORMS" && (
          <ConsentFormsDropDown data={data as ConsentFormType[]} />
        )}
        {topic === "CONSENT FORMS" && popUpVisible && (
          <FakeWindow
            title={`CONSENT FORMS of ${patientName}`}
            width={1000}
            height={650}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 650) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ConsentFormsPopUp
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos as DemographicsType}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* REMINDERS */}
        {topic === "REMINDERS" && (
          <RemindersDropDown data={data as ReminderType[]} />
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/* LETTERS/REFERRALS */}
        {topic === "LETTERS/REFERRALS" && (
          <LettersDropDown data={data as LetterType[]} />
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              patientName={patientName}
              demographicsInfos={demographicsInfos as DemographicsType}
            />
          </FakeWindow>
        )}
        {/* PERSONAL HISTORY */}
        {topic === "PERSONAL HISTORY" && (
          <PersonalHistoryDropDown data={data as PersonalHistoryType[]} />
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* CARE ELEMENTS */}
        {topic === "CARE ELEMENTS" && (
          <CareElementsDropDown data={data as CareElementType[]} />
        )}
        {topic === "CARE ELEMENTS" && popUpVisible && (
          <FakeWindow
            title={`CARE ELEMENTS of ${patientName}`}
            width={window.innerWidth}
            height={600}
            x={0}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <CareElementsPopUp
              patientId={patientId}
              patientName={patientName}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PROBLEM LIST */}
        {topic === "PROBLEM LIST" && (
          <ProblemListDropDown data={data as ProblemListType[]} />
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PREGNANCIES */}
        {topic === "PREGNANCIES" && (
          <PregnanciesDropDown data={data as PregnancyType[]} />
        )}
        {topic === "PREGNANCIES" && popUpVisible && (
          <FakeWindow
            title={`PREGNANCIES of ${patientName}`}
            width={window.innerWidth}
            height={600}
            x={0}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PregnanciesPopUp
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* CYCLES */}
        {topic === "CYCLES" && (
          <CycleDropDown
            data={data as CycleType[]}
            demographicsInfos={demographicsInfos as DemographicsType}
          />
        )}
        {topic === "CYCLES" && popUpVisible && (
          <FakeWindow
            title={`CYCLES of ${patientName}`}
            width={window.innerWidth}
            height={window.innerHeight}
            x={0}
            y={0}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <CyclesPopUp
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos as DemographicsType}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* ALLERGIES */}
        {topic === "ALLERGIES & ADVERSE REACTIONS" && (
          <AllergiesDropDown data={data as AllergyType[]} />
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              patientDob={patientDob as number}
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              patientDob={patientDob as number}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* APPOINTMENTS */}
        {topic === "APPOINTMENTS" && (
          <AppointmentsDropdown data={data as AppointmentType[]} />
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
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}

        {/* CHECKLIST */}
        {topic === "CHECKLIST" && (
          <ChecklistDropDown data={data as ChecklistType[]} />
        )}
        {topic === "CHECKLIST" && popUpVisible && (
          <FakeWindow
            title={`CHECKLIST of ${patientName}`}
            width={window.innerWidth}
            height={600}
            x={0}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ChecklistPopUp
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* MESSAGES ABOUT PATIENT */}
        {topic === "MESSAGES ABOUT PATIENT" && (
          <MessagesDropDown data={data as MessageType[]} />
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
          <MessagesExternalDropDown data={data as MessageExternalType[]} />
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
          <TodosDropDown data={data as TodoType[]} />
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
