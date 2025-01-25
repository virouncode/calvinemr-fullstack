import React, { useEffect, useRef, useState } from "react";
import {
  useTopicDelete,
  useTopicPost,
  useTopicPut,
} from "../../../../../hooks/reactquery/mutations/topicMutations";
import { useTopic } from "../../../../../hooks/reactquery/queries/topicQueries";
import { DemographicsType, PharmacyType } from "../../../../../types/api";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import PharmaciesList from "./PharmaciesList";
import PharmacyCard from "./PharmacyCard";

type PharmaciesPopUpProps = {
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;

  demographicsInfos: DemographicsType;
};

const PharmaciesPopUp = ({
  patientId,
  setPopUpVisible,
  demographicsInfos,
}: PharmaciesPopUpProps) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [preferredPharmacy, setPreferredPharmacy] = useState<
    PharmacyType | undefined
  >();
  const {
    data: topicDatas,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTopic("PHARMACIES", patientId);
  const topicPost = useTopicPost("PHARMACIES", patientId);
  const topicPut = useTopicPut("PHARMACIES", patientId);
  const topicDelete = useTopicDelete("PHARMACIES", patientId);

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
    <div className="pharmacies">
      <h1 className="pharmacies__title">Patient preferred pharmacy</h1>
      {preferredPharmacy ? (
        <PharmacyCard pharmacy={preferredPharmacy} />
      ) : (
        <p>No preferred pharmacy</p>
      )}
      <div className="pharmacies__btn-container">
        {preferredPharmacy ? (
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
    </div>
  );
};

export default PharmaciesPopUp;
