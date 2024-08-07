import { useEffect, useRef, useState } from "react";
import { isObjectEmpty } from "../../../../../utils/js/isObjectEmpty";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import PharmaciesList from "./PharmaciesList";
import PharmacyCard from "./PharmacyCard";

const PharmaciesPU = ({
  topicDatas,
  topicPost,
  topicPut,
  topicDelete,
  isPending,
  error,
  patientId,
  setPopUpVisible,
  demographicsInfos,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [preferredPharmacy, setPreferredPharmacy] = useState(
    demographicsInfos.preferred_pharmacy
  );
  useEffect(() => {
    setPreferredPharmacy(demographicsInfos.preferred_pharmacy);
  }, [demographicsInfos.preferred_pharmacy]);

  //HANDLERS
  const handleClose = async () => {
    if (
      editCounter.current === 0 ||
      (editCounter.current > 0 &&
        (await confirmAlert({
          content: "Do you really want to close the window ?",
        })))
    ) {
      setPopUpVisible(false);
    }
  };

  const handleAdd = () => {
    setAddVisible((v) => !v);
  };

  return (
    <>
      <h1 className="pharmacies__title">Patient preferred pharmacy</h1>
      {!isObjectEmpty(preferredPharmacy) ? (
        <PharmacyCard
          pharmacy={preferredPharmacy}
          demographicsInfos={demographicsInfos}
        />
      ) : (
        <p>No preferred pharmacy</p>
      )}
      <div className="pharmacies__btn-container">
        {isObjectEmpty(preferredPharmacy) ? (
          <Button
            onClick={handleAdd}
            disabled={addVisible}
            label="Add a preferred pharmacy"
          />
        ) : (
          <Button onClick={handleAdd} disabled={addVisible} label="Change" />
        )}
        <CloseButton onClick={handleClose} />
      </div>
      {addVisible && (
        <PharmaciesList
          topicDatas={topicDatas}
          topicPost={topicPost}
          topicPut={topicPut}
          topicDelete={topicDelete}
          isPending={isPending}
          error={error}
          patientId={patientId}
          editCounter={editCounter}
          demographicsInfos={demographicsInfos}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isFetching={isFetching}
        />
      )}
    </>
  );
};

export default PharmaciesPU;
