import React from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { usePatient } from "../../../../hooks/reactquery/queries/patientsQueries";
import { AppointmentType } from "../../../../types/api";
import { timestampToDateTimeSecondsStrTZ } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";

type EventFormInfosProps = {
  formDatas: AppointmentType;
};

const EventFormInfos = ({ formDatas }: EventFormInfosProps) => {
  const { staffInfos } = useStaffInfosContext();
  const { data: patientInfos } = usePatient(
    formDatas.created_by_user_type === "patient"
      ? formDatas.created_by_id
      : null
  );

  const isUpdated = formDatas.updates && formDatas.updates.length > 0;
  if (isUpdated) {
    const lastUpdateDate = timestampToDateTimeSecondsStrTZ(
      formDatas.updates!.sort((a, b) => b.date_updated - a.date_updated)[0]
        .date_updated
    );
    const lastUpdateBy = staffIdToTitleAndName(
      staffInfos,
      formDatas.updates!.sort((a, b) => b.date_updated - a.date_updated)[0]
        .updated_by_id
    );
    return (
      <div
        style={{
          fontStyle: "italic",
          textAlign: "end",
          marginBottom: "0.5rem",
          fontSize: "0.6rem",
        }}
      >
        Updated by {lastUpdateBy} ({lastUpdateDate})
      </div>
    );
  }
  const dateCreated = timestampToDateTimeSecondsStrTZ(formDatas.date_created);
  const createdBy = patientInfos
    ? toPatientName(patientInfos)
    : staffIdToTitleAndName(staffInfos, formDatas.created_by_id);

  return (
    <div
      style={{
        fontStyle: "italic",
        textAlign: "end",
        marginBottom: "0.5rem",
        fontSize: "0.6rem",
      }}
    >
      Created by {createdBy} ({dateCreated})
    </div>
  );
};

export default EventFormInfos;
