import React, { useRef } from "react";
import { GroupType } from "../../../../types/api";
import GroupsDropDown from "../Topics/Groups/GroupsDropDown";
import PatientTopicHeaderNoPopUp from "./PatientTopicHeaderNoPopUp";

type PatientTopicGroupsProps = {
  backgroundColor: string;
  textColor: string;
  patientId: number;
  contentsVisible?: boolean;
  side: "right" | "left";
  data: GroupType[];
};

const PatientTopicGroups = ({
  backgroundColor,
  textColor,
  patientId,
  contentsVisible,
  side,
  data,
}: PatientTopicGroupsProps) => {
  //Hooks
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triangleRef = useRef<SVGSVGElement | null>(null);
  //Queries

  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  const handleClickHeader = () => {
    if (triangleRef.current)
      triangleRef.current.classList.toggle("triangle--active");
    if (containerRef.current) {
      containerRef.current.classList.toggle(
        `patient-record__topic-container--active`
      );
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
        <PatientTopicHeaderNoPopUp
          topic="GROUPS"
          contentsVisible={contentsVisible ?? false}
          triangleRef={triangleRef}
        />
      </div>
      <div
        className={
          contentsVisible
            ? `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active`
            : `patient-record__topic-container patient-record__topic-container--${side} `
        }
        ref={containerRef}
      >
        <GroupsDropDown data={data} patientId={patientId} />
      </div>
    </div>
  );
};

export default PatientTopicGroups;
