import React, { useRef, useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useTopicPost,
  useTopicPut,
} from "../../../hooks/reactquery/mutations/topicMutations";
import { usePatientPharmacies } from "../../../hooks/reactquery/queries/patientPharmaciesQueries";
import useDebounce from "../../../hooks/useDebounce";
import { UserPatientType } from "../../../types/app";
import PharmaciesList from "../../Staff/Record/Topics/Pharmacies/PharmaciesList";
import PharmacyCard from "../../Staff/Record/Topics/Pharmacies/PharmacyCard";
import PharmaciesSearch from "./PharmaciesSearch";

const PatientPharmacies = () => {
  const { user } = useUserContext() as { user: UserPatientType };
  const [search, setSearch] = useState({
    name: "",
    address: "",
    city: "",
    postal_code: "",
    phone: "",
  });
  const debouncedSearch = useDebounce(search, 300);
  const preferredPharmacy = user.demographics?.preferred_pharmacy;
  const {
    data: topicDatas,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePatientPharmacies(user.id, debouncedSearch);

  const topicPost = useTopicPost("PHARMACIES", user.id);
  const topicPut = useTopicPut("PHARMACIES", user.id);
  const editCounter = useRef(0);

  return (
    <>
      <div className="patient-pharmacies__preferred">
        <div className="patient-pharmacies__preferred-title">
          My preferred pharmacy
        </div>
        {preferredPharmacy ? (
          <PharmacyCard pharmacy={preferredPharmacy} />
        ) : (
          <p className="patient-pharmacies__preferred-empty">
            No preferred pharmacy
          </p>
        )}
      </div>
      <div className="patient-pharmacies__directory">
        <div className="patient-pharmacies__directory-title">
          Choose your preferred pharmacy or add a new one
        </div>
        <p className="patient-pharmacies__directory-label">Search by</p>
        <PharmaciesSearch search={search} setSearch={setSearch} />
        <PharmaciesList
          topicDatas={topicDatas}
          topicPost={topicPost}
          topicPut={topicPut}
          isPending={isPending}
          error={error}
          patientId={user.id}
          editCounter={editCounter}
          demographicsInfos={user.demographics}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};

export default PatientPharmacies;
