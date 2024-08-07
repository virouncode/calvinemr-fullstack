import { useState } from "react";
import { enrolmentCaptionComplete } from "../../../../../utils/names/enrolmentCaption";
import PenIcon from "../../../../UI/Icons/PenIcon";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import EnrolmentEdit from "./EnrolmentEdit";

const EnrolmentItem = ({
  enrolment,
  enrolmentIndex,
  demographicsInfos,
  enrolmentHistory,
}) => {
  const [editVisible, setEditVisible] = useState(false);

  const handleEdit = () => {
    setEditVisible(true);
  };
  return (
    <>
      <li className="enrolment-history__item" key={enrolment.EnrollmentDate}>
        - {enrolmentCaptionComplete(enrolment)}{" "}
        <PenIcon ml={5} onClick={handleEdit}></PenIcon>
      </li>
      {editVisible && (
        <FakeWindow
          title={`EDIT ENROLMENT`}
          width={500}
          height={400}
          x={(window.innerWidth - 500) / 2}
          y={(window.innerHeight - 400) / 2}
          color="#495867"
          setPopUpVisible={setEditVisible}
        >
          <EnrolmentEdit
            setEditVisible={setEditVisible}
            enrolment={enrolment}
            enrolmentIndex={enrolmentIndex}
            demographicsInfos={demographicsInfos}
            enrolmentHistory={enrolmentHistory}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default EnrolmentItem;
