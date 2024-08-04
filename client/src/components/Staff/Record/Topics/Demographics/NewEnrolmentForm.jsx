import { useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { usePatientPut } from "../../../../../hooks/reactquery/mutations/patientsMutations";
import {
  enrollmentStatusCT,
  terminationReasonCT,
} from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { enrolmentSchema } from "../../../../../validation/record/enrolmentValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import GenericList from "../../../../UI/Lists/GenericList";

const NewEnrolmentForm = ({ setNewEnrolmentVisible, demographicsInfos }) => {
  const { user } = useUserContext();
  const [newEnrolment, setNewEnrolment] = useState({
    EnrollmentStatus: "",
    EnrollmentDate: null,
    EnrollmentTerminationDate: null,
    TerminationReason: "",
    EnrolledToPhysician: {
      Name: {
        FirstName: "",
        LastName: "",
      },
      OHIPPhysicianId: "",
    },
  });

  const [err, setErr] = useState("");
  const patientPut = usePatientPut(demographicsInfos.patient_id);

  const handleChange = (e) => {
    setErr("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "EnrollmentDate" || name === "EnrollmentTerminationDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    if (name === "EnrolledToPhysicianFirstName") {
      setNewEnrolment({
        ...newEnrolment,
        EnrolledToPhysician: {
          ...newEnrolment.EnrolledToPhysician,
          Name: { ...newEnrolment.EnrolledToPhysician.Name, FirstName: value },
        },
      });
      return;
    } else if (name === "EnrolledToPhysicianLastName") {
      setNewEnrolment({
        ...newEnrolment,
        EnrolledToPhysician: {
          ...newEnrolment.EnrolledToPhysician,
          Name: { ...newEnrolment.EnrolledToPhysician.Name, LastName: value },
        },
      });
      return;
    } else if (name === "EnrolledToPhysicianOHIP") {
      setNewEnrolment({
        ...newEnrolment,
        EnrolledToPhysician: {
          ...newEnrolment.EnrolledToPhysician,
          OHIPPhysicianId: value,
        },
      });
      return;
    }
    setNewEnrolment({ ...newEnrolment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await enrolmentSchema.validate(newEnrolment);
    } catch (err) {
      setErr(err.message);
      return;
    }
    if (
      newEnrolment.TerminationReason &&
      !newEnrolment.EnrollmentTerminationDate
    ) {
      setErr("Please enter a Termination date");
      return;
    }
    if (
      !newEnrolment.TerminationReason &&
      newEnrolment.EnrollmentTerminationDate
    ) {
      setErr("Please enter a Termination reason");
      return;
    }
    //Formatting
    const newEnrolmentToPost = {
      ...newEnrolment,
      EnrolledToPhysician: {
        ...newEnrolment.EnrolledToPhysician,
        Name: {
          FirstName: firstLetterUpper(
            newEnrolment.EnrolledToPhysician.Name.FirstName
          ),
          LastName: firstLetterUpper(
            newEnrolment.EnrolledToPhysician.Name.LastName
          ),
        },
      },
    };
    const datasToPut = {
      ...demographicsInfos,
      Enrolment: {
        EnrolmentHistory: [
          ...demographicsInfos.Enrolment.EnrolmentHistory,
          newEnrolmentToPost,
        ],
      },
      updates: [
        ...demographicsInfos.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };

    //Submission
    //Submission
    patientPut.mutate(datasToPut, {
      onSuccess: () => {
        setNewEnrolmentVisible(false);
        toast.success("New enrolment saved successfully", { containerId: "A" });
      },
      onError: () => {
        toast.error(`Error: unable to add new enrolment : ${err.message}`, {
          containerId: "A",
        });
      },
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setNewEnrolmentVisible(false);
  };

  return (
    <div className="new-enrolment__form">
      <form onSubmit={handleSubmit}>
        {err && <p className="new-enrolment__err">{err}</p>}
        <div className="new-enrolment__form-physician">
          <label>Enrolled to physician: </label>
          <div className="new-enrolment__form-row new-enrolment__form-row--special">
            <label htmlFor="enrolled-to-first-name">First Name*: </label>
            <input
              type="text"
              name="EnrolledToPhysicianFirstName"
              value={newEnrolment?.EnrolledToPhysician?.Name?.FirstName}
              onChange={handleChange}
              autoComplete="off"
              id="enrolled-to-first-name"
            />
          </div>
          <div className="new-enrolment__form-row new-enrolment__form-row--special">
            <label htmlFor="enrolled-to-last-name">Last Name*: </label>
            <input
              type="text"
              name="EnrolledToPhysicianLastName"
              value={newEnrolment?.EnrolledToPhysician?.Name?.LastName}
              onChange={handleChange}
              autoComplete="off"
              id="enrolled-to-last-name"
            />
          </div>
          <div className="new-enrolment__form-row new-enrolment__form-row--special">
            <label htmlFor="enrolled-to-ohip">OHIP#: </label>
            <input
              type="text"
              name="EnrolledToPhysicianOHIP"
              value={newEnrolment?.EnrolledToPhysician?.OHIPPhysicianId}
              onChange={handleChange}
              autoComplete="off"
              id="enrolled-to-ohip"
            />
          </div>
        </div>
        <div className="new-enrolment__form-row">
          <label>Enrolment status*:</label>
          <GenericList
            name="EnrollmentStatus"
            list={enrollmentStatusCT}
            value={newEnrolment?.EnrollmentStatus}
            handleChange={handleChange}
            placeHolder="Choose a status..."
            noneOption={true}
          />
        </div>
        <div className="new-enrolment__form-row">
          <label htmlFor="enrolled-to-date">Enrolment date*:</label>
          <input
            type="date"
            value={timestampToDateISOTZ(newEnrolment?.EnrollmentDate)}
            onChange={handleChange}
            name="EnrollmentDate"
            id="enrolled-to-date"
          />
        </div>
        <div className="new-enrolment__form-row">
          <label htmlFor="enrolled-to-termination-date">
            Termination date:
          </label>
          <input
            type="date"
            value={timestampToDateISOTZ(
              newEnrolment?.EnrollmentTerminationDate
            )}
            onChange={handleChange}
            name="EnrollmentTerminationDate"
            id="enrolled-to-termination-date"
          />
        </div>
        <div className="new-enrolment__form-row">
          <label>Termination reason:</label>
          <GenericList
            list={terminationReasonCT}
            value={newEnrolment?.TerminationReason}
            handleChange={handleChange}
            name="TerminationReason"
          />
        </div>
        <div className="new-enrolment__btn-container">
          <input type="submit" value="Save" />
          <CancelButton onClick={handleCancel} />
        </div>
      </form>
    </div>
  );
};

export default NewEnrolmentForm;
