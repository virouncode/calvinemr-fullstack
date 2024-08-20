import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import { ClinicalNoteType, PaginatedDatasType } from "../../../../../types/api";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import ClinicalNoteOverviewCard from "./ClinicalNoteOverviewCard";

type ClinicalNotesOverviewProps = {
  clinicalNotes: ClinicalNoteType[];
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<PaginatedDatasType<ClinicalNoteType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
};

const ClinicalNotesOverview = ({
  clinicalNotes,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
}: ClinicalNotesOverviewProps) => {
  //INTERSECTION OBSERVER
  const { divRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );
  return (
    <div className="clinical-notes__overview" ref={divRef}>
      {clinicalNotes.length > 0 ? (
        clinicalNotes.map((clinicalNote, index) =>
          index === clinicalNotes.length - 1 ? (
            <ClinicalNoteOverviewCard
              key={clinicalNote.id}
              clinicalNote={clinicalNote}
              lastItemRef={lastItemRef}
            />
          ) : (
            <ClinicalNoteOverviewCard
              key={clinicalNote.id}
              clinicalNote={clinicalNote}
            />
          )
        )
      ) : (
        <p>No clinical notes</p>
      )}
      {isFetchingNextPage && <LoadingParagraph />}
    </div>
  );
};

export default ClinicalNotesOverview;

///FRAIRE DU INFINITE SCROLL AUSSI
