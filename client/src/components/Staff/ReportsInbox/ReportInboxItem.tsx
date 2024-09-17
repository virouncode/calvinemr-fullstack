import { useMediaQuery } from "@mui/material";
import { uniqueId } from "lodash";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useReportInboxPut } from "../../../hooks/reactquery/mutations/reportsMutations";
import { useAllPatientAppointments } from "../../../hooks/reactquery/queries/allPatientAppointmentsQueries";
import { reportClassCT } from "../../../omdDatas/codesTables";
import {
  AppointmentType,
  MessageAttachmentType,
  ReportType,
} from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { getNextPatientAppointments } from "../../../utils/appointments/getNextPatientAppointments";
import { toNextOccurence } from "../../../utils/appointments/occurences";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToHumanDateTimeTZ,
} from "../../../utils/dates/formatDates";
import { showDocument } from "../../../utils/files/showDocument";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../utils/names/staffIdToName";
import { toPatientName } from "../../../utils/names/toPatientName";
import { showReportTextContent } from "../../../utils/reports/showReportTextContent";
import { reportSchema } from "../../../validation/record/reportValidation";
import Button from "../../UI/Buttons/Button";
import CancelButton from "../../UI/Buttons/CancelButton";
import EditButton from "../../UI/Buttons/EditButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import InputTextToggle from "../../UI/Inputs/InputTextToggle";
import GenericListToggle from "../../UI/Lists/GenericListToggle";
import ErrorRow from "../../UI/Tables/ErrorRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import SignCell from "../../UI/Tables/SignCell";
import FakeWindow from "../../UI/Windows/FakeWindow";
import NewMessage from "../Messaging/Internal/NewMessage";
import NewMessageMobile from "../Messaging/Internal/NewMessageMobile";
import NewTodo from "../Messaging/Internal/NewTodo";
import NewTodoMobile from "../Messaging/Internal/NewTodoMobile";

type ReportInboxItemProps = {
  item: ReportType;
  setForwardVisible: React.Dispatch<React.SetStateAction<boolean>>;
  forwardVisible: boolean;
  setReportToForwardId: React.Dispatch<React.SetStateAction<number>>;
  lastItemRef?: (node: Element | null) => void;
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
};

