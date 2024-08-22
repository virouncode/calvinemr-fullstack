import React from "react";
import { useClinicalNotes } from "../../../../hooks/reactquery/queries/clinicalNotesQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import EmptyParagraph from "../../../UI/Paragraphs/EmptyParagraph";
import ExportClinicalNoteCard from "./ExportClinicalNoteCard";

type ExportClinicalNotesProps = {
  patientId: number;
};

const ExportClinicalNotes = ({ patientId }: ExportClinicalNotesProps) => {
  //Queries
  const { data, isPending, error, fetchNextPage, isFetching, hasNextPage } =
    useClinicalNotes(patientId, "", "desc");

  useFetchAllPages(fetchNextPage, hasNextPage);

  const CARD_STYLE = {
    width: "95%",
    margin: "20px auto",
    border: "solid 1px #cecdcd",
    borderRadius: "6px",
    overflow: "hidden",
    fontFamily: "Lato, Arial,sans-serif",
  };
  const TITLE_STYLE = {
    fontWeight: "bold",
    padding: "10px",
    color: "#FEFEFE",
    backgroundColor: "#94BAE8",
  };
  const CONTENT_STYLE = {
    padding: "10px",
  };

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const clinicalNotes = data.pages.flatMap((page) => page.items);

  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>CLINICAL NOTES</p>
      <div style={CONTENT_STYLE}>
        {clinicalNotes && clinicalNotes.length > 0
          ? clinicalNotes.map((clinicalNote) => (
              <ExportClinicalNoteCard
                clinicalNote={clinicalNote}
                key={clinicalNote.id}
              />
            ))
          : !isFetching && <EmptyParagraph text="No clinical notes" />}
      </div>
    </div>
  );
};

export default ExportClinicalNotes;
