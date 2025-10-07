import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React, { useState } from "react";
import {
  DemographicsType,
  DoctorType,
  XanoPaginatedType,
} from "../../../../../types/api";
import { toPatientLastName } from "../../../../../utils/names/toPatientName";
import Button from "../../../../UI/Buttons/Button";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import FamilyDoctorsList from "./FamilyDoctorsList";
import PatientFamilyDoctorItem from "./PatientFamilyDoctorItem";

type PatientFamilyDoctorsListProps = {
  rootRefPatientDoctors: React.RefObject<HTMLDivElement>;
  targetRefPatientDoctors: (node: Element | null) => void;
  patientDoctors:
    | InfiniteData<XanoPaginatedType<DoctorType>, unknown>
    | undefined;
  patientId: number;
  isFetchingNextPagePatientDoctors: boolean;
  demographicsInfos: DemographicsType;
  editCounter: React.MutableRefObject<number>;
  doctors: InfiniteData<XanoPaginatedType<DoctorType>, unknown> | undefined;
  isPendingDoctors: boolean;
  errorDoctors: Error | null;
  isFetchingNextPageDoctors: boolean;
  fetchNextPageDoctors: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<DoctorType>, unknown>,
      Error
    >
  >;
  isFetchingDoctors: boolean;
};

const PatientFamilyDoctorsList = ({
  rootRefPatientDoctors,
  targetRefPatientDoctors,
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
}: PatientFamilyDoctorsListProps) => {
  const [addVisible, setAddVisible] = useState(false);
  const handleAdd = () => {
    setAddVisible(true);
  };
  const patientDoctorsDatas = patientDoctors?.pages.flatMap(
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
                      targetRef={targetRefPatientDoctors}
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
                  <EmptyRow colSpan={13} text="No doctors" />
                )}
            {isFetchingNextPagePatientDoctors && <LoadingRow colSpan={13} />}
          </tbody>
        </table>
        {addVisible && (
          <FakeWindow
            title="ADD A NEW EXTERNAL DOCTOR TO PATIENT"
            width={window.innerWidth}
            height={600}
            x={0}
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
