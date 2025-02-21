import React from "react";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import { SearchStaffType } from "../../../types/api";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import ClinicPracticiansList from "./ClinicPracticiansList";
import ExternalPracticiansList from "./ExternalPracticiansList";

type PracticiansSearchResultsProps = {
  debouncedSearch: SearchStaffType;
};

const PracticiansSearchResults = ({
  debouncedSearch,
}: PracticiansSearchResultsProps) => {
  const { data: sites, isPending, error } = useSites();
  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;
  return (
    <div className="doctors">
      <ClinicPracticiansList sites={sites} debouncedSearch={debouncedSearch} />
      <ExternalPracticiansList debouncedSearch={debouncedSearch} />
    </div>
  );
};

export default PracticiansSearchResults;
