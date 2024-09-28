import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React from "react";
import { useFetchAllPages } from "../../../../../hooks/reactquery/useFetchAllPages";
import { genderCT, toCodeTableName } from "../../../../../omdDatas/codesTables";
import {
  ClinicalNoteType,
  DemographicsType,
  XanoPaginatedType,
} from "../../../../../types/api";
import {
  getAgeTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import Button from "../../../../UI/Buttons/Button";
import EnvelopeIcon from "../../../../UI/Icons/EnvelopeIcon";
import PhoneIcon from "../../../../UI/Icons/PhoneIcon";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import ClinicalNoteCardPrint from "./ClinicalNoteCardPrint";

type ClinicalNotesPrintProps = {
  demographicsInfos: DemographicsType;
  clinicalNotes: ClinicalNoteType[];
  checkedNotesIds: number[];
  selectAll: boolean;
  isPending: boolean;
  error: Error | null;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<ClinicalNoteType>, unknown>,
      Error
    >
  >;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
};

const ClinicalNotesPrint = ({
  demographicsInfos,
  clinicalNotes,
  checkedNotesIds,
  selectAll,
  isPending,
  error,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}: ClinicalNotesPrintProps) => {
  //Queries
  useFetchAllPages(fetchNextPage, hasNextPage, selectAll);

  const handlePrint = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.nativeEvent.view?.print();
  };

  if (isPending)
    return (
      <div className="clinical-notes__print-page">
        <LoadingParagraph />
      </div>
    );

  if (error)
    return (
      <div className="clinical-notes__print-page">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  const clinicalNotesToPrint = selectAll
    ? clinicalNotes
    : clinicalNotes.filter(({ id }) => checkedNotesIds.includes(id));

  return (
    <div className="clinical-notes__print">
      <div className="clinical-notes__print-btn">
        <Button onClick={handlePrint} label="Print" />
      </div>
      <p className="clinical-notes__print-infos">
        {toPatientName(demographicsInfos)},{" "}
        {toCodeTableName(genderCT, demographicsInfos.Gender)},{" "}
        {getAgeTZ(demographicsInfos.DateOfBirth)}, born{" "}
        {timestampToDateISOTZ(demographicsInfos.DateOfBirth)}, Chart Nbr:{" "}
        {demographicsInfos.ChartNumber}, <EnvelopeIcon />{" "}
        {demographicsInfos.Email}, <PhoneIcon />{" "}
        {
          demographicsInfos.PhoneNumber?.find(
            ({ _phoneNumberType }) => _phoneNumberType === "C"
          )?.phoneNumber
        }
      </p>
      {clinicalNotesToPrint.map((clinicalNote) => (
        <ClinicalNoteCardPrint
          clinicalNote={clinicalNote}
          key={clinicalNote.id}
        />
      ))}
      {isFetchingNextPage && <LoadingParagraph />}
    </div>
  );
};

export default ClinicalNotesPrint;
