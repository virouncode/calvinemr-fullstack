import React, { useState } from "react";
import {
  useDoctorPost,
  useDoctorPut,
} from "../../../hooks/reactquery/mutations/doctorsMutations";
import { useDoctorsSearch } from "../../../hooks/reactquery/queries/doctorsQueries";
import useIntersection from "../../../hooks/useIntersection";
import { SearchStaffType } from "../../../types/api";
import Button from "../../UI/Buttons/Button";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../UI/Tables/EmptyRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import ExternalDoctorListItem from "./ExternalDoctorListItem";
import ExternalPracticianForm from "./ExternalPracticianForm";

type ExternalPracticiansListProps = {
  debouncedSearch: SearchStaffType;
};

const ExternalPracticiansList = ({
  debouncedSearch,
}: ExternalPracticiansListProps) => {
  //Hooks
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  //Queries
  const doctorPost = useDoctorPost();
  const doctorPut = useDoctorPut();

  const {
    data: doctors,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useDoctorsSearch(debouncedSearch);

  //Intersection observer
  const { rootRef, targetRef } = useIntersection<HTMLDivElement | null>(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const handleAdd = () => {
    setAddVisible(true);
  };

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;

  const externalDoctorsDatas = doctors?.pages?.flatMap((page) => page.items);

  return (
    <div className="doctors-list">
      <div className="doctors-list__title">
        External Practitioners directory
        <Button onClick={handleAdd} label="Add" />
      </div>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div
        className="doctors-list__table-container doctors-list__table-container--practician"
        ref={rootRef}
      >
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
              <ExternalPracticianForm
                setAddVisible={setAddVisible}
                setErrMsgPost={setErrMsgPost}
                errMsgPost={errMsgPost}
                doctorPost={doctorPost}
              />
            )}
            {externalDoctorsDatas && externalDoctorsDatas.length > 0
              ? externalDoctorsDatas.map((item, index) =>
                  index === externalDoctorsDatas.length - 1 ? (
                    <ExternalDoctorListItem
                      item={item}
                      key={item.id}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                      targetRef={targetRef}
                      doctorPut={doctorPut}
                    />
                  ) : (
                    <ExternalDoctorListItem
                      item={item}
                      key={item.id}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                      doctorPut={doctorPut}
                    />
                  )
                )
              : !isFetchingNextPage &&
                !addVisible && <EmptyRow colSpan={15} text="No results" />}
            {isFetchingNextPage && <LoadingRow colSpan={15} />}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExternalPracticiansList;
