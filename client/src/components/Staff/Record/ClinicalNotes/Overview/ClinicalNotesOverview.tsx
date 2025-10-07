import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import { ClinicalNoteType, XanoPaginatedType } from "../../../../../types/api";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import ClinicalNoteOverviewCard from "./ClinicalNoteOverviewCard";

type ClinicalNotesOverviewProps = {
  clinicalNotes: ClinicalNoteType[];
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<ClinicalNoteType>, unknown>,
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
  //Intersection observer
  const { rootRef, targetRef } = useIntersection<HTMLDivElement | null>(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );
  return (
    <div className="clinical-notes__overview" ref={rootRef}>
      {clinicalNotes.length > 0 ? (
        clinicalNotes.map((clinicalNote, index) =>
          index === clinicalNotes.length - 1 ? (
            <ClinicalNoteOverviewCard
              key={clinicalNote.id}
              clinicalNote={clinicalNote}
              targetRef={targetRef}
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
