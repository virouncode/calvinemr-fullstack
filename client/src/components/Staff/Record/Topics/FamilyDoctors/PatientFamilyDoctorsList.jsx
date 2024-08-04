import { useState } from "react";
import { toPatientLastName } from "../../../../../utils/names/toPatientName";
import Button from "../../../../UI/Buttons/Button";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import FamilyDoctorsList from "./FamilyDoctorsList";
import PatientFamilyDoctorItem from "./PatientFamilyDoctorItem";

const PatientFamilyDoctorsList = ({
  rootRefPatientDoctors,
  lastItemRefPatientDoctors,
  patientDoctors,
  patientId,
  isFetchingNextPagePatientDoctors,
  demographicsInfos,
  editCounter,
  doctors,
  isPendingDoctors,
  errorDoctors,
  isFetchingNextPageDoctors,
  fetchNextPageDoctors,
  isFetchingDoctors,
}) => {
  const [addVisible, setAddVisible] = useState(false);
  const handleAdd = () => {
    setAddVisible(true);
  };

  const patientDoctorsDatas = patientDoctors.pages.flatMap(
    (page) => page.items
  );

  return (
    <>
      <div className="doctors__table-title">
        <span style={{ marginRight: "10px" }}>{`${toPatientLastName(
          demographicsInfos,
          true
        )}'s other doctors`}</span>
        <Button onClick={handleAdd} label="Add" disabled={addVisible} />
      </div>
      <div className="doctors__table-container" ref={rootRefPatientDoctors}>
        <table className="doctors__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Last name</th>
              <th>First name</th>
              <th>Speciality</th>
              <th>Licence#</th>
              <th>OHIP#</th>
              <th>Address</th>
              <th>City</th>
              <th>Province/State</th>
              <th>Postal/Zip Code</th>
              <th>Phone</th>
              <th>Fax</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {patientDoctorsDatas && patientDoctorsDatas.length > 0
              ? patientDoctorsDatas.map((item, index) =>
                  index === patientDoctorsDatas.length - 1 ? (
                    <PatientFamilyDoctorItem
                      item={item}
                      patientId={patientId}
                      key={item.id}
                      lastItemRef={lastItemRefPatientDoctors}
                    />
                  ) : (
                    <PatientFamilyDoctorItem
                      item={item}
                      patientId={patientId}
                      key={item.id}
                    />
                  )
                )
              : !isFetchingNextPagePatientDoctors && (
                  <EmptyRow colSpan="13" text="No doctors" />
                )}
            {isFetchingNextPagePatientDoctors && <LoadingRow colSpan="13" />}
          </tbody>
        </table>
        {addVisible && (
          <FakeWindow
            title="ADD A NEW EXTERNAL DOCTOR TO PATIENT"
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color="#21201E"
            setPopUpVisible={setAddVisible}
          >
            <FamilyDoctorsList
              patientId={patientId}
              editCounter={editCounter}
              doctors={doctors}
              isPendingDoctors={isPendingDoctors}
              errorDoctors={errorDoctors}
              isFetchingNextPageDoctors={isFetchingNextPageDoctors}
              fetchNextPageDoctors={fetchNextPageDoctors}
              isFetchingDoctors={isFetchingDoctors}
            />
          </FakeWindow>
        )}
      </div>
    </>
  );
};

export default PatientFamilyDoctorsList;