const ReportInboxItem = ({
  item,
  setForwardVisible,
  forwardVisible,
  setReportToForwardId,
  lastItemRef,
  errMsgPost,
  setErrMsgPost,
}: ReportInboxItemProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [progress, setProgress] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<ReportType>(item);
  const [todoVisible, setTodoVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [attachments, setAttachments] = useState<MessageAttachmentType[]>([]);
  const [initialBody, setInitialBody] = useState("");
  const [patientNextAppointment, setPatientNextAppointment] = useState<
    AppointmentType | undefined
  >();
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
  //Queries
  const {
    data: patientAppointments,
    isPending,
    error,
  } = useAllPatientAppointments(item.patient_id);

  const reportPut = useReportInboxPut(user.id);
  const reportInboxPut = useReportInboxPut(user.id);

  useEffect(() => {
    if (!patientAppointments || isPending || error) return;
    setPatientNextAppointment(
      getNextPatientAppointments(patientAppointments)[0]
    );
  }, [patientAppointments, isPending, error]);

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  const handleEdit = () => {
    setEditVisible(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    const value = e.target.value;
    const name = e.target.name;
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSend = (item: ReportType) => {
    setMessageVisible(true);
    if (item.Format === "Binary") {
      setAttachments([
        {
          id: uniqueId("attachment_"),
          file: item.File,
          alias: item.name,
          date_created: nowTZTimestamp(),
          created_by_id: user.id,
          created_by_user_type: "staff",
        },
      ]);
    } else {
      setInitialBody(`Dear colleague, please find below this patient report for your review:
      ${item.Content?.TextContent}`);
    }
  };

  const handleTodo = (item: ReportType) => {
    setTodoVisible(true);
    if (item.Format === "Binary") {
      setAttachments([
        {
          id: uniqueId("attachment_"),
          file: item.File,
          alias: item.name,
          date_created: nowTZTimestamp(),
          created_by_id: user.id,
          created_by_user_type: "staff",
        },
      ]);
      setInitialBody("See attached patient report.");
    } else {
      setInitialBody(`Patient report below:

      ${item.Content?.TextContent}`);
    }
  };

  const handleAcknowledge = async () => {
    setErrMsgPost("");

    setProgress(true);
    const reportToPut: ReportType = {
      ...item,
      acknowledged: true,
      ReportReviewed: [
        {
          Name: {
            FirstName: staffIdToFirstName(staffInfos, user.id),
            LastName: staffIdToLastName(staffInfos, user.id),
          },
          ReviewingOHIPPhysicianId: staffIdToOHIP(staffInfos, user.id),
          DateTimeReportReviewed: nowTZTimestamp(),
        },
      ],
      updates: [
        ...item.updates,
        { date_updated: nowTZTimestamp(), updated_by_id: user.id },
      ],
    };

    reportInboxPut.mutate(reportToPut, {
      onSuccess: () => {
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleForward = (reportId: number) => {
    setForwardVisible(true);
    setReportToForwardId(reportId);
  };

  const handleSave = async () => {
    setErrMsgPost("");
    //Validation
    try {
      await reportSchema.validate(itemInfos);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    setProgress(true);
    const datasToPut: ReportType = { ...itemInfos };
    reportPut.mutate(datasToPut, {
      onSuccess: () => {
        setEditVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  const handleCancel = () => {
    setErrMsgPost("");
    setItemInfos(item);
    setEditVisible(false);
  };

  if (isPending) return <LoadingRow colSpan={15} />;
  if (error)
    return (
      <div className="clinical-notes__title">
        <ErrorRow errorMsg={error.message} colSpan={15} />
      </div>
    );

  return (
    <>
      <tr
        className="reports__item"
        ref={lastItemRef}
        style={{ border: errMsgPost && "solid 1px red" }}
      >
        <td>
          <div className="reports__item-btn-container">
            {editVisible ? (
              <>
                <SaveButton onClick={handleSave} disabled={progress} />
                <CancelButton onClick={handleCancel} disabled={progress} />
              </>
            ) : (
              <>
                <Button
                  onClick={handleAcknowledge}
                  disabled={progress}
                  label="Acknowledge"
                />
                <Button
                  onClick={() => handleForward(item.id)}
                  disabled={forwardVisible || progress}
                  label="Forward"
                />
                <Button
                  onClick={() => handleSend(item)}
                  disabled={messageVisible || progress}
                  label="Message"
                />
                <Button
                  onClick={() => handleTodo(item)}
                  disabled={todoVisible || progress}
                  label="To-do"
                />
                <EditButton
                  onClick={handleEdit}
                  disabled={forwardVisible || progress}
                />
              </>
            )}
          </div>
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.name}
            onChange={handleChange}
            name="name"
            editVisible={editVisible}
          />
        </td>
        <td>{item.Format}</td>
        <td>{item.FileExtensionAndVersion}</td>
        <td
          className="reports__link"
          onClick={() =>
            item.File
              ? showDocument(item.File?.url, item.File?.mime)
              : showReportTextContent(item)
          }
          style={{
            fontWeight: item.ReportReviewed.length ? "normal" : "bold",
            color: item.ReportReviewed.length ? "black" : "blue",
          }}
        >
          {item.File ? item.File.name : "See text content"}
        </td>
        <td>
          <GenericListToggle
            name="Class"
            value={itemInfos.Class}
            handleChange={handleChange}
            list={reportClassCT}
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            name="SubClass"
            value={itemInfos.SubClass}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <td>
          <NavLink
            className="reports__link"
            to={`/staff/patient-record/${item.patient_id}`}
          >
            {toPatientName(item.patient_infos)}
          </NavLink>
        </td>
        <td>
          {patientNextAppointment &&
            timestampToHumanDateTimeTZ(
              patientNextAppointment.recurrence === "Once"
                ? patientNextAppointment.start
                : toNextOccurence(
                    patientNextAppointment.start,
                    patientNextAppointment.end,
                    patientNextAppointment.rrule,
                    patientNextAppointment.exrule
                  )[0]
            )}
        </td>
        <td>{timestampToDateISOTZ(item.EventDateTime)}</td>
        <td>{timestampToDateISOTZ(item.ReceivedDateTime)}</td>
        <td>
          {item.SourceAuthorPhysician?.AuthorFreeText
            ? item.SourceAuthorPhysician.AuthorFreeText
            : item.SourceAuthorPhysician?.AuthorName?.FirstName
            ? `${item.SourceAuthorPhysician?.AuthorName?.FirstName} ${item.SourceAuthorPhysician?.AuthorName?.LastName}`
            : ""}
        </td>
        <td>
          <InputTextToggle
            name="Notes"
            value={itemInfos.Notes || ""}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <SignCell item={item} />
      </tr>
      {messageVisible && (
        <FakeWindow
          title="NEW MESSAGE"
          width={1024}
          height={630}
          x={(window.innerWidth - 1024) / 2}
          y={(window.innerHeight - 630) / 2}
          color={"#94bae8"}
          setPopUpVisible={setMessageVisible}
        >
          {isTabletOrMobile ? (
            <NewMessageMobile
              setNewVisible={setMessageVisible}
              initialAttachments={attachments}
              initialPatient={{
                id: item.patient_id,
                name: toPatientName(item.patient_infos),
              }}
              initialBody={initialBody}
            />
          ) : (
            <NewMessage
              setNewVisible={setMessageVisible}
              initialAttachments={attachments}
              initialPatient={{
                id: item.patient_id,
                name: toPatientName(item.patient_infos),
              }}
              initialBody={initialBody}
            />
          )}
        </FakeWindow>
      )}
      {todoVisible && (
        <FakeWindow
          title="NEW TO-DO"
          width={1024}
          height={620}
          x={(window.innerWidth - 1024) / 2}
          y={(window.innerHeight - 620) / 2}
          color={"#94bae8"}
          setPopUpVisible={setTodoVisible}
        >
          {isTabletOrMobile ? (
            <NewTodoMobile
              setNewTodoVisible={setTodoVisible}
              initialAttachments={attachments}
              initialPatient={{
                id: item.patient_id,
                name: toPatientName(item.patient_infos),
              }}
              initialBody={initialBody}
            />
          ) : (
            <NewTodo
              setNewTodoVisible={setTodoVisible}
              initialAttachments={attachments}
              initialPatient={{
                id: item.patient_id,
                name: toPatientName(item.patient_infos),
              }}
              initialBody={initialBody}
            />
          )}
        </FakeWindow>
      )}
    </>
  );
};

export default ReportInboxItem;
