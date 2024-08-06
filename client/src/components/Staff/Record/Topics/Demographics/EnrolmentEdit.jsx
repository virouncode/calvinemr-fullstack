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
import SubmitButton from "../../../../UI/Buttons/SubmitButton";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import GenericList from "../../../../UI/Lists/GenericList";

const EnrolmentEdit = ({
  setEditVisible,
  enrolment,
  enrolmentIndex,
  demographicsInfos,
  enrolmentHistory,
}) => {
  const { user } = useUserContext();
  const [err, setErr] = useState("");
  const [formDatas, setFormDatas] = useState(enrolment);
  const patientPut = usePatientPut(demographicsInfos.patient_id);

  const handleChange = (e) => {
    setErr("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "EnrollmentDate" || name === "EnrollmentTerminationDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    if (name === "EnrolledToPhysicianFirstName") {
      setFormDatas({
        ...formDatas,
        EnrolledToPhysician: {
          ...formDatas.EnrolledToPhysician,
          Name: { ...formDatas.EnrolledToPhysician.Name, FirstName: value },
        },
      });
      return;
    } else if (name === "EnrolledToPhysicianLastName") {
      setFormDatas({
        ...formDatas,
        EnrolledToPhysician: {
          ...formDatas.EnrolledToPhysician,
          Name: { ...formDatas.EnrolledToPhysician.Name, LastName: value },
        },
      });
      return;
    } else if (name === "EnrolledToPhysicianOHIP") {
      setFormDatas({
        ...formDatas,
        EnrolledToPhysician: {
          ...formDatas.EnrolledToPhysician,
          OHIPPhysicianId: value,
        },
      });
      return;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await enrolmentSchema.validate(formDatas);
    } catch (err) {
      setErr(err.message);
      return;
    }
    if (formDatas.TerminationReason && !formDatas.EnrollmentTerminationDate) {
      setErr("Please enter a Termination date");
      return;
    }
    if (!formDatas.TerminationReason && formDatas.EnrollmentTerminationDate) {
      setErr("Please enter a Termination reason");
      return;
    }
    //Formatting
    const newEnrolmentToPut = {
      ...formDatas,
      EnrolledToPhysician: {
        ...formDatas.EnrolledToPhysician,
        Name: {
          FirstName: firstLetterUpper(
            formDatas.EnrolledToPhysician.Name.FirstName
          ),
          LastName: firstLetterUpper(
            formDatas.EnrolledToPhysician.Name.LastName
          ),
        },
      },
    };
    const datasToPut = {
      ...demographicsInfos,
      Enrolment: {
        EnrolmentHistory: enrolmentHistory.map((enrolment, index) =>
          index === enrolmentIndex ? newEnrolmentToPut : enrolment
        ),
      },
      updates: [
        ...demographicsInfos.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };

    //Submission
    patientPut.mutate(datasToPut, {
      onSuccess: () => {
        setEditVisible(false);
        toast.success("Enrolment saved successfully", { containerId: "A" });
      },
      onError: () => {
        toast.error(`Error: unable to save enrolment : ${err.message}`, {
          containerId: "A",
        });
      },
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setEditVisible(false);
  };

  return (
    <div className="new-enrolment__form">
      <form onSubmit={handleSubmit}>
        {err && <p className="new-enrolment__err">{err}</p>}
        <div className="new-enrolment__form-physician">
          <label>Enrolled to physician: </label>
          <div className="new-enrolment__form-row new-enrolment__form-row--special">
            <Input
              value={formDatas?.EnrolledToPhysician?.Name?.FirstName || ""}
              onChange={handleChange}
              name="EnrolledToPhysicianFirstName"
              id="enrolment-first-name"
              label="First Name*:"
            />
          </div>
          <div className="new-enrolment__form-row new-enrolment__form-row--special">
            <Input
              value={formDatas?.EnrolledToPhysician?.Name?.LastName || ""}
              onChange={handleChange}
              name="EnrolledToPhysicianLastName"
              id="enrolment-last-name"
              label="Last Name*:"
            />
          </div>
          <div className="new-enrolment__form-row new-enrolment__form-row--special">
            <Input
              value={formDatas?.EnrolledToPhysician?.OHIPPhysicianId || ""}
              onChange={handleChange}
              name="EnrolledToPhysicianOHIP"
              id="enrolment-ohip"
              label="OHIP#:"
            />
          </div>
        </div>
        <div className="new-enrolment__form-row">
          <GenericList
            name="EnrollmentStatus"
            list={enrollmentStatusCT}
            value={formDatas?.EnrollmentStatus || ""}
            handleChange={handleChange}
            placeHolder="Choose a status..."
            noneOption={true}
            label="Enrolment status*:"
          />
        </div>
        <div className="new-enrolment__form-row">
          <InputDate
            value={timestampToDateISOTZ(formDatas?.EnrollmentDate)}
            onChange={handleChange}
            name="EnrollmentDate"
            id="enrolment-date"
            label="Enrolment date*:"
          />
        </div>
        <div className="new-enrolment__form-row">
          <InputDate
            value={timestampToDateISOTZ(formDatas?.EnrollmentTerminationDate)}
            onChange={handleChange}
            name="EnrollmentTerminationDate"
            id="enrolment-termination-date"
            label="Termination date:"
          />
        </div>
        <div className="new-enrolment__form-row">
          <GenericList
            list={terminationReasonCT}
            value={formDatas?.TerminationReason || ""}
            handleChange={handleChange}
            name="TerminationReason"
            label="Termination reason:"
          />
        </div>
        <div className="new-enrolment__btn-container">
          <SubmitButton label="Save" />
          <CancelButton onClick={handleCancel} />
        </div>
      </form>
    </div>
  );
};

export default EnrolmentEdit;
