
import useIntersection from "../../../../../hooks/useIntersection";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import ClinicalNoteOverviewCard from "./ClinicalNoteOverviewCard";

const ClinicalNotesOverview = ({
  clinicalNotes,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
}) => {
  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
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
