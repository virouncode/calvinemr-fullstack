import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useReportInboxPut } from "../../../hooks/reactquery/mutations/reportsMutations";
import { useAllPatientAppointments } from "../../../hooks/reactquery/queries/allPatientAppointmentsQueries";
import { reportClassCT } from "../../../omdDatas/codesTables";
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
import Input from "../../UI/Inputs/Input";
import InputTextToggle from "../../UI/Inputs/InputTextToggle";
import GenericListToggle from "../../UI/Lists/GenericListToggle";
import ErrorRow from "../../UI/Tables/ErrorRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import SignCell from "../../UI/Tables/SignCell";
import FakeWindow from "../../UI/Windows/FakeWindow";
import NewMessage from "../Messaging/Internal/NewMessage";
import NewTodo from "../Messaging/Internal/NewTodo";

const ReportsInboxItem = ({
  item,
  setForwardVisible,
  forwardVisible,
  setReportToForwardId,
  lastItemRef = null,
  errMsgPost,
  setErrMsgPost,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [progress, setProgress] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(item);
  const [todoVisible, setTodoVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [initialBody, setInitialBody] = useState("");
  const [patientNextAppointment, setPatientNextAppointment] = useState(null);
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

  const handleEdit = () => {
    setEditVisible(true);
  };

  const handleChange = (e) => {
    setErrMsgPost("");
    const value = e.target.value;
    const name = e.target.name;
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSend = (e, item) => {
    setMessageVisible(true);
    if (item.Format === "Binary") {
      setAttachments([
        {
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

  const handleTodo = (e, item) => {
    setTodoVisible(true);
    if (item.Format === "Binary") {
      setAttachments([
        {
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
    const reportToPut = {
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

  const handleForward = (e, reportId) => {
    setForwardVisible(true);
    setReportToForwardId(reportId);
  };

  const handleSave = async () => {
    setErrMsgPost("");
    //Validation
    try {
      await reportSchema.validate(itemInfos);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    setProgress(true);
    const datasToPut = { ...itemInfos };
    reportPut.mutate(datasToPut, {
      onSuccess: () => {
        setProgress(false);
        setEditVisible(false);
      },
      onError: () => {
        setProgress(false);
        setEditVisible(false);
      },
    });
  };

  const handleCancel = () => {
    setErrMsgPost("");
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
                  onClick={(e) => handleForward(e, item.id)}
                  disabled={forwardVisible || progress}
                  label="Forward"
                />
                <Button
                  onClick={(e) => handleSend(e, item)}
                  disabled={messageVisible || progress}
                  label="Message"
                />
                <Button
                  onClick={(e) => handleTodo(e, item)}
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
            type="text"
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
          {editVisible ? (
            <Input
              name="AuthorFreeText"
              value={itemInfos.AuthorFreeText || ""}
              onChange={handleChange}
            />
          ) : item.SourceAuthorPhysician?.AuthorFreeText ? (
            item.SourceAuthorPhysician.AuthorFreeText
          ) : item.SourceAuthorPhysician?.AuthorName?.FirstName ? (
            `${item.SourceAuthorPhysician?.AuthorName?.FirstName} ${item.SourceAuthorPhysician?.AuthorName?.LastName}`
          ) : (
            ""
          )}
        </td>
        <td>
          <InputTextToggle
            name="Notes"
            value={itemInfos.Notes || ""}
            onChange={handleChange}
            editVisible={editVisible}
          />
        </td>
        <SignCell item={item} staffInfos={staffInfos} />
      </tr>
      {messageVisible && (
        <FakeWindow
          title="NEW MESSAGE"
          width={1300}
          height={630}
          x={(window.innerWidth - 1300) / 2}
          y={(window.innerHeight - 630) / 2}
          color={"#94bae8"}
          setPopUpVisible={setMessageVisible}
        >
          <NewMessage
            setNewVisible={setMessageVisible}
            initialAttachments={attachments}
            initialPatient={{
              id: item.patient_id,
              name: toPatientName(item.patient_infos),
            }}
            initialBody={initialBody}
          />
        </FakeWindow>
      )}
      {todoVisible && (
        <FakeWindow
          title="NEW TO-DO"
          width={1300}
          height={620}
          x={(window.innerWidth - 1300) / 2}
          y={(window.innerHeight - 620) / 2}
          color={"#94bae8"}
          setPopUpVisible={setTodoVisible}
        >
          <NewTodo
            setNewTodoVisible={setTodoVisible}
            initialAttachments={attachments}
            initialPatient={{
              id: item.patient_id,
              name: toPatientName(item.patient_infos),
            }}
            initialBody={initialBody}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default ReportsInboxItem;
