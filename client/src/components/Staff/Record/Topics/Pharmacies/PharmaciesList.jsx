import { useState } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import Button from "../../../../UI/Buttons/Button";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import PharmacyForm from "./PharmacyForm";
import PharmacyItem from "./PharmacyItem";

const PharmaciesList = ({
  topicDatas,
  topicPost,
  topicPut,
  topicDelete,
  isPending,
  error,
  patientId,
  editCounter,
  demographicsInfos,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
}) => {
  //HOOKS
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  //HANDLERS
  const handleAddNewClick = () => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  if (isPending) {
    return (
      <>
        <div className="pharmacies-list__title">Pharmacies directory</div>
        <LoadingParagraph />
      </>
    );
  }
  if (error) {
    return (
      <>
        <div className="pharmacies-list__title">Pharmacies directory</div>
        <ErrorParagraph errorMsg={error.message} />
      </>
    );
  }

  const datas = topicDatas.pages.flatMap((page) => page.items);

  return (
    <>
      <div className="pharmacies-list__title">
        Pharmacies directory
        <Button
          onClick={handleAddNewClick}
          label="Add a new Pharmacy to directory"
        />
      </div>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="pharmacies-list__table-container" ref={rootRef}>
        <table className="pharmacies-list__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Name</th>
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
              <PharmacyForm
                editCounter={editCounter}
                setAddVisible={setAddVisible}
                setErrMsgPost={setErrMsgPost}
                errMsgPost={errMsgPost}
                topicPost={topicPost}
              />
            )}
            {datas && datas.length > 0
              ? datas.map((item, index) =>
                  index === datas.length - 1 ? (
                    <PharmacyItem
                      item={item}
                      key={item.id}
                      editCounter={editCounter}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                      lastItemRef={lastItemRef}
                      demographicsInfos={demographicsInfos}
                      topicPut={topicPut}
                      topicDelete={topicDelete}
                      patientId={patientId}
                    />
                  ) : (
                    <PharmacyItem
                      item={item}
                      key={item.id}
                      editCounter={editCounter}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                      demographicsInfos={demographicsInfos}
                      topicPut={topicPut}
                      topicDelete={topicDelete}
                      patientId={patientId}
                    />
                  )
                )
              : !isFetchingNextPage &&
                !addVisible && (
                  <EmptyRow colSpan="11" text="Pharmacies directory empty" />
                )}
            {isFetchingNextPage && <LoadingRow colSpan="11" />}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PharmaciesList;
