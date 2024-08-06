import { useState } from "react";
import {
  useDoctorDelete,
  useDoctorPost,
  useDoctorPut,
} from "../../../../../hooks/reactquery/mutations/doctorsMutations";
import useIntersection from "../../../../../hooks/useIntersection";
import Button from "../../../../UI/Buttons/Button";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import FamilyDoctorForm from "./FamilyDoctorForm";
import FamilyDoctorListItem from "./FamilyDoctorListItem";

const FamilyDoctorsList = ({
  patientId,
  editCounter,
  doctors,
  isPendingDoctors,
  errorDoctors,
  isFetchingNextPageDoctors,
  fetchNextPageDoctors,
  isFetchingDoctors,
}) => {
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  const doctorPost = useDoctorPost();
  const doctorPut = useDoctorPut();
  const doctorDelete = useDoctorDelete();

  //INTERSECTION OBSERVER
  const { rootRef: rootRefDoctors, lastItemRef: lastItemRefDoctors } =
    useIntersection(
      isFetchingNextPageDoctors,
      fetchNextPageDoctors,
      isFetchingDoctors
    );

  //HANDLERS
  const handleAdd = () => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  if (isPendingDoctors)
    return (
      <div className="doctors-list__title">
        External Doctors directory (as of [date])
        <LoadingParagraph />
      </div>
    );
  if (errorDoctors)
    return (
      <div className="doctors-list__title">
        External Doctors directory (as of [date])
        <ErrorParagraph errorMsg={errorDoctors.message} />
      </div>
    );
  const doctorsDatas = doctors.pages.flatMap((page) => page.items);

  return (
    <>
      <div className="doctors-list__title">
        External Doctors directory (as of [date])
        <Button onClick={handleAdd} label="Add" />
      </div>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="doctors-list__table-container" ref={rootRefDoctors}>
        <table className="doctors-list__table">
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
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {addVisible && (
              <FamilyDoctorForm
                editCounter={editCounter}
                setAddVisible={setAddVisible}
                patientId={patientId}
                setErrMsgPost={setErrMsgPost}
                errMsgPost={errMsgPost}
                doctorPost={doctorPost}
              />
            )}
            {doctorsDatas && doctorsDatas.length > 0
              ? doctorsDatas.map((item, index) =>
                  index === doctorsDatas.length - 1 ? (
                    <FamilyDoctorListItem
                      item={item}
                      key={item.id}
                      editCounter={editCounter}
                      patientId={patientId}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                      lastItemRef={lastItemRefDoctors}
                      doctorPut={doctorPut}
                      doctorDelete={doctorDelete}
                    />
                  ) : (
                    <FamilyDoctorListItem
                      item={item}
                      key={item.id}
                      editCounter={editCounter}
                      patientId={patientId}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                      doctorPut={doctorPut}
                      doctorDelete={doctorDelete}
                    />
                  )
                )
              : !isFetchingNextPageDoctors &&
                !addVisible && (
                  <EmptyRow colSpan="15" text="Doctors database empty" />
                )}
            {isFetchingNextPageDoctors && <LoadingRow colSpan="15" />}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FamilyDoctorsList;
