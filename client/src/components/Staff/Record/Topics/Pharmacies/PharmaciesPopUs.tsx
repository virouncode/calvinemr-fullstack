import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import {
  DemographicsType,
  PharmacyType,
  XanoPaginatedType,
} from "../../../../../types/api";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import PharmaciesList from "./PharmaciesList";
import PharmacyCard from "./PharmacyCard";

type PharmaciesPopUpProps = {
  topicDatas: InfiniteData<XanoPaginatedType<PharmacyType>> | undefined;
  topicPost: UseMutationResult<
    PharmacyType,
    Error,
    Partial<PharmacyType>,
    void
  >;
  topicPut: UseMutationResult<PharmacyType, Error, PharmacyType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
  isPending: boolean;
  error: Error | null;
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<PharmacyType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
  demographicsInfos: DemographicsType;
};

const PharmaciesPopUp = ({
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
}: PharmaciesPopUpProps) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [preferredPharmacy, setPreferredPharmacy] = useState<
    PharmacyType | undefined
  >();

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
