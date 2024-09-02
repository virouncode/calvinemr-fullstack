import React, { useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { usePatientPut } from "../../../../../hooks/reactquery/mutations/patientsMutations";
import {
  enrollmentStatusCT,
  terminationReasonCT,
} from "../../../../../omdDatas/codesTables";
import {
  DemographicsType,
  EnrolmentHistoryType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
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

type NewEnrolmentFormProps = {
  setNewEnrolmentVisible: React.Dispatch<React.SetStateAction<boolean>>;
  demographicsInfos: DemographicsType;
};

const NewEnrolmentForm = ({
  setNewEnrolmentVisible,
  demographicsInfos,
}: NewEnrolmentFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [newEnrolment, setNewEnrolment] = useState<EnrolmentHistoryType>({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErr("");
    const name = e.target.name;
    let value: string | number | null = e.target.value;
    if (name === "EnrollmentDate" || name === "EnrollmentTerminationDate") {
      value = dateISOToTimestampTZ(value);
    }
    if (name === "EnrolledToPhysicianFirstName") {
      setNewEnrolment({
        ...newEnrolment,
        EnrolledToPhysician: {
          ...newEnrolment.EnrolledToPhysician,
          Name: {
            ...newEnrolment.EnrolledToPhysician.Name,
            FirstName: value as string,
          },
        },
      });
      return;
    } else if (name === "EnrolledToPhysicianLastName") {
      setNewEnrolment({
        ...newEnrolment,
        EnrolledToPhysician: {
          ...newEnrolment.EnrolledToPhysician,
          Name: {
            ...newEnrolment.EnrolledToPhysician.Name,
            LastName: value as string,
          },
        },
      });
      return;
    } else if (name === "EnrolledToPhysicianOHIP") {
      setNewEnrolment({
        ...newEnrolment,
        EnrolledToPhysician: {
          ...newEnrolment.EnrolledToPhysician,
          OHIPPhysicianId: value as string,
        },
      });
      return;
    }
    setNewEnrolment({ ...newEnrolment, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Validation
    try {
      await enrolmentSchema.validate(newEnrolment);
    } catch (err) {
      if (err instanceof Error) setErr(err.message);
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
      onError: (err) => {
        if (err instanceof Error)
          toast.error(`Error: unable to add new enrolment : ${err.message}`, {
            containerId: "A",
          });
      },
    });
  };

  const handleCancel = () => {
    setNewEnrolmentVisible(false);
  };

  return (
    <div className="new-enrolment__form">
      <form onSubmit={handleSubmit}>
        {err && <p className="new-enrolment__err">{err}</p>}
        <div className="new-enrolment__form-physician">
          <label>Enrolled to physician: </label>
          <div className="new-enrolment__form-row new-enrolment__form-row--special">
            <Input
              value={newEnrolment?.EnrolledToPhysician?.Name?.FirstName || ""}
              onChange={handleChange}
              name="EnrolledToPhysicianFirstName"
              id="enrolment-first-name"
              label="First Name*:"
            />
          </div>
          <div className="new-enrolment__form-row new-enrolment__form-row--special">
            <Input
              value={newEnrolment?.EnrolledToPhysician?.Name?.LastName || ""}
              onChange={handleChange}
              name="EnrolledToPhysicianLastName"
              id="enrolment-last-name"
              label="Last Name*:"
            />
          </div>
          <div className="new-enrolment__form-row new-enrolment__form-row--special">
            <Input
              value={newEnrolment?.EnrolledToPhysician?.OHIPPhysicianId || ""}
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
            value={newEnrolment?.EnrollmentStatus}
            handleChange={handleChange}
            placeHolder="Choose a status..."
            noneOption={true}
            label="Enrolment status*:"
          />
        </div>
        <div className="new-enrolment__form-row">
          <InputDate
            value={timestampToDateISOTZ(newEnrolment?.EnrollmentDate)}
            onChange={handleChange}
            name="EnrollmentDate"
            id="enrolment-date"
            label="Enrolment date*:"
          />
        </div>
        <div className="new-enrolment__form-row">
          <InputDate
            value={timestampToDateISOTZ(
              newEnrolment?.EnrollmentTerminationDate
            )}
            onChange={handleChange}
            name="EnrollmentTerminationDate"
            id="enrolment-termination-date"
            label="Termination date:"
          />
        </div>
        <div className="new-enrolment__form-row">
          <GenericList
            list={terminationReasonCT}
            value={newEnrolment?.TerminationReason}
            handleChange={handleChange}
            name="TerminationReason"
            label="Termination reason:"
            placeHolder="Choose a reason..."
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

export default NewEnrolmentForm;
